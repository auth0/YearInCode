import {useQuery} from 'react-query'

import {GitHubService} from './github-service'

export interface UseFetchUserParams {
  required?: boolean
  redirectTo?: string
}

export function useUserRepositories(userId: string) {
  return useQuery(
    ['repositories', {userId}],
    () => GitHubService.getUserRepositories(userId),
    {
      enabled: Boolean(userId),
      staleTime: 60 * 1000,
      cacheTime: 60 * 1000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  )
}
