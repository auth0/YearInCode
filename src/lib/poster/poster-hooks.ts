import {useMutation} from 'react-query'

import {QueueDTO} from '@nebula/types/queue'

import {PosterService} from './poster-service'

export function useQueueDeathStar() {
  return useMutation((dto: QueueDTO) => PosterService.queuePoster(dto))
}
