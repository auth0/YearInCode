import ow, {BasePredicate} from 'ow'

import {constants} from '@lib/common'

export function owWithMessage<T>(
  val: T,
  message: string,
  validator: BasePredicate<T>,
) {
  try {
    ow(val, validator)
  } catch (error) {
    throw new Error(message)
  }
}

export function validateEnvironment() {
  owWithMessage(
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    'AUTH0_CLIENT_ID environment variable not set',
    ow.string.minLength(1),
  )

  owWithMessage(
    process.env.AUTH0_CLIENT_SECRET,
    'AUTH0_CLIENT_SECRET environment variable not set',
    ow.string.minLength(1),
  )

  owWithMessage(
    constants.auth0.domain,
    'Auth0 domain is not set',
    ow.string.minLength(1),
  )

  owWithMessage(
    constants.api.lambdaUrl,
    'Lambda URL domain is not set',
    ow.string.minLength(1),
  )
}
