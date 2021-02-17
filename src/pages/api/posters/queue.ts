import ow from 'ow'
import {NextApiRequest, NextApiResponse} from 'next'

import auth0 from '@lib/auth/auth0'
import {logger} from '@nebula/log'
import {owWithMessage} from '@lib/api'
import {QueueDTO} from '@nebula/types/queue'
import {PosterService} from '@lib/poster/poster-service'
import {UserProfile} from '@lib/auth'

async function queueStar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const {year} = req.body as QueueDTO

    try {
      owWithMessage(
        year,
        'Please enter at least one valid year',
        ow.number.oneOf([2017, 2018, 2019, 2020]),
      )
    } catch (error) {
      logger.info(`Validation failed ${error.message}`)

      return res.status(403).end(error.message)
    }

    const tokenCache = auth0.tokenCache(req, res)
    const session = await auth0.getSession(req)
    const user = session.user as UserProfile

    const {accessToken} = await tokenCache.getAccessToken()
    const {data} = await PosterService.requestQueue(
      user.sub,
      user.nickname,
      year,
      accessToken,
    )

    res.status(200).json(data)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default auth0.requireAuthentication(queueStar)
