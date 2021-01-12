import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi'

import {logger} from '@nebula/log'
import DeathStar from '@api/death-star/death-star.model'
import {DeathStarUserStatus} from '@nebula/types/death-star'

export const sendMessageToClient = (
  apiGatewayManagementApiURL: string,
  connectionId: string,
  payload: string | Record<string, any>,
) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: apiGatewayManagementApiURL,
      accessKeyId: 'local',
      secretAccessKey: 'local',
    })

    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      },
      (error, data) => {
        if (error) {
          logger.error('Error sending message to client ' + error)

          if (error.statusCode === 410) {
            logger.info(`Found stale connection, deleting ${connectionId}`)
            DeathStar.query('connectionId')
              .eq(connectionId)
              .using('connectionIdIndex')
              .exec()
              .then(result => {
                DeathStar.update(
                  {userId: result[0].userId},
                  {
                    connectionId: undefined,
                    connectionStatus: DeathStarUserStatus.OFFLINE,
                  },
                )
              })
              .catch(err => {
                logger.error('Failed removing stale connection: ' + err)
              })
          }

          reject(error)
        }
        resolve(data)
      },
    )
  })
