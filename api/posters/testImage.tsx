import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import chromium from 'chrome-aws-lambda'
import {APIGatewayProxyEvent} from 'aws-lambda'
import {Page, Viewport} from 'puppeteer-core'
import AWS from 'aws-sdk'

import {getMockData} from '@web/components/poster/Poster/Poster.utils'
import {getRandomString} from '@api/lib/random'
import {logger} from '@nebula/log'

import {InstagramPoster, OpenGraphPoster} from './components'
import HighQualityPoster from './components/HighQualityPoster'

const S3 = new AWS.S3({
  ...(process.env.IS_OFFLINE && {
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4569').href,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  }),
})

const dimensions = {
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

export async function testImage(event: APIGatewayProxyEvent) {
  try {
    logger.info('Starting browser...')
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    await uploadScreenshot({
      page,
      html: ReactDOMServer.renderToString(
        <InstagramPoster data={getMockData()} />,
      ),
      viewport: dimensions.instagram,
      fileName: `${getRandomString()}-1080x1080.png`,
      comment: 'Instagram poster',
    })

    await uploadScreenshot({
      page,
      html: ReactDOMServer.renderToString(
        <OpenGraphPoster data={getMockData()} />,
      ),
      viewport: dimensions.openGraph,
      fileName: `${getRandomString()}-1280x680.png`,
      comment: 'Open Graph poster',
    })

    await uploadScreenshot({
      page,
      html: ReactDOMServer.renderToString(
        <HighQualityPoster data={getMockData()} />,
      ),
      viewport: dimensions.highQuality,
      fileName: `${getRandomString()}-1800x2400.png`,
      comment: 'High quality poster',
    })

    logger.info('Cleaning up...')
    await browser.close()

    return {
      statusCode: 200,
      body: JSON.stringify('Success!'),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify('Error: ' + e),
    }
  }
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
  await page.setContent(html)
  await page.setViewport(viewport)

  logger.info(`Starting screenshot generation for ${comment}...`)
  const screenshot = await page.screenshot()

  logger.info(`Finished generating screenshot!`)

  logger.info(`Uploading screenshot to S3`)

  return await S3.putObject({
    Bucket: process.env.POSTER_BUCKET,
    Key: fileName,
    Body: screenshot as any,
  }).promise()
}
