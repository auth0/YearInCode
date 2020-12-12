import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

import auth from '@constants/auth'
import {logger} from '@lib/log'

interface Auth0ManagementResponse {
  access_token: string
  token_type: string
}

export interface UserFullProfile {
  email: string
  email_verified: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  gender: string
  locale: string
  updated_at: string
  user_id: string
  nickname: string
  identities: Identity[]
  created_at: string
  last_ip: string
  last_login: string
  logins_count: number
}

export interface Identity {
  provider: string
  access_token: string
  expires_in: number
  user_id: string
  connection: string
  isSocial: boolean
}

export default async function getUserRepositories(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {userId} = req.body

    const {access_token} = await getAuth0ManagementToken()
    // const {identities} = await getFullUserProfile(userId, access_token)

    // logger.info(identities)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).end(error.message)
  }
}

async function getAuth0ManagementToken() {
  const {data} = await axios.post<Auth0ManagementResponse>(
    `https://${auth.auth0.domain}/oauth/token`,
    {
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${auth.auth0.domain}/api/v2`,
      grant_type: 'client_credentials',
    },
  )

  return data
}

async function getFullUserProfile(userId: string, accessToken: string) {
  const {data} = await axios.get<UserFullProfile>(
    `https://${auth.auth0.domain}/api/v2/users/${userId}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return data
}
