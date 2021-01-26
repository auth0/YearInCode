import {ManagementClient} from 'auth0'
import middy from 'middy'
import {SQSEvent, SQSRecord} from 'aws-lambda'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'
import AWS from 'aws-sdk'

import {SetBodyToType} from '@api/lib/types'
import {QueueDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'
import {DeathStarSteps} from '@nebula/types/death-star'
import {sendMessageToClient} from '@api/lib/websocket'

import DeathStar from './death-star.model'

const auth0Management = new ManagementClient({
  domain: process.env.IS_OFFLINE
    ? process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    : process.env.AUTH0_DOMAIN,
  clientId: process.env.IS_OFFLINE
    ? process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    : process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:user_idp_tokens',
})

const S3 = new AWS.S3({
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER', // This specific key is required when working offline
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint('http://localhost:4569').href,
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
  try {
    const websocketConnectionUrl = process.env.IS_OFFLINE
      ? 'http://localhost:3001'
      : process.env.WEBSOCKET_API_ENDPOINT

    const {connectionId} = await DeathStar.update({userId}, {step})

    if (connectionId) {
      await sendMessageToClient(websocketConnectionUrl, connectionId, {step})
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

export const handler = middy(start).use(sqsJsonBodyParser()).use(sqsBatch())
