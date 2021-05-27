import dayjs from 'dayjs'
import createHttpError from 'http-errors'

import {logger} from '@nebula/log'

import {
  getCreatedPostersBetween,
  getEmailContent,
  RawPosterData,
  sendEmail,
} from './helpers'

export const sendPosterStatistics = async () => {
  try {
    const now = dayjs().toDate()
    const oneWeekBefore = dayjs().subtract(1, 'week').toDate()

    logger.info(
      `Retrieving posters from ${oneWeekBefore.toUTCString()} until ${now.toUTCString()}`,
    )

    const posterDocuments: RawPosterData[] = await getCreatedPostersBetween(
      oneWeekBefore,
      now,
    )

    const totalPosters = posterDocuments.length
    const emailContent = getEmailContent(posterDocuments, totalPosters)

    await sendEmail(emailContent)
  } catch (e) {
    logger.error(`Error sending posters analytics`, e)
    return Promise.reject(
      createHttpError(500, 'Error sending poster analytics'),
    )
  }
}
