import {Layout} from '@components/common'
import {Typography} from '@components/ui'
import {useFetchUser} from '@lib/auth'

export default function Home() {
  const {user, isLoading} = useFetchUser()

  return (
    <section className="text-center space-y-8">
      <Typography variant="h3" as="h1">
        Next.js and Auth0 Example
      </Typography>

      {isLoading && <p>Loading login info...</p>}

      {!isLoading && !user && (
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
        <div className="flex flex-col items-center space-y-6">
          <Typography variant="h5">Rendered user info on the client</Typography>
          <img
            className="w-36 h-36 rounded-lg"
            src={user.picture}
            alt="user picture"
          />
          <Typography variant="body1">nickname: {user.nickname}</Typography>
          <Typography variant="body1">name: {user.name}</Typography>
        </div>
      )}
    </section>
  )
}

Home.Layout = Layout
