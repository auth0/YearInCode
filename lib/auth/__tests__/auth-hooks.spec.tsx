import {renderHook} from '@testing-library/react-hooks'
import {QueryCache, ReactQueryCacheProvider} from 'react-query'

import {useFetchUser, UseFetchUserParams} from '@lib/auth'
import {rest, server} from '@test/server'
import api from '@constants/api'

interface SetupUseFetchHookParams {
  params?: UseFetchUserParams
}

function setupFetchUserHook({params}: SetupUseFetchHookParams = {}) {
  const queryCache = new QueryCache()
  const wrapper = ({children}) => (
    <ReactQueryCacheProvider queryCache={queryCache}>
      {children}
    </ReactQueryCacheProvider>
  )

  return renderHook(() => useFetchUser(params), {wrapper})
}

describe('useFetchUser', () => {
  it('should return user information', async () => {
    const {result, waitFor} = setupFetchUserHook()

    await waitFor(() => {
      return result.current.isSuccess
    })

    expect(result.current.data).toEqual({
      name: expect.any(String),
      nickname: expect.any(String),
      picture: '',
      sub: expect.any(String),
      updated_at: expect.any(String),
    })
  })

  it('should redirect user on required when unauthorized', async () => {
    server.use(
      rest.get(`${api.url}/me`, (req, res, ctx) => {
        return res(ctx.status(401))
      }),
    )

    const params = {required: true, redirectTo: '/'}

    Object.defineProperty(window, 'location', {
      value: {
        href: params.redirectTo,
      },
    })

    const {result, waitFor} = setupFetchUserHook({
      params,
    })

    await waitFor(() => {
      return result.current.isError
    })

    expect(window.location.href).toEqual('/api/login/?redirectTo=%2F')
  })
})
