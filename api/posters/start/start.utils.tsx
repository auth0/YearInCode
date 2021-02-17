import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Octokit, RestEndpointMethodTypes} from '@octokit/rest'
import parseLinkHeader from 'parse-link-header'
import {Page, Viewport} from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'
import AWS from 'aws-sdk'

import {logger} from '@nebula/log'
import {Poster, PosterImageSizes, PosterSteps} from '@nebula/types/poster'
import {sendMessageToClient} from '@api/lib/websocket'
import {Year} from '@nebula/types/queue'

import {
  InstagramPoster,
  OpenGraphPoster,
  HighQualityPoster,
} from '../components'
import PosterModel from '../poster.model'
import ConnectionModel from '../connection.model'
import TwitterPoster from '../components/TwitterPoster'

export type Repositories = RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data']

const S3 = new AWS.S3({
  ...(process.env.IS_OFFLINE && {
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4569').href,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  }),
})

export async function getUserRepositoriesByPage(
  client: Octokit,
  page: number,
  year: Year,
) {
  logger.info(`Getting repository page ${page}`)

  const MAX_REPOSITORIES_PER_PAGE_ALLOWED = 100
  const result = await client.repos.listForAuthenticatedUser({
    visibility: 'public',
    sort: 'pushed',
    per_page: MAX_REPOSITORIES_PER_PAGE_ALLOWED,
    since: new Date(year, 0, 1).toISOString(),
    page,
  })

  const payload: {repositories: Repositories; totalPages: number} = {
    repositories: result.data,
    totalPages: 1,
  }

  if (result.headers.link) {
    const parsedPagination = parseLinkHeader(result.headers.link)
    payload.totalPages = Number(parsedPagination.last?.page)
  }

  if (
    Number(result.headers['x-ratelimit-limit']) <
    payload.totalPages * MAX_REPOSITORIES_PER_PAGE_ALLOWED
  ) {
    throw new Error(
      'Not enough rate limit left for User. Trying again in 15 minutes.',
    )
  }

  return payload
}

const SES = new AWS.SES({
  region: 'us-east-1',
  ...(process.env.IS_OFFLINE && {endpoint: 'http://localhost:9001'}),
})

export async function sendPosterMail({
  sendTo = 'success@simulator.amazonses.com',
}: {
  sendTo: string
}) {
  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: [sendTo],
    },
    Source: 'jfelix@stackbuilders.com',
    Message: {
      Subject: {
        Data: `[Name], your year in code poster is ready!`,
      },
      Body: {
        Text: {
          Data: `Thank you for taking the time to create your poster and sharing your creativity with the world. At Auth0 we love developers and we appreciate the work you do every day in creating a more convenient and secure world. 

          To download your poster: click here
          To share your poster on social media: click here
          
          A note from our benevolent sponsors at Auth0:
          
          Auth0 makes securing your apps simple, and secure even as you scale to the moon. Developers at 
          `,
        },
      },
    },
  }

  await SES.sendEmail(params)
}

export async function generateImagesAndUploadToS3(
  data: Poster,
  posterSlug: string,
) {
  const dimensions = {
    twitter: {
      width: 1080,
      height: 512,
    },
    instagram: {
      width: 1080,
      height: 1080,
    },
    openGraph: {
      width: 1280,
      height: 680,
    },
    highQuality: {
      width: 1800,
      height: 2400,
      deviceScaleFactor: 3,
    },
  }
  const fileNames: PosterImageSizes = {
    twitter: '',
    instagram: '',
    openGraph: '',
    highQualityPoster: '',
  }

  logger.info('Starting browser...')
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
  const page = await browser.newPage()

  const twitterPosterFileName = await uploadScreenshot({
    page,
    html: ReactDOMServer.renderToString(<TwitterPoster data={data} />),
    viewport: dimensions.twitter,
    fileName: `${posterSlug}-1080x512.png`,
    comment: 'Twitter poster',
  })

  fileNames.twitter = twitterPosterFileName

  const instagramPosterFileName = await uploadScreenshot({
    page,
    html: ReactDOMServer.renderToString(<InstagramPoster data={data} />),
    viewport: dimensions.instagram,
    fileName: `${posterSlug}-1080x1080.png`,
    comment: 'Instagram poster',
  })

  fileNames.instagram = instagramPosterFileName

  const openGraphPosterFileName = await uploadScreenshot({
    page,
    html: ReactDOMServer.renderToString(<OpenGraphPoster data={data} />),
    viewport: dimensions.openGraph,
    fileName: `${posterSlug}-1280x680.png`,
    comment: 'Open Graph poster',
  })

  fileNames.openGraph = openGraphPosterFileName

  const highQualityPosterFileName = await uploadScreenshot({
    page,
    html: ReactDOMServer.renderToString(<HighQualityPoster data={data} />),
    viewport: dimensions.highQuality,
    fileName: `${posterSlug}-1800x2400.png`,
    comment: 'High quality poster',
  })

  fileNames.highQualityPoster = highQualityPosterFileName

  logger.info('Cleaning up browser...')
  await browser.close()

  return fileNames
}

async function uploadScreenshot({
  page,
  html,
  fileName,
  viewport,
  comment = '',
}: {
  page: Page
  html: string
  fileName: string
  comment?: string
  viewport: Viewport
}) {
  logger.info(`Setting page content for ${comment}...`)
  await page.setContent(html, {waitUntil: 'networkidle0'})
  await page.setViewport(viewport)

  logger.info(`Starting screenshot generation for ${comment}...`)
  const screenshot = await page.screenshot()

  logger.info(`Finished generating screenshot!`)

  logger.info(`Uploading screenshot to S3`)

  await S3.putObject({
    Bucket: process.env.POSTER_BUCKET,
    Key: fileName,
    Body: screenshot as any,
  }).promise()

  return fileName
}

export async function sendUpdateToClient(
  posterSlug: string,
  userId: string,
  step: PosterSteps,
) {
  await PosterModel.update({posterSlug, userId}, {step})

  try {
    const websocketConnectionUrl = process.env.IS_OFFLINE
      ? 'http://localhost:3001'
      : process.env.WEBSOCKET_API_ENDPOINT

    const result = await ConnectionModel.query('userId')
      .eq(userId)
      .using('userIdIndex')
      .exec()

    if (result.length) {
      // Send update to all devices
      const clientsPromises = result.map(async ({connectionId}) =>
        sendMessageToClient(websocketConnectionUrl, connectionId, {
          step,
          posterSlug,
        }),
      )

      await Promise.all(clientsPromises)
    }
  } catch (error) {
    logger.error(error)
  }
}
