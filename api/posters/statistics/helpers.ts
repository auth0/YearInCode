import AWS from 'aws-sdk'

import {logger} from '@nebula/log'
import {Poster, PosterDocument, PosterSteps} from '@nebula/types/poster'

import PosterModel from '../poster.model'

export const getCreatedPostersBetween = async (
  lowerBound: Date,
  upperBound: Date,
) =>
  PosterModel.scan('updatedAt')
    .between(lowerBound.getTime(), upperBound.getTime())
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
    <h3>
      <em>No new posters this week.</em>
    </h3>
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
  const perLanguageHtmlRows: string = Object.entries(stats)
    .map(
      ([language, total]) =>
        `<tr style='${bordered}'>
          <td style='${bordered} ${paddedContent} min-width: 75px;'>
            <em>${language}</em>
          </td>
          <td style='text-align: center; min-width: 50px; ${paddedContent}'>
            <strong>${total}</strong>
          </td>
        </tr>`,
    )
    .join('')

  return `
  <h3>
    <span style='font-weight: normal'>
      <strong>New Posters: </strong>${totalPosters}
    </span>
  </h3>

  <h3>Posters By Programming Language</h3>
  <table style='border-collapse: collapse; ${bordered}'>
    <tbody>${perLanguageHtmlRows}</tbody>
  </table>
  `
}

const bordered = 'border: 1px solid black;'
const paddedContent = 'padding: 5px;'

export type RawPosterData = Pick<PosterDocument, 'posterData'>

type PerLanguageStats = {[k in string]: number}

export const sendEmail = async (content: string) => {
  const to = (process.env.SEND_POSTER_ANALYTICS_RECIPIENTS || '').split(',')
  if (to.length === 0 || !process.env.AWS_SOURCE_EMAIL) {
    logger.info(
      'Skipping email due to empty recipients or missing email sender',
    )

    return
  }

  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: to,
    },
    Source: process.env.AWS_SOURCE_EMAIL,
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
  logger.info(`Sending email to ${to.length} recipients`)
  await SES.sendEmail(params).promise()
}

const SES = new AWS.SES({
  region: 'us-east-1',
  ...(process.env.IS_OFFLINE && {endpoint: 'http://localhost:9001'}),
})
