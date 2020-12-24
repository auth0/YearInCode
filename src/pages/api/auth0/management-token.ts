import {NextApiRequest, NextApiResponse} from 'next'
import {ManagementClient} from 'auth0'

import {constants} from '@lib/common'
import {logger} from '@lib/log'
import {validateEnvironment} from '@lib/api'

validateEnvironment()

const auth0Management = new ManagementClient({
  domain: constants.auth0.domain,
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
