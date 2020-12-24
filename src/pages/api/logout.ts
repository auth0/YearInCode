import auth0 from '@lib/auth/auth0'
import {logger} from '@lib/log'

export default async function logout(req, res) {
  try {
    await auth0.handleLogout(req, res)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
