import {client} from '@lib/api'
import {QueueDTO, QueueResponse} from '@nebula/types/queue'

class DeathStarServiceImplementation {
  public async queueStar({userId, years}: QueueDTO) {
    const {data} = await client.post<QueueResponse>('/death-star/queue', {
      userId,
      years,
    })

    return data
  }
}

export const DeathStarService = new DeathStarServiceImplementation()
