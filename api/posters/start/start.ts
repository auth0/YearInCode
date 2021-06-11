import middy from 'middy'
import {SQSEvent, SQSRecord} from 'aws-lambda'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'
import {Octokit} from '@octokit/rest'

import {SetBodyToType} from '@api/lib/types'
import {QueueRecordDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'
import {Poster, PosterSteps, PosterWeek} from '@nebula/types/poster'

import PosterModel from '../poster.model'

import {
  generateImagesAndUploadToS3,
  getRepositoriesByTotalPages,
  getGeneralWeekActivity,
  getRepositoryStats,
  getUserRepositoriesByPage,
  getWeeksWithDominantLanguageAndRepository,
  sendPosterMail,
  sendUpdateToClient,
  getDominantRepository,
  getDominantLanguage,
  getGitHubToken,
} from './start.utils'

export function startImplementation(event: SQSEvent) {
  logger.info(`Received records: ${JSON.stringify(event.Records)}`)
  const recordPromises = event.Records.map(async (record: any) => {
    const {
      body: {userId, year, username, posterSlug},
    } = record as SetBodyToType<SQSRecord, QueueRecordDTO>

    try {
      await sendUpdateToClient(posterSlug, userId, PosterSteps.START)
      logger.info(`${userId} started step ${PosterSteps.START}`)

      const githubToken = await getGitHubToken(userId)

      await sendUpdateToClient(posterSlug, userId, PosterSteps.GATHERING)
      logger.info(`${userId} started step ${PosterSteps.GATHERING}`)

      const githubClient = new Octokit({
        auth: githubToken,
      })

      const {
        data: {name: githubName, followers: githubFollowers, email},
      } = await githubClient.users.getAuthenticated()

      const {
        repositories: initialRepositories,
        totalPages,
      } = await getUserRepositoriesByPage(githubClient, 1, year)

      let repositories = [...initialRepositories]

      if (totalPages > 1) {
        const arr = await getRepositoriesByTotalPages(
          totalPages,
          year,
          githubClient,
        )

        repositories = repositories.concat(arr)
      }

      const totalRepositories = repositories.length
      logger.info(`Repositories are done! Analyzing ${totalRepositories} repos`)

      const repositoriesStats = await getRepositoryStats(
        repositories,
        username,
        githubClient,
      )

      const filteredRepositoriesStats = repositoriesStats.filter(
        val => val !== undefined,
      )

      logger.info(
        `Repository stats are done! result with filter: ${JSON.stringify(
          filteredRepositoriesStats,
        )}`,
      )

      await sendUpdateToClient(posterSlug, userId, PosterSteps.LAST_TOUCHES)
      logger.info(`${userId} started step ${PosterSteps.LAST_TOUCHES}`)

      const {
        languageCount,
        repositoryLanguages,
        repositoryOverallTotal,
        repositoryWeeklyTotal,
        totalLinesOfCode,
        incompleteWeeks,
      } = await getGeneralWeekActivity(filteredRepositoriesStats, year)

      const completeWeeks = getWeeksWithDominantLanguageAndRepository(
        incompleteWeeks,
        repositoryWeeklyTotal,
        repositoryLanguages,
      )

      const dominantRepository = getDominantRepository(repositoryOverallTotal)
      const dominantLanguage = getDominantLanguage(languageCount)

      const name = githubName ? githubName.trim() : username
      const posterData: Poster = {
        name,
        followers: githubFollowers,
        year,
        totalLinesOfCode,
        weeks: completeWeeks.filter(val => val !== undefined) as PosterWeek[],
        totalRepositories,
        dominantRepository,
        dominantLanguage,
      }

      logger.info(`Poster is done! result: ${JSON.stringify(posterData)}`)

      logger.info(`Uploading pictures for ${userId}`)

      const fileNames = await generateImagesAndUploadToS3(
        posterData,
        posterSlug,
      )

      await PosterModel.update(
        {posterSlug, userId},
        {
          posterData: JSON.stringify(posterData),
          posterImages: fileNames,
        },
      )

      await sendUpdateToClient(posterSlug, userId, PosterSteps.READY)
      logger.info(`${userId} poster is ready!`)

      await sendPosterMail({
        name: posterData.name,
        posterSlug,
        sendTo: email as string,
      })

      return Promise.resolve({posterSlug, posterData})
    } catch (e) {
      logger.error(e)

      try {
        await PosterModel.update(
          {posterSlug, userId},
          {
            step: PosterSteps.FAILED,
          },
        )

        logger.info(`Marked poster as FAILED for user (${userId})`)
      } catch (err) {
        logger.error(
          `Error marking poster as FAILED for user (${userId}). Error details: ${err}`,
        )
      }

      return Promise.reject(e)
    }
  })

  return Promise.allSettled(recordPromises)
}

const handler = middy(startImplementation)
  .use(sqsJsonBodyParser())
  .use(sqsBatch())

export {handler as start}
