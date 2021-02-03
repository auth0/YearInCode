import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi'

import {logger} from '@nebula/log'
import ConnectionModel from '@api/posters/connection.model'

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
            ConnectionModel.delete(connectionId)
          }

          reject(error)
        }
        resolve(data)
      },
    )
  })
