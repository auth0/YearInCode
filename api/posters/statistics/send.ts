import {logger} from '@nebula/log'

import {
  getCreatedPostersBetween,
  getEmailContent,
  RawPosterData,
  sendEmail,
} from './helpers'

export const sendPosterStatistics = async () => {
  try {
    const now = new Date()
    const oneWeekBefore = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7,
    )

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
  }
}
