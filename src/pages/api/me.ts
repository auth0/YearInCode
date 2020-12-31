import auth0 from '@lib/auth/auth0'
import {logger} from '@nebula/log'

export default async function me(req, res) {
  try {
    await auth0.handleProfile(req, res)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}
