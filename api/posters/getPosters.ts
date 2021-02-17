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
import {GetPostersDTO, PosterSteps} from '@nebula/types/poster'
import {logger} from '@nebula/log'

import PosterModel from './poster.model'

async function getPosters(
  event: SetPathParameterType<APIGatewayEvent, GetPostersDTO>,
) {
  try {
    const {userId} = event.pathParameters
    const userDocument = await PosterModel.query('userId')
      .eq(userId)
      .attributes(['step', 'posterSlug', 'year'])
      .using('userIdIndex')
      .exec()

    return {
      statusCode: 200,
      body: JSON.stringify({
        posters: userDocument.length ? userDocument.toJSON() : [],
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
    queryStringParameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
      },
      required: ['userId'],
    },
  },
}

const handler = middy(getPosters)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())

export {handler as getPosters}
