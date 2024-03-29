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

import {SetBodyToType, SetPathParameterType} from '@api/lib/types'
import {QueueDTO, QueueRecordDTO} from '@nebula/types/queue'
import {PosterState, PosterSteps} from '@nebula/types/poster'
import {logger} from '@nebula/log'
import {decodeToken, getTokenFromString} from '@api/lib/token'
import {generatePosterSlug} from '@api/lib/random'

import PosterModel from './poster.model'

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
  ? `http://localhost:9324/queue/sqs-poster-queue-${process.env.STAGE}`
  : (process.env.SQS_QUEUE_URL as string)

const sqs = new SQS(sqsConfig)

async function queuePosterImplementation(
  event: SetPathParameterType<
    SetBodyToType<APIGatewayProxyEvent, QueueDTO>,
    {userId: string}
  >,
) {
  const {userId: encodedUserId} = event.pathParameters
  const {year, username} = event.body
  const {Authorization} = event.headers

  const userId = decodeURIComponent(encodedUserId)

  logger.info(
    `Received request from user (${userId} - ${username}) to generate ${year} poster`,
  )
  const token = getTokenFromString(Authorization as string)
  const decoded = decodeToken(token)

  if (decoded.payload.sub !== userId) {
    return Promise.reject(createHttpError(401, 'Unauthorized'))
  }

  let inDb = false
  const posterSlug = generatePosterSlug(username, year)

  try {
    const posters: PosterState[] = await PosterModel.query('userId')
      .eq(userId)
      .using('userIdIndex')
      .exec()

    logger.info(`User ${userId} has posters: ${JSON.stringify(posters)}`)

    const posterInPipeline = posters.find(
      ({step}) => step !== PosterSteps.READY,
    )

    if (posterInPipeline) {
      return Promise.reject(createHttpError(400, 'Already queued'))
    }

    const isAlreadyDone = posters.find(
      ({year: posterYear}) => posterYear === year,
    )

    if (isAlreadyDone) {
      return Promise.reject(
        createHttpError(400, 'Poster for this year has already been made'),
      )
    }

    await PosterModel.update(
      {posterSlug, userId},
      {
        year,
        step: PosterSteps.PREPARING,
      },
    )
    inDb = true

    const messageBody: QueueRecordDTO = {
      username,
      posterSlug,
      userId,
      year,
    }

    const params = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: QUEUE_URL,
    }

    const data = await sqs.sendMessage(params).promise()
    logger.info(`QUEUED POSTER WITH ID: ${data.MessageId}`)

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Queued poster!`,
      }),
    }

    return response
  } catch (err) {
    logger.info('error: Failed to send SQS message: ' + err)

    if (inDb) {
      try {
        await PosterModel.update(
          {posterSlug, userId},
          {
            step: PosterSteps.FAILED,
          },
        )

        logger.info(`Removed stray user (${userId}) request`)
      } catch (err) {
        logger.error(`Error removing stray user (${userId}) request: ${err}`)
      }
    }

    return Promise.reject(createHttpError(500, 'ERROR adding to queue'))
  }
}

const inputSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
      },
      required: ['userId'],
    },
    body: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
        year: {
          enum: [2017, 2018, 2019, 2020],
        },
      },
      required: ['username', 'year'],
    },
  },
}

const handler = middy(queuePosterImplementation)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(jsonBodyParser())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())

export {handler as queuePoster, queuePosterImplementation}
