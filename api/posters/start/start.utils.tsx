import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Octokit, RestEndpointMethodTypes} from '@octokit/rest'
import parseLinkHeader from 'parse-link-header'
import {Page, Viewport} from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'
import AWS from 'aws-sdk'
import {concatLimit, mapLimit, retry} from 'async'
import {ManagementClient} from 'auth0'

import {logger} from '@nebula/log'
import {
  ConnectionDocument,
  Poster,
  PosterImageSizes,
  PosterSteps,
  PosterWeek,
} from '@nebula/types/poster'
import {sendMessageToClient} from '@api/lib/websocket'
import {Year} from '@nebula/types/queue'
import {getWeekNumber, unixTimestampToDate} from '@api/lib/date'
import {indexOfMax} from '@nebula/common/array'

import {
  InstagramPoster,
  OpenGraphPoster,
  HighQualityPoster,
  TwitterPoster,
} from '../components'
import PosterModel from '../poster.model'
import ConnectionModel from '../connection.model'

import ErrorNotification from './components/ErrorNotification'

export type Repositories = RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data']

const S3 = new AWS.S3({
  ...(process.env.IS_OFFLINE && {
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4569').href,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  }),
})

const auth0Management = new ManagementClient({
  domain:
    process.env.IS_OFFLINE || process.env.NODE_ENV === 'test'
      ? process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? 'test.us.auth0.com'
      : (process.env.AUTH0_DOMAIN as string),
  clientId:
    process.env.IS_OFFLINE || process.env.NODE_ENV === 'test'
      ? process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? 'MOCK_CLIENT_ID'
      : process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET ?? 'CLIENT_SECRET',
  scope: 'read:users read:user_idp_tokens',
})

export async function getGitHubToken(userId: string) {
  const {identities} = await auth0Management.getUser({
    id: userId,
  })

  const githubToken = identities?.find(
    identity => identity.provider === 'github',
  )?.access_token

  return githubToken
}

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
    payload.totalPages = Number(parsedPagination?.last?.page)
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

export async function getRepositoriesByTotalPages(
  totalPages: number,
  year: Year,
  githubClient: Octokit,
) {
  const repositories: Repositories = (await concatLimit(
    Array.from({length: totalPages - 1}, (_, i) => i + 2),
    10,
    async (page, callback) => {
      try {
        const {repositories} = await getUserRepositoriesByPage(
          githubClient,
          page,
          year,
        )

        if (!repositories) {
          return callback(new Error("couldn't get repositories"))
        }

        callback(null, repositories)
      } catch (e) {
        callback(new Error('Unexpected error ' + e))
      }
    },
  )) as any

  return repositories
}

export interface RepositoryStatistic {
  repository: string
  language: string
  weeks: {
    w?: string
    a?: number
    d?: number
    c?: number
  }[]
}

export async function getRepositoryStats(
  repositories: Repositories,
  username: string,
  githubClient: Octokit,
) {
  const result: RepositoryStatistic[] = await mapLimit(
    repositories,
    10,
    async ({name: repositoryName, owner, language}, callback) => {
      if (owner === null || language === null) return callback(null)
      try {
        const repositoryStats: RestEndpointMethodTypes['repos']['getContributorsStats']['response'] = (await retry(
          {times: 20, interval: 6000},
          async retryCallback => {
            try {
              const stats = await githubClient.repos.getContributorsStats({
                owner: owner.login,
                repo: repositoryName,
              })

              const IS_NOT_CACHED_STATUS_CODE = 202
              if ((stats.status as number) === IS_NOT_CACHED_STATUS_CODE) {
                logger.info(
                  `Repository (${repositoryName}) statistics cache data is not available. retrying.`,
                )

                return retryCallback(new Error('Retrying fetch'))
              }

              retryCallback(null, stats)
            } catch (e) {
              retryCallback(new Error('Unexpected error ' + e))
            }
          },
        )) as any

        if (!Array.isArray(repositoryStats.data)) {
          return callback(null, undefined)
        }

        const userStats = repositoryStats.data.find(
          ({author}) => author?.login === username,
        )

        if (!userStats) {
          return callback(null, undefined)
        }

        const payload: RepositoryStatistic = {
          repository: repositoryName,
          language,
          weeks: userStats.weeks,
        }

        callback(null, payload)
      } catch (e) {
        callback(new Error('Unexpected error ' + e))
      }
    },
  )

  return result
}

type IncompleteWeeks = Omit<
  PosterWeek,
  'dominantLanguage' | 'dominantRepository'
>[]

export async function getGeneralWeekActivity(
  repositoriesStats: RepositoryStatistic[],
  year: Year,
) {
  const repositoryWeeklyTotal: Record<string, Record<string, number>> = {}
  const repositoryOverallTotal: Record<string, number> = {}
  const repositoryLanguages: Record<string, string> = {}
  const languageCount: Record<string, number> = {}
  let totalLinesOfCode = 0

  const weeks: IncompleteWeeks = new Array(52).fill(undefined)

  // Get general week activity
  await mapLimit<RepositoryStatistic, string>(
    repositoriesStats,
    10,
    async ({weeks: repositoryWeeks, repository, language}, callback) => {
      try {
        await mapLimit(
          repositoryWeeks,
          3,
          async ({w, a: additions, d: deletions, c}, callback) => {
            const commits = c || 0
            try {
              const date = unixTimestampToDate(Number(w))

              if (year !== date.getFullYear()) {
                return callback(null, '')
              }

              const weekNumber = getWeekNumber(date)
              const weekIndex = weekNumber - 1
              const lines = Math.abs(deletions || 0) + (additions || 0)
              const total = lines + commits

              if (!total) {
                return callback(null, '')
              }

              totalLinesOfCode += lines

              if (!repositoryOverallTotal[repository]) {
                repositoryOverallTotal[repository] = total
              } else {
                repositoryOverallTotal[repository] += total
              }

              if (!repositoryWeeklyTotal[weekIndex]) {
                repositoryWeeklyTotal[weekIndex] = {}
                repositoryWeeklyTotal[weekIndex][repository] = total
              } else {
                if (!repositoryWeeklyTotal[weekIndex][repository]) {
                  repositoryWeeklyTotal[weekIndex][repository] = total
                } else {
                  repositoryWeeklyTotal[weekIndex][repository] += total
                }
              }

              if (!repositoryLanguages[repository]) {
                repositoryLanguages[repository] = language
              }

              if (!languageCount[language]) {
                languageCount[language] = 1
              } else {
                languageCount[language] += 1
              }

              const currentWeek = weeks[weekIndex]

              const currentWeekTotal = currentWeek?.total
                ? currentWeek?.total + total
                : total
              const currentWeekCommits = currentWeek?.commits
                ? currentWeek?.commits + commits
                : commits
              const currentWeekLines = currentWeek?.lines
                ? currentWeek?.lines + lines
                : lines

              weeks[weekIndex] = {
                week: weekNumber,
                lines: currentWeekLines,
                commits: currentWeekCommits,
                total: currentWeekTotal,
              }

              callback(null, '')
            } catch (e) {
              callback(new Error('Unexpected error ' + e))
            }
          },
        )
        callback(null, '')
      } catch (e) {
        callback(new Error('Unexpected error ' + e))
      }
    },
  )

  return {
    repositoryWeeklyTotal,
    repositoryOverallTotal,
    repositoryLanguages,
    languageCount,
    totalLinesOfCode,
    incompleteWeeks: weeks,
  }
}

export function getWeeksWithDominantLanguageAndRepository(
  weeks: IncompleteWeeks,
  repositoryWeeklyTotal: Record<string, Record<string, number>>,
  repositoryLanguages: Record<string, string>,
) {
  return weeks.map((currentWeek, weekNumber) => {
    if (!currentWeek) return undefined

    const repositoriesActivities = repositoryWeeklyTotal[weekNumber]
    const repositoriesLinesThisWeek = Object.values(repositoriesActivities)
    const indexOfMostDominantRepo = indexOfMax(repositoriesLinesThisWeek)

    const dominantRepository = Object.keys(repositoriesActivities)[
      indexOfMostDominantRepo
    ]
    const dominantLanguage = repositoryLanguages[dominantRepository]

    return {
      ...currentWeek,
      dominantLanguage,
      dominantRepository,
    }
  })
}

export function getDominantRepository(
  repositoryOverallTotal: Record<string, number>,
) {
  const repositoriesNames = Object.keys(repositoryOverallTotal)
  const repositoriesActivities = Object.values(repositoryOverallTotal)
  const dominantRepository =
    repositoriesNames[indexOfMax(repositoriesActivities)]

  return dominantRepository
}

export function getDominantLanguage(languageCount: Record<string, number>) {
  const languagesNames = Object.keys(languageCount)
  const languagesFrequencies = Object.values(languageCount)
  const dominantLanguage = languagesNames[indexOfMax(languagesFrequencies)]

  return dominantLanguage
}

const SES = new AWS.SES({
  region: 'us-east-1',
  ...(process.env.IS_OFFLINE && {endpoint: 'http://localhost:9001'}),
})

export async function sendPosterMail({
  name,
  posterSlug,
  sendTo = 'success@simulator.amazonses.com',
}: {
  name: string
  posterSlug: string
  sendTo?: string
}) {
  try {
    logger.info(`Sending email...`)
    const siteUrl = process.env.SITE_URL

    const downloadPosterLink = `${siteUrl}/posters/${posterSlug}`
    const params: AWS.SES.SendEmailRequest = {
      Destination: {
        ToAddresses: [sendTo],
      },
      Source: process.env.AWS_SOURCE_EMAIL as string,
      Message: {
        Subject: {
          Data: `${name}, your year in code poster is ready!`,
        },
        Body: {
          Html: {
            Data: `
            <p>Thank you for taking the time to create your poster and sharing your creativity with the world. At Auth0 we love developers and we appreciate the work you do every day in creating a more convenient and secure world.</p>

            <p>To download your poster: <a href="${downloadPosterLink}">click here</a></p>

            <p>A note from our benevolent sponsors at Auth0:</p>

            <p>Auth0 makes securing your apps simple, and secure even as you scale to the moon.</p>
            `,
          },
        },
      },
    }

    await SES.sendEmail(params).promise()
  } catch (e) {
    logger.error(`Failed sending email.`)
  }
}

interface ImageParam {
  key: keyof PosterImageSizes
  html: string
  fileName: string
  comment: string
  viewport: Viewport
}

export async function generateImagesAndUploadToS3(
  data: Poster,
  posterSlug: string,
) {
  const dimensions = {
    twitter: {
      width: 1080,
      height: 512,
      deviceScaleFactor: 2,
    },
    instagram: {
      width: 1080,
      height: 1080,
      deviceScaleFactor: 2,
    },
    openGraph: {
      width: 1280,
      height: 680,
      deviceScaleFactor: 2,
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

  const params: ImageParam[] = []

  params.push({
    key: 'twitter',
    html: ReactDOMServer.renderToString(<TwitterPoster data={data} />),
    viewport: dimensions.twitter,
    fileName: `${posterSlug}-1080x512.png`,
    comment: 'Twitter poster',
  })
  params.push({
    key: 'instagram',
    html: ReactDOMServer.renderToString(<InstagramPoster data={data} />),
    viewport: dimensions.instagram,
    fileName: `${posterSlug}-1080x1080.png`,
    comment: 'Instagram poster',
  })
  params.push({
    key: 'openGraph',
    html: ReactDOMServer.renderToString(<OpenGraphPoster data={data} />),
    viewport: dimensions.openGraph,
    fileName: `${posterSlug}-1280x680.png`,
    comment: 'Open Graph poster',
  })
  params.push({
    key: 'highQualityPoster',
    html: ReactDOMServer.renderToString(<HighQualityPoster data={data} />),
    viewport: dimensions.highQuality,
    fileName: `${posterSlug}-1800x2400.png`,
    comment: 'High quality poster',
  })

  const promises = params.map(async ({key, ...rest}) => {
    const page = await browser.newPage()
    const fileName = await uploadScreenshot({page, ...rest})
    fileNames[key] = fileName
  })

  await Promise.all(promises)

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
    Bucket: process.env.POSTER_BUCKET as string,
    Key: fileName,
    Body: screenshot as any,
  }).promise()

  logger.info(`Closing page...`)
  await page.close()

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
      : (process.env.WEBSOCKET_API_ENDPOINT as string)

    const result: ConnectionDocument[] = await ConnectionModel.query('userId')
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

export const sendErrorEmail = async (userEmail: string | null) => {
  if (!userEmail) {
    logger.info(
      "Error notitifaction not sent to user, since it doesn't have an email",
    )

    return
  }
  const bccRecipients = (
    process.env.SEND_POSTER_ANALYTICS_RECIPIENTS || ''
  ).split(',')

  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: [userEmail],
      BccAddresses: bccRecipients,
    },
    Source: process.env.AWS_SOURCE_EMAIL as string,
    Message: {
      Subject: {
        Data: 'Auth0 Poster Generation - Error Notification',
      },
      Body: {
        Html: {
          Data: ReactDOMServer.renderToString(<ErrorNotification />),
        },
      },
    },
  }

  logger.info('Sending error notification to user...')

  try {
    await SES.sendEmail(params).promise()
  } catch (e) {
    logger.error('Failed to send error notification', e)
  }
}
