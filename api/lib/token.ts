import {decode} from 'jsonwebtoken'

export function getTokenFromString(tokenString: string) {
  const authorization = tokenString.split(' ')

  if (!authorization || authorization.length < 2) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`,
    )
  }

  return authorization[1]
}

export function decodeToken(token: string) {
  const decoded = decode(token, {complete: true}) as Record<string, any>

  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('invalid token')
  }

  return decoded
}
