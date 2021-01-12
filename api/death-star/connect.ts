import {promisify, format} from 'util'

import {APIGatewayEvent} from 'aws-lambda'
import middy from 'middy'
import {
  jsonBodyParser,
  validator,
  doNotWaitForEmptyEventLoop,
  httpErrorHandler,
  httpSecurityHeaders,
} from 'middy/middlewares'
import jwksClient from 'jwks-rsa'
import * as Iron from '@hapi/iron'
import * as jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'

import {logger} from '@nebula/log'
import {SetQueryStringType} from '@api/lib/types'
import {
  DeathStarUserStatus,
  WebsocketConnectDTO,
} from '@nebula/types/death-star'
import {decodeToken} from '@api/lib/token'

import DeathStar from './death-star.model'

async function connect(
  event: SetQueryStringType<APIGatewayEvent, WebsocketConnectDTO>,
) {
  const connectionId = event.requestContext.connectionId
  const {userId} = event.queryStringParameters

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
        userId: {
          type: 'string',
        },
      },
      required: ['userId'],
    },
  },
}

const handler = middy(connect)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(validator({inputSchema}))

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10, // Default value
  jwksUri: process.env.JWKS_URI,
})

const jwtOptions = {
  audience: process.env.AUDIENCE,
  issuer: process.env.TOKEN_ISSUER,
}

// Verify user session before connection
// TODO: move this to custom authorizer when deploying to AWS, since
// WS custom authorizers are not supported in Serverless Offline
handler.before(
  (
    {event}: {event: SetQueryStringType<APIGatewayEvent, WebsocketConnectDTO>},
    next,
  ) => {
    const {accessToken} = event.queryStringParameters

    Iron.unseal(
      accessToken,
      process.env.SESSION_ACCESS_TOKEN_SECRET,
      Iron.defaults,
    )
      .then(token => {
        const decoded = decodeToken(token)
        const getSigningKey = promisify(client.getSigningKey)

        return getSigningKey(decoded.header.kid)
          .then((key: any) => {
            const signingKey = key.publicKey || key.rsaPublicKey

            return jwt.verify(token, signingKey, jwtOptions)
          })
          .then(() => {
            next()
          })
      })
      .catch(e => {
        logger.error(e)
        throw new createHttpError.Unauthorized('Unauthorized')
      })
  },
)

handler.use(httpErrorHandler())

export default handler
