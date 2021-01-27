import {useMutation} from 'react-query'

import {QueueDTO} from '@nebula/types/queue'

import {DeathStarService} from './poster-service'

export function useQueueDeathStar() {
  return useMutation((dto: QueueDTO) => DeathStarService.queueStar(dto))
}
