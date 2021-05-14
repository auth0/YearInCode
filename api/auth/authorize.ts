import {promisify} from 'util'

import jwksClient from 'jwks-rsa'
import * as jwt from 'jsonwebtoken'

import {decodeToken} from '@api/lib/token'

const getPolicyDocument = (effect: 'Allow', resource: string) => {
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

// extract and return the Bearer Token from the Lambda event parameters
const getToken = (params: AuthorizeParams) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"')
  }

  const tokenString = params.authorizationToken
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set')
  }

  const match = tokenString.match(/^Bearer (.*)$/)
  if (!match || match.length < 2) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`,
    )
  }

  return match[1]
}

const jwtOptions = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
}

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10, // Default value
  jwksUri: process.env.JWKS_URI as string,
})

type AuthorizeParams = {type?: string; authorizationToken?: string}

export const authorize = (params: AuthorizeParams) => {
  const token = getToken(params)

  const decoded = decodeToken(token)

  const getSigningKey = promisify(client.getSigningKey)

  return getSigningKey(decoded.header.kid)
    .then((key: any) => {
      const signingKey = key.publicKey || key.rsaPublicKey

      return jwt.verify(token, signingKey, jwtOptions)
    })
    .then((decoded: Record<string, any>) => ({
      principalId: decoded.sub,
      policyDocument: getPolicyDocument('Allow', '*'),
      context: {scope: decoded.scope},
    }))
}
