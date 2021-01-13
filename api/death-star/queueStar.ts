import middy from 'middy'
import {APIGatewayProxyEvent} from 'aws-lambda'
import SQS from 'aws-sdk/clients/sqs'
import {
  jsonBodyParser,
  validator,
  doNotWaitForEmptyEventLoop,
  httpErrorHandler,
  httpSecurityHeaders,
} from 'middy/middlewares'
import createHttpError from 'http-errors'

import {SetBodyToType} from '@api/lib/types'
import {QueueDTO} from '@nebula/types/queue'
import {DeathStarSteps} from '@nebula/types/death-star'
import {logger} from '@nebula/log'
import {decodeToken, getTokenFromString} from '@api/lib/token'

import DeathStar from './death-star.model'

const {IS_OFFLINE} = process.env

const sqsConfig = IS_OFFLINE
  ? {
      region: 'us-east-1',
      accessKeyId: 'local',
      secretAccessKey: 'local',
      endpoint: 'http://localhost:9324',
    }
  : {region: 'us-east-1'}

const QUEUE_URL = IS_OFFLINE
  ? 'http://localhost:9324/queue/StarQueue'
  : process.env.SQS_QUEUE_URL

const sqs = new SQS(sqsConfig)

async function queueStar(event: SetBodyToType<APIGatewayProxyEvent, QueueDTO>) {
  const {userId, years} = event.body
  const {Authorization} = event.headers

  const token = getTokenFromString(Authorization)
  const decoded = decodeToken(token)

  if (decoded.payload.sub !== userId) {
    return createHttpError(401, 'Unauthorized')
  }

  let inDb = false
  console.log(QUEUE_URL)
  try {
    const status = await DeathStar.get(userId)

    if (status?.step === DeathStarSteps.PREPARING) {
      return createHttpError(400, 'Already queued')
    }

    await DeathStar.update(
      {userId},
      {
        step: DeathStarSteps.PREPARING,
      },
    )
    inDb = true

    const params = {
      MessageBody: JSON.stringify({
        userId,
        years,
      }),
      QueueUrl: QUEUE_URL,
    }

    const data = await sqs.sendMessage(params).promise()
    logger.info(`QUEUED STAR WITH ID: ${data.MessageId}`)

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Queued star!`,
      }),
    }

    return response
  } catch (err) {
    logger.info('error: Failed to send message: ' + err)

    if (inDb) {
      try {
        await DeathStar.update(
          {userId},
          {
            step: DeathStarSteps.FAILED,
          },
        )

        logger.info(`Removed stray user (${userId}) request`)
      } catch (err) {
        logger.error(`Error removing stray user (${userId}) request: ${err}`)
      }
    }

    return createHttpError(500, 'ERROR adding to queue')
  }
}

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        years: {
          type: 'array',
          minItems: 1,
          maxItems: 4,
          items: {
            type: 'string',
            enum: ['2017', '2018', '2019', '2020'],
          },
        },
      },
      required: ['userId', 'years'],
    },
  },
}

const handler = middy(queueStar)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(jsonBodyParser())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())

export default handler
