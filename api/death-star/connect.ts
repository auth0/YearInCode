import {APIGatewayEvent} from 'aws-lambda'
import middy from 'middy'
import {validator, doNotWaitForEmptyEventLoop} from 'middy/middlewares'
import * as Iron from '@hapi/iron'

import {logger} from '@nebula/log'
import {SetQueryStringType} from '@api/lib/types'
import {
  DeathStarUserStatus,
  WebSocketConnectDTO,
  UnsealedWebSocketConnectDTO,
} from '@nebula/types/death-star'

import DeathStar from './death-star.model'

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

  await DeathStar.update(
    {userId},
    {
      connectionId,
      connectionStatus: DeathStarUserStatus.ONLINE,
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

const handler = middy(connect)
  .use(doNotWaitForEmptyEventLoop())
  .use(validator({inputSchema}))

export default handler
