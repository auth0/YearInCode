import {ManagementClient} from 'auth0'
import middy from 'middy'
import {Callback, SQSEvent, Context, SQSRecord} from 'aws-lambda'
import sqsBatch from '@middy/sqs-partial-batch-failure'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'

import {SetBodyToType} from '@api/lib/common'
import {QueueDTO} from '@nebula/types/queue'
import {logger} from '@nebula/log'

const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
const auth0Management = new ManagementClient({
  domain: auth0Domain,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:user_idp_tokens',
})

function start(event: SQSEvent, _context: Context, callback: Callback) {
  const recordPromises = event.Records.map(async (record: any) => {
    const {
      body: {userId},
    } = record as SetBodyToType<SQSRecord, QueueDTO>

    const {identities} = await auth0Management.getUser({
      id: userId,
    })

    const GitHubToken = identities.find(
      identity => identity.provider === 'github',
    ).access_token

    logger.info(GitHubToken)
  })

  return Promise.allSettled(recordPromises)
}

const handler = middy(start).use(sqsJsonBodyParser()).use(sqsBatch())

export default handler
