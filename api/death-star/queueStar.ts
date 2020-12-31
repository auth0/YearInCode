import middy from 'middy'
import {APIGatewayProxyEvent, Context, Callback} from 'aws-lambda'
import SQS from 'aws-sdk/clients/sqs'
import {
  jsonBodyParser,
  validator,
  doNotWaitForEmptyEventLoop,
  httpErrorHandler,
  httpSecurityHeaders,
} from 'middy/middlewares'

import {SetBodyToType} from '@api/lib/common'
import {QueueDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'

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
  : 'AWS_ENDPOINT'

const sqs = new SQS(sqsConfig)

async function queueStar(
  event: SetBodyToType<APIGatewayProxyEvent, QueueDTO>,
  _context: Context,
  callback: Callback,
) {
  const {userId, years} = event.body

  const params = {
    MessageBody: JSON.stringify({
      userId,
      years,
    }),
    QueueUrl: QUEUE_URL,
  }

  try {
    const data = await sqs.sendMessage(params).promise()
    logger.info(`QUEUED STAR WITH ID: ${data.MessageId}`)

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `QUEUED STAR WITH ID: ${data.MessageId}`,
      }),
    }

    callback(null, response)
  } catch (err) {
    logger.info('error:', 'Failed to send message', err)

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'ERROR adding to queue',
      }),
    }

    callback(err, response)
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
      },
      required: ['userId'],
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
