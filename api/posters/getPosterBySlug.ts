import middy from 'middy'
import {APIGatewayEvent} from 'aws-lambda'
import {
  doNotWaitForEmptyEventLoop,
  httpErrorHandler,
  httpSecurityHeaders,
  validator,
} from 'middy/middlewares'
import createHttpError from 'http-errors'

import {SetPathParameterType} from '@api/lib/types'
import {
  GetBySlugDTO,
  PosterSlugResponse,
  PosterState,
} from '@nebula/types/poster'
import {logger} from '@nebula/log'

import PosterModel from './poster.model'

type PosterSlugQueryResult = Pick<
  PosterState,
  'posterImages' | 'year' | 'userId' | 'posterData'
>[]

async function getPosterBySlug(
  event: SetPathParameterType<APIGatewayEvent, GetBySlugDTO>,
) {
  try {
    const {slug: encodedSlug} = event.pathParameters
    const slug = decodeURIComponent(encodedSlug)

    const result: PosterSlugQueryResult = await PosterModel.query('posterSlug')
      .eq(slug)
      .attributes(['posterData', 'posterImages', 'year', 'userId'])
      .exec()

    if (!result[0]?.posterData || !result.length) {
      return Promise.reject(createHttpError(404, "Couldn't find poster"))
    }

    const otherPosters: PosterSlugResponse['otherPosters'] = await PosterModel.query(
      'userId',
    )
      .eq(result[0].userId)
      .attributes(['year', 'posterSlug'])
      .using('userIdIndex')
      .exec()

    if (!otherPosters.length) {
      return Promise.reject(createHttpError(404, "Couldn't get user"))
    }

    const payload: PosterSlugResponse = {
      ...result[0],
      otherPosters: otherPosters.filter(({posterSlug}) => slug !== posterSlug),
    }

    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    }
  } catch (error) {
    logger.error('Failed getting status. Error: ' + error)

    return Promise.reject(createHttpError(500, 'ERROR getting poster by slug'))
  }
}

const inputSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
        },
      },
      required: ['slug'],
    },
  },
}

const handler = middy(getPosterBySlug)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())

export {handler as getPosterBySlug}
