import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi'

import {logger} from '@nebula/log'
import PosterModel from '@api/poster/poster.model'
import {PosterUserStatus} from '@nebula/types/poster'

export const sendMessageToClient = (
  apiGatewayManagementApiURL: string,
  connectionId: string,
  payload: string | Record<string, any>,
) =>
  new Promise((resolve, reject) => {
    const apiGatewayManagementApi = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: apiGatewayManagementApiURL,
      ...(process.env.IS_OFFLINE && {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      }),
    })

    apiGatewayManagementApi.postToConnection(
      {
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      },
      (error, data) => {
        if (error) {
          logger.error('Error sending message to client ' + error)

          if (error.statusCode === 410) {
            logger.info(`Found stale connection, deleting ${connectionId}`)
            PosterModel.query('connectionId')
              .eq(connectionId)
              .using('connectionIdIndex')
              .exec()
              .then(result => {
                PosterModel.update(
                  {userId: result[0].userId},
                  {
                    connectionId: undefined,
                    connectionStatus: PosterUserStatus.OFFLINE,
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
