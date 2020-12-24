import {QueryObserverResult, useQuery} from 'react-query'

import {GitHubService} from './github-service'

export interface UseFetchUserParams {
  required?: boolean
  redirectTo?: string
}

const SIXTY_SECONDS = 60 * 1000

export function useUserRepositories(
  userId: string,
): QueryObserverResult<{}, unknown> {
  return useQuery(
    ['repositories', {userId}],
    () => GitHubService.getUserRepositories(userId),
    {
      enabled: Boolean(userId),
      staleTime: SIXTY_SECONDS,
      cacheTime: SIXTY_SECONDS,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  )
}
