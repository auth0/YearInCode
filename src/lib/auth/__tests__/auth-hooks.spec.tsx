import {renderHook} from '@testing-library/react-hooks'
import {QueryClientProvider, QueryClient} from 'react-query'

import {useFetchUser, UseFetchUserParams} from '@lib/auth'
import {rest, server} from '@tests/server'
import {constants} from '@lib/common'

interface SetupUseFetchHookParams {
  params?: UseFetchUserParams
}

function setupFetchUserHook({params}: SetupUseFetchHookParams = {}) {
  const queryClient = new QueryClient()
  const wrapper = ({children}) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
      rest.get(`${constants.api.url}/me`, (req, res, ctx) => {
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
