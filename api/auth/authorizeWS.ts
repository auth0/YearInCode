import {promisify} from 'util'

import jwksClient from 'jwks-rsa'
import * as jwt from 'jsonwebtoken'
import {APIGatewayAuthorizerEvent} from 'aws-lambda'
import * as Iron from '@hapi/iron'

import {decodeToken} from '@api/lib/token'
import {SetQueryStringType} from '@api/lib/types'
import {
  UnsealedWebSocketConnectDTO,
  WebSocketConnectDTO,
} from '@nebula/types/death-star'

const getPolicyDocument = (effect, resource) => {
  const policyDocument = {
    Version: '2012-10-17', // default version
    Statement: [
      {
        Action: 'execute-api:Invoke', // default action
        Effect: effect,
        Resource: resource,
      },
    ],
  }

  return policyDocument
}

const jwtOptions = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
}

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10, // Default value
  jwksUri: process.env.JWKS_URI,
})

const authorize = (
  params: SetQueryStringType<APIGatewayAuthorizerEvent, WebSocketConnectDTO>,
) => {
  const {wsPayload} = params.queryStringParameters

  return Iron.unseal(
    wsPayload,
    process.env.WEBSOCKET_PAYLOAD_SECRET,
    Iron.defaults,
  )
    .then(({accessToken}: UnsealedWebSocketConnectDTO) => {
      const decoded = decodeToken(accessToken)
      const getSigningKey = promisify(client.getSigningKey)

      return getSigningKey(decoded.header.kid).then((key: any) => {
        const signingKey = key.publicKey || key.rsaPublicKey

        return jwt.verify(accessToken, signingKey, jwtOptions)
      })
    })
    .then((decoded: Record<string, any>) => ({
      principalId: decoded.sub,
      policyDocument: getPolicyDocument('Allow', params.methodArn),
      context: {scope: decoded.scope},
    }))
}

export default authorize
