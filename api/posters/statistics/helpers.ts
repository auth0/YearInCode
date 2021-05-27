import AWS from 'aws-sdk'

import {dateToUnixTimeStamp} from '@api/lib/date'
import {logger} from '@nebula/log'
import {Poster, PosterDocument, PosterSteps} from '@nebula/types/poster'

import PosterModel from '../poster.model'

export const getCreatedPostersBetween = async (
  lowerBound: Date,
  upperBound: Date,
) =>
  PosterModel.scan({
    updatedAt: {
      ge: dateToUnixTimeStamp(lowerBound),
      le: dateToUnixTimeStamp(upperBound),
    },
  })
    .filter('step')
    .eq(PosterSteps.READY)
    .attributes(['posterData'])
    .exec()

export const getEmailContent = (
  postersData: RawPosterData[],
  totalPosters: number,
) => {
  if (totalPosters === 0) {
    logger.info(`No new posters this week...`)

    return `
    <h1>Poster Statistics</h1>
    <em>No new posters this week.</em>
    `
  }
  logger.info(`There's a total of ${totalPosters} new posters`)
  const langaugestats = postersData.reduce(
    gatherLanguageStats,
    {} as PerLanguageStats,
  )

  return getPerLanguageStatiticsContent(langaugestats, totalPosters)
}

const gatherLanguageStats = (
  stats: PerLanguageStats,
  {posterData}: RawPosterData,
) => {
  const {dominantLanguage} = JSON.parse(posterData) as Poster
  if (dominantLanguage in stats) {
    const currentTotal = stats[dominantLanguage]

    return {...stats, [dominantLanguage]: currentTotal + 1}
  } else {
    return {...stats, [dominantLanguage]: 1}
  }
}

const getPerLanguageStatiticsContent = (
  stats: PerLanguageStats,
  totalPosters: number,
) => {
  const rows = Object.entries(stats).map(
    ([language, total]) => `<tr><td>${language}</td><td>${total}</td></tr>`,
  )

  return `
  <h1>Poster Statistics</h1>
  <p>
    <strong>New posters:</strong>
    ${totalPosters}
  </p>

  <h1>Per Language Statistics</h1>
  <table>
    <thead>
      <th>Language</th>
      <th>Total Posters</th>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  `
}

export type RawPosterData = Pick<PosterDocument, 'posterData'>

type PerLanguageStats = {[k in string]: number}

export const sendEmail = async (content: string) => {
  const to = (process.env.SEND_POSTER_ANALYTICS_RECIPIENTS || '').split(',')
  if (to.length === 0) {
    logger.info('Skipping email due to empty recipients...')

    return
  }

  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: to,
    },
    Source: process.env.AWS_SOURCE_EMAIL as string,
    Message: {
      Subject: {
        Data: 'Poster statistics',
      },
      Body: {
        Html: {
          Data: content,
        },
      },
    },
  }
  logger.info('Sending email to: ', to)
  await SES.sendEmail(params).promise()
}

const SES = new AWS.SES({
  region: 'us-east-1',
  ...(process.env.IS_OFFLINE && {endpoint: 'http://localhost:9001'}),
})
