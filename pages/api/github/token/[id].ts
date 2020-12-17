import {ManagementClient} from 'auth0'
import {NextApiRequest, NextApiResponse} from 'next'
import ow from 'ow'

import {constants} from '@lib/common'
import {logger} from '@lib/log'
import {auth0} from '@lib/auth'
import {client, owWithMessage, validateEnvironment} from '@lib/api'

validateEnvironment()

async function getUserGitHubToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: {id},
      method,
    } = req

    try {
      owWithMessage(
        id,
        'The id is invalid. Please enter a valid id',
        ow.string.minLength(1),
      )
    } catch (error) {
      logger.info(`Validation failed ${error.message}`)

      return res.status(403).end(error.message)
    }

    logger.info(`Getting repositories for id: ${id}`)

    switch (method) {
      case 'GET':
        const accessToken = await getAuth0ManagementToken()
        const auth0Management = new ManagementClient({
          domain: constants.auth0.domain,
          token: accessToken,
        })
        const {identities} = await auth0Management.getUser({
          id: id as string,
        })

        const GitHubToken = identities.find(
          identity => identity.provider === 'github',
        ).access_token

        return res.status(200).json({token: GitHubToken})
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).end(error.message)
  }
}

async function getAuth0ManagementToken() {
  const {data} = await client.get<{accessToken: string}>(
    '/auth0/management-token',
  )

  return data.accessToken
}

export default auth0.requireAuthentication(getUserGitHubToken)
