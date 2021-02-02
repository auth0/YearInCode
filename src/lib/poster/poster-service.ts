import axios from 'axios'

import {client} from '@lib/api'
import {constants} from '@lib/common'
import {
  PosterSlugResponse,
  PosterStatusDTO,
  PosterStatusResponse,
} from '@nebula/types/poster'
import {QueueDTO, QueueResponse} from '@nebula/types/queue'

class PosterServiceImplementation {
  public async queuePoster({userId, years}: QueueDTO) {
    const {data} = await client.post<QueueResponse>('/posters/queue', {
      userId,
      years,
    })

    return data
  }

  public async getStatus(
    userId: PosterStatusDTO['userId'],
    accessToken: string,
  ) {
    const url = `${constants.api.lambdaUrl}/posters/status/?userId=${userId}`

    const {data} = await axios.get<PosterStatusResponse>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return data
  }

  public async getPosterBySlug(posterSlug: string) {
    const url = `${constants.api.lambdaUrl}/posters/${posterSlug}`

    const {data} = await axios.get<PosterSlugResponse>(url)

    return data
  }

  public async requestQueue(
    userId: QueueDTO['userId'],
    years: QueueDTO['years'],
    accessToken: string,
  ) {
    const url = `${constants.api.lambdaUrl}/posters/queue`

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

export const PosterService = new PosterServiceImplementation()
