import {NextApiRequest, NextApiResponse} from 'next'
import {ManagementClient} from 'auth0'
import ow from 'ow'

import auth from '@constants/auth'
import {logger} from '@lib/log'
import {owWithMessage} from '@lib/api/validation'

owWithMessage(
  process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  'AUTH0_CLIENT_ID environment variable not set',
  ow.string.minLength(1),
)

owWithMessage(
  process.env.AUTH0_CLIENT_SECRET,
  'AUTH0_CLIENT_ID environment variable not set',
  ow.string.minLength(1),
)

owWithMessage(
  auth.auth0.domain,
  'Auth0 domain is not set',
  ow.string.minLength(1),
)

const auth0Management = new ManagementClient({
  domain: auth.auth0.domain,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:user_idp_tokens',
})

export default async function getAuth0ManagementToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {method} = req

    switch (method) {
      case 'GET':
        logger.info('Getting Auth0 management token')

        // @ts-ignore
        // getAccessToken is not available in @types/auth0, but it's included in node-auth0 source code
        const token: string = await auth0Management.getAccessToken()

        logger.info(`Got token that ends with ${token.slice(-4)}`)

        return res.status(200).json({accessToken: token})
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
