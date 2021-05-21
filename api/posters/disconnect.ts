import {APIGatewayEvent} from 'aws-lambda'

import ConnectionModel from './connection.model'

export async function disconnect(event: APIGatewayEvent) {
  await ConnectionModel.delete(event.requestContext.connectionId as string)
}
