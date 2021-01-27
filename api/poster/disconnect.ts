import {APIGatewayEvent} from 'aws-lambda'

import {PosterUserStatus} from '@nebula/types/poster'

import DeathStar from './poster.model'

export async function disconnect(event: APIGatewayEvent) {
  const result = await DeathStar.query('connectionId')
    .eq(event.requestContext.connectionId)
    .using('connectionIdIndex')
    .exec()

  if (result.length) {
    await DeathStar.update(
      {userId: result[0].userId},
      {
        connectionId: undefined,
        connectionStatus: PosterUserStatus.OFFLINE,
      },
    )
  }
}
