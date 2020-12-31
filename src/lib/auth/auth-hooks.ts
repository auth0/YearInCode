import {useQuery} from 'react-query'
import {AxiosError} from 'axios'

import {createLoginUrl} from '@lib/common'

import {AuthService} from './auth-service'

export interface UseFetchUserParams {
  required?: boolean
  redirectTo?: string
}

export function useFetchUser({required, redirectTo}: UseFetchUserParams = {}) {
  const query = useQuery('user', AuthService.fetchUser, {
    staleTime: 7200,
    retry: 0,
    refetchOnWindowFocus: false,
    onError: (error: AxiosError) => {
      if (required && error.message.includes('401')) {
        window.location.href = createLoginUrl(redirectTo)
      }
    },
  })

  return {user: query.data, ...query}
}
