import axios from 'axios'

import {client} from '@lib/api'
import {constants} from '@lib/common'
import {PosterStatusDTO, PosterStatusResponse} from '@nebula/types/poster'
import {QueueDTO, QueueResponse} from '@nebula/types/queue'

class DeathStarServiceImplementation {
  public async queueStar({userId, years}: QueueDTO) {
    const {data} = await client.post<QueueResponse>('/poster/queue', {
      userId,
      years,
    })

    return data
  }

  public async getStatus(
    userId: PosterStatusDTO['userId'],
    accessToken: string,
  ) {
    const url = `${constants.api.lambdaUrl}/poster/status/?userId=${userId}`

    const {data} = await axios.get<PosterStatusResponse>(url, {
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
    const url = `${constants.api.lambdaUrl}/poster/queue`

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
