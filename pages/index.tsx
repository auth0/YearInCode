import {Layout} from '@components/common'
import {Typography} from '@components/ui'
import {useFetchUser} from '@lib/user'

export default function Home() {
  const {user, loading} = useFetchUser()

  return (
    <section className="text-center space-y-6">
      <Typography variant="h3" as="h1">
        Next.js and Auth0 Example
      </Typography>

      {loading && <p>Loading login info...</p>}

      {!loading && !user && (
        <div className="space-y-2">
          <Typography variant="body1">
            To test the login click in <i>Login</i>
          </Typography>
          <Typography variant="body2">
            Once you have logged in you should be able to click in{' '}
            <i>Profile</i> and <i>Logout</i>
          </Typography>
        </div>
      )}

      {user && (
        <>
          <Typography variant="h4">Rendered user info on the client</Typography>
          <img src={user.picture} alt="user picture" />
          <Typography variant="body1">nickname: {user.nickname}</Typography>
          <Typography variant="body1">name: {user.name}</Typography>
        </>
      )}
    </section>
  )
}

Home.Layout = Layout
