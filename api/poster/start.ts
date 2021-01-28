import {ManagementClient} from 'auth0'
import middy from 'middy'
import {SQSEvent, SQSRecord} from 'aws-lambda'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'

import {SetBodyToType} from '@api/lib/types'
import {QueueDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'
import {PosterSteps} from '@nebula/types/poster'
import {sendMessageToClient} from '@api/lib/websocket'

import PosterModel from './poster.model'
import ConnectionModel from './connection.model'

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

function start(event: SQSEvent) {
  const recordPromises = event.Records.map(async (record: any) => {
    const {
      body: {userId},
    } = record as SetBodyToType<SQSRecord, QueueDTO>

    await sendUpdateToClient(userId, PosterSteps.START)
    logger.info(`${userId} started step ${PosterSteps.START}`)

    const {identities} = await auth0Management.getUser({
      id: userId,
    })

    const GitHubToken = identities.find(
      identity => identity.provider === 'github',
    ).access_token

    await sendUpdateToClient(userId, PosterSteps.GATHERING)
    logger.info(`${userId} started step ${PosterSteps.GATHERING}`)

    await sleep(8362)

    await sendUpdateToClient(userId, PosterSteps.LAST_TOUCHES)
    logger.info(`${userId} started step ${PosterSteps.LAST_TOUCHES}`)

    await sleep(5000)

    await sendUpdateToClient(userId, PosterSteps.READY)
    logger.info(`${userId} star is ready!`)
  })

  return Promise.allSettled(recordPromises)
}

async function sendUpdateToClient(userId: string, step: PosterSteps) {
  try {
    const websocketConnectionUrl = process.env.IS_OFFLINE
      ? 'http://localhost:3001'
      : process.env.WEBSOCKET_API_ENDPOINT

    await PosterModel.update({userId}, {step})
    const result = await ConnectionModel.query('userId')
      .eq(userId)
      .using('userIdIndex')
      .exec()

    if (result.length) {
      // Send update to all devices
      const clientsPromises = result.map(async ({connectionId}) =>
        sendMessageToClient(websocketConnectionUrl, connectionId, {step}),
      )

      await Promise.all(clientsPromises)
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

export {handler as start}
