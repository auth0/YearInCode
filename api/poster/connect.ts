import {APIGatewayEvent} from 'aws-lambda'
import middy from 'middy'
import {validator, doNotWaitForEmptyEventLoop} from 'middy/middlewares'
import * as Iron from '@hapi/iron'

import {logger} from '@nebula/log'
import {SetQueryStringType} from '@api/lib/types'
import {
  WebSocketConnectDTO,
  UnsealedWebSocketConnectDTO,
} from '@nebula/types/poster'

import ConnectionModel from './connection.model'

async function connect(
  event: SetQueryStringType<APIGatewayEvent, WebSocketConnectDTO>,
) {
  const connectionId = event.requestContext.connectionId
  const {wsPayload} = event.queryStringParameters

  const {userId} = (await Iron.unseal(
    wsPayload,
    process.env.WEBSOCKET_PAYLOAD_SECRET,
    Iron.defaults,
  )) as UnsealedWebSocketConnectDTO
  logger.info(`Received connection from user (${userId})`)

  await ConnectionModel.update(
    {connectionId},
    {
      userId,
    },
  )

  return {
    statusCode: 200,
  }
}

const inputSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        wsPayload: {
          type: 'string',
        },
      },
      required: ['wsPayload'],
    },
  },
}

export const handler = middy(connect)
  .use(doNotWaitForEmptyEventLoop())
  .use(validator({inputSchema}))

export {handler as connect}
