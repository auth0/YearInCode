import {NextApiRequest, NextApiResponse} from 'next'

import auth0 from '@lib/auth/auth0'
import {logger} from '@nebula/log'

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await auth0.handleLogout(req, res)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}
