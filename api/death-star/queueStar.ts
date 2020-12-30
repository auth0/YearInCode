import {APIGatewayProxyEvent, Context, Callback} from 'aws-lambda'
import SQS from 'aws-sdk/clients/sqs'

const {IS_OFFLINE} = process.env

const sqs = IS_OFFLINE
  ? new SQS({
      region: 'us-east-1',
      accessKeyId: 'local',
      secretAccessKey: 'local',
      endpoint: 'http://localhost:9324',
    })
  : new SQS({region: 'us-east-1'})

const QUEUE_URL = IS_OFFLINE
  ? 'http://localhost:9324/queue/StarQueue'
  : 'AWS_ENDPOINT'

const queueStar = (
  _event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback,
) => {
  const params = {
    MessageBody: 'Sending Death Star information',
    QueueUrl: QUEUE_URL,
  }

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('error:', 'Failed to send message', err)

      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'ERROR adding to queue',
        }),
      }

      callback(err, response)
    } else {
      console.log(`QUEUED STAR WITH ID: ${data.MessageId}`)

      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `QUEUED STAR WITH ID: ${data.MessageId}`,
        }),
      }

      callback(null, response)
    }
  })
}

export default queueStar
