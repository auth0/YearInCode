import axios from 'axios'

import {client} from '@lib/api'
import {constants} from '@lib/common'
import {
  DeathStarStatusDTO,
  DeathStarStatusResponse,
} from '@nebula/types/death-star'
import {QueueDTO, QueueResponse} from '@nebula/types/queue'

class DeathStarServiceImplementation {
  public async queueStar({userId, years}: QueueDTO) {
    const {data} = await client.post<QueueResponse>('/death-star/queue', {
      userId,
      years,
    })

    return data
  }

  public async getStatus(
    userId: DeathStarStatusDTO['userId'],
    accessToken: string,
  ) {
    const url = `${constants.api.lambdaUrl}/death-star/status/?userId=${userId}`

    const {data} = await axios.get<DeathStarStatusResponse>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return data
  }

  public async requestQueue(
    userId: QueueDTO['userId'],
    years: QueueDTO['years'],
    accessToken: string,
  ) {
    const url = `${constants.api.lambdaUrl}/death-star/queue`

    return axios.post<QueueResponse>(
      url,
      {userId, years},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  }
}

export const DeathStarService = new DeathStarServiceImplementation()
