import {NextApiRequest, NextApiResponse} from 'next'

import {logger} from '@nebula/log'
import auth0 from '@lib/auth/auth0'

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await auth0.handleCallback(req, res)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}
