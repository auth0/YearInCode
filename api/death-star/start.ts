import {ManagementClient} from 'auth0'
import middy from 'middy'
import {SQSEvent, SQSRecord} from 'aws-lambda'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'

import {SetBodyToType} from '@api/lib/types'
import {QueueDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'
import {DeathStarSteps} from '@nebula/types/death-star'
import {sendMessageToClient} from '@api/lib/websocket'

import DeathStar from './death-star.model'

const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
const auth0Management = new ManagementClient({
  domain: auth0Domain,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:user_idp_tokens',
})

function start(event: SQSEvent) {
  const recordPromises = event.Records.map(async (record: any) => {
    const {
      body: {userId},
    } = record as SetBodyToType<SQSRecord, QueueDTO>

    await sendUpdateToClient(userId, DeathStarSteps.START)
    logger.info(`${userId} started step ${DeathStarSteps.START}`)

    const {identities} = await auth0Management.getUser({
      id: userId,
    })

    const GitHubToken = identities.find(
      identity => identity.provider === 'github',
    ).access_token

    logger.info(`GH TOKEN: ${GitHubToken}`)

    await sendUpdateToClient(userId, DeathStarSteps.GATHERING)
    logger.info(`${userId} started step ${DeathStarSteps.GATHERING}`)

    await sleep(8362)

    await sendUpdateToClient(userId, DeathStarSteps.LAST_TOUCHES)
    logger.info(`${userId} started step ${DeathStarSteps.LAST_TOUCHES}`)

    await sleep(5000)

    await sendUpdateToClient(userId, DeathStarSteps.READY)
    logger.info(`${userId} star is ready!`)
  })

  return Promise.allSettled(recordPromises)
}

async function sendUpdateToClient(userId: string, step: DeathStarSteps) {
  const url = 'http://localhost:3001'

  try {
    const {connectionId} = await DeathStar.update({userId}, {step})

    if (connectionId) {
      sendMessageToClient(url, connectionId, {step})
    }
  } catch (error) {
    logger.error(error)
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const handler = middy(start).use(sqsJsonBodyParser()).use(sqsBatch())

export default handler
