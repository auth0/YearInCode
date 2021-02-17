import {useMutation} from 'react-query'

import {QueueDTO} from '@nebula/types/queue'

import {PosterService} from './poster-service'

export function useQueuePoster() {
  return useMutation((dto: {year: QueueDTO['year']}) =>
    PosterService.queuePoster(dto),
  )
}
