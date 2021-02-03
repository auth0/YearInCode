import middy from 'middy'
import {APIGatewayEvent} from 'aws-lambda'
import {
  doNotWaitForEmptyEventLoop,
  httpErrorHandler,
  httpSecurityHeaders,
  validator,
} from 'middy/middlewares'
import createHttpError from 'http-errors'

import {SetQueryStringType} from '@api/lib/types'
import {GetStatusDTO} from '@nebula/types/poster'
import {logger} from '@nebula/log'

import PosterModel from './poster.model'

async function getStatus(
  event: SetQueryStringType<APIGatewayEvent, GetStatusDTO>,
) {
  try {
    const {userId} = event.queryStringParameters
    const userDocument = await PosterModel.get(userId, {
      attributes: ['step', 'posterSlug'],
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: userDocument ? userDocument.toJSON() : {},
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

const handler = middy(getStatus)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())

export {handler as getStatus}