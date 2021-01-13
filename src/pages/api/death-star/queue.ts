import axios from 'axios'
import ow from 'ow'
import {NextApiRequest, NextApiResponse} from 'next'

import auth0 from '@lib/auth/auth0'
import {constants} from '@lib/common'
import {logger} from '@nebula/log'
import {owWithMessage} from '@lib/api'
import {QueueDTO, QueueResponse} from '@nebula/types/queue'
import {DeathStarService} from '@lib/death-star/death-star-service'

async function queueStar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const {userId, years} = req.body as QueueDTO

    try {
      owWithMessage(
        userId,
        'The id is invalid. Please enter a valid id',
        ow.string.minLength(1),
      )
      owWithMessage(
        years,
        'Please enter at least one valid year',
        ow.array.includesAny('2017', '2018', '2019', '2020'),
      )
      owWithMessage(
        years,
        'There are only 4 years available. Please enter a valid years',
        ow.array.maxLength(4),
      )
    } catch (error) {
      logger.info(`Validation failed ${error.message}`)

      return res.status(403).end(error.message)
    }

    const tokenCache = auth0.tokenCache(req, res)
    const {accessToken} = await tokenCache.getAccessToken()
    const {data} = await DeathStarService.requestQueue(
      userId,
      years,
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
