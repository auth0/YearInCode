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
import {GetBySlugDTO, PosterSlugResponse} from '@nebula/types/poster'
import {logger} from '@nebula/log'

import PosterModel from './poster.model'

async function getPosterBySlug(
  event: SetPathParameterType<APIGatewayEvent, GetBySlugDTO>,
) {
  try {
    const {slug} = event.pathParameters
    const result: PosterSlugResponse[] = await PosterModel.query('posterSlug')
      .eq(slug)
      .attributes(['posterData', 'posterImages'])
      .using('posterSlugIndex')
      .exec()

    if (!result.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Couldn't find poster",
        }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        posterData: result[0].posterData,
        posterImages: result[0].posterImages,
      }),
    }
  } catch (error) {
    logger.error('Failed getting status. Error: ' + error)

    return createHttpError(500, 'ERROR getting status')
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
