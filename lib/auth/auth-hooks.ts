import {AxiosError} from 'axios'
import {useQuery} from 'react-query'

import {createLoginUrl} from '@lib/common'

import {AuthService} from './auth-services'

interface useAuthParams {
  required?: boolean
  redirectTo?: string
}

export function useAuth({required, redirectTo}: useAuthParams = {}) {
  const query = useQuery('user', AuthService.fetchUser, {
    cacheTime: 60000,
    retry: 0,
    refetchOnWindowFocus: false,
    onError: (err: AxiosError) => {
      if (err.message.includes('401') && required) {
        window.location.assign(createLoginUrl(redirectTo))
      }
    },
  })

  return {user: query.data, ...query}
}
