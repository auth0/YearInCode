import {ManagementClient} from 'auth0'
import middy from 'middy'
import {SQSEvent, SQSRecord} from 'aws-lambda'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'
import {Octokit, RestEndpointMethodTypes} from '@octokit/rest'
import parseLinkHeader from 'parse-link-header'
import {concatLimit, mapLimit} from 'async'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import {SetBodyToType} from '@api/lib/types'
import {QueueDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'
import {Poster, PosterSteps, PosterWeek} from '@nebula/types/poster'
import {sendMessageToClient} from '@api/lib/websocket'
import {unixTimestampToDate} from '@api/lib/time'
import {indexOfMax} from '@nebula/common/array'

import PosterModel from './poster.model'
import ConnectionModel from './connection.model'

dayjs.extend(weekOfYear)

const auth0Management = new ManagementClient({
  domain: process.env.IS_OFFLINE
    ? process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    : process.env.AUTH0_DOMAIN,
  clientId: process.env.IS_OFFLINE
    ? process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    : process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:user_idp_tokens',
})

type Repositories = RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data']

interface RepositoryStatistic {
  repository: string
  language: string
  weeks: {
    w?: string
    a?: number
    d?: number
    c?: number
  }[]
}

const YEAR_TO_ANALYZE = 2020

function start(event: SQSEvent) {
  const recordPromises = event.Records.map(async (record: any) => {
    const {
      body: {userId},
    } = record as SetBodyToType<SQSRecord, QueueDTO>

    await sendUpdateToClient(userId, PosterSteps.START)
    logger.info(`${userId} started step ${PosterSteps.START}`)

    const {identities} = await auth0Management.getUser({
      id: userId,
    })

    const githubToken = identities.find(
      identity => identity.provider === 'github',
    ).access_token

    await sendUpdateToClient(userId, PosterSteps.GATHERING)
    logger.info(`${userId} started step ${PosterSteps.GATHERING}`)

    const githubClient = new Octokit({
      auth: githubToken,
    })
    const {
      data: {name, login, followers},
    } = await githubClient.users.getAuthenticated()

    const finalData: Poster = {
      name: name.trim(),
      followers,
      year: YEAR_TO_ANALYZE,
      dominantLanguage: '',
      dominantRepository: '',
      weeks: [],
    }
    const {
      repositories: initialRepositories,
      totalPages,
    } = await getUserRepositoriesByPage(githubClient, 1)

    let repositories = [...initialRepositories]

    if (totalPages > 1) {
      const arr: Repositories = (await concatLimit(
        Array.from({length: totalPages - 1}, (_, i) => i + 2),
        10,
        async (page, callback) => {
          const {repositories} = await getUserRepositoriesByPage(
            githubClient,
            page,
          )

          if (!repositories) {
            return callback(new Error("couldn't get repos"))
          }

          callback(null, repositories)
        },
      )) as any

      repositories = repositories.concat(arr)
    }

    let repositoriesStats: RepositoryStatistic[] = await mapLimit(
      repositories,
      10,
      async ({name: repositoryName, owner, language}, callback) => {
        const repositoryStats = await githubClient.repos.getContributorsStats({
          owner: owner.login,
          repo: repositoryName,
        })

        // TODO: Ponder using async.retry
        const IS_NOT_CACHED_STATUS_CODE = 202
        if ((repositoryStats.status as number) === IS_NOT_CACHED_STATUS_CODE) {
          logger.info(
            `Repository (${repositoryName}) statistics cache data is not available. Skipping.`,
          )

          return callback(null, undefined)
        }

        const userStats = repositoryStats.data.find(
          ({author}) => author.login === login,
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
      },
    )

    repositoriesStats = repositoriesStats.filter(val => val !== undefined)

    await sendUpdateToClient(userId, PosterSteps.LAST_TOUCHES)
    logger.info(`${userId} started step ${PosterSteps.LAST_TOUCHES}`)

    const repositoryWeeklyTotal: Record<string, Record<string, number>> = {}
    const repositoryOverallTotal: Record<string, number> = {}
    const repositoryLanguages: Record<string, string> = {}
    const languageCount: Record<string, number> = {}

    const weeks: PosterWeek[] = new Array(52).fill(undefined)

    // Get general week activity
    await mapLimit(
      repositoriesStats,
      10,
      async ({weeks: repositoryWeeks, repository, language}, callback) => {
        await mapLimit(
          repositoryWeeks,
          3,
          async ({w, a: additions, d: deletions, c: commits}, callback) => {
            const date = unixTimestampToDate(Number(w))

            if (date.getFullYear() != YEAR_TO_ANALYZE) {
              return callback(null, '')
            }

            const weekNumber = dayjs(date).week() - 1
            // TODO: Ask if we need to consider deletions as a plus for lines
            const lines = Math.abs(deletions) + additions
            const total = lines + commits

            if (!total) {
              return callback(null, '')
            }

            if (!repositoryOverallTotal[repository]) {
              repositoryOverallTotal[repository] = total
            } else {
              repositoryOverallTotal[repository] += total
            }

            if (!repositoryWeeklyTotal[weekNumber]) {
              repositoryWeeklyTotal[weekNumber] = {}
              repositoryWeeklyTotal[weekNumber][repository] = total
            } else {
              if (!repositoryWeeklyTotal[weekNumber][repository]) {
                repositoryWeeklyTotal[weekNumber][repository] = total
              }

              repositoryWeeklyTotal[weekNumber][repository] += total
            }

            if (!repositoryLanguages[repository]) {
              repositoryLanguages[repository] = language
            }

            if (!languageCount[language]) {
              languageCount[language] = 1
            } else {
              languageCount[language] += 1
            }

            weeks[weekNumber] = {
              week: weekNumber + 1,
              lines,
              commits,
              total,
              dominantLanguage: '',
              dominantRepository: '',
            }

            callback(null, '')
          },
        )

        callback(null, '')
      },
    )

    // Get dominant language per week
    weeks.forEach((_, weekNumber) => {
      const currentWeek = weeks[weekNumber]

      if (!currentWeek) return

      const repositoriesActivities = repositoryWeeklyTotal[weekNumber]
      const indexOfMostDominantRepo = indexOfMax(
        Object.values(repositoriesActivities),
      )
      const dominantRepository = Object.keys(repositoriesActivities)[
        indexOfMostDominantRepo
      ]

      currentWeek.dominantLanguage = repositoryLanguages[dominantRepository]
      currentWeek.dominantRepository = dominantRepository
    })

    finalData.weeks = weeks.filter(val => val !== undefined)
    finalData.dominantRepository = Object.keys(repositoryOverallTotal)[
      indexOfMax(Object.values(repositoryOverallTotal))
    ]
    finalData.dominantLanguage = Object.keys(languageCount)[
      indexOfMax(Object.values(languageCount))
    ]

    console.log(finalData)

    await sendUpdateToClient(userId, PosterSteps.READY)
    logger.info(`${userId} poster is ready!`)
  })

  return Promise.allSettled(recordPromises)
}

async function getUserRepositoriesByPage(client: Octokit, page: number) {
  logger.info(`Getting repository page ${page}`)

  const MAX_REPOSITORIES_PER_PAGE_ALLOWED = 100
  const result = await client.repos.listForAuthenticatedUser({
    visibility: 'public',
    sort: 'pushed',
    per_page: MAX_REPOSITORIES_PER_PAGE_ALLOWED,
    since: new Date(YEAR_TO_ANALYZE, 0, 1).toISOString(),
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

async function sendUpdateToClient(userId: string, step: PosterSteps) {
  try {
    const websocketConnectionUrl = process.env.IS_OFFLINE
      ? 'http://localhost:3001'
      : process.env.WEBSOCKET_API_ENDPOINT

    await PosterModel.update({userId}, {step})
    const result = await ConnectionModel.query('userId')
      .eq(userId)
      .using('userIdIndex')
      .exec()

    if (result.length) {
      // Send update to all devices
      const clientsPromises = result.map(async ({connectionId}) =>
        sendMessageToClient(websocketConnectionUrl, connectionId, {step}),
      )

      await Promise.all(clientsPromises)
    }
  } catch (error) {
    logger.error(error)
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const handler = middy(start).use(sqsJsonBodyParser()).use(sqsBatch())

export {handler as start}
