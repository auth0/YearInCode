import Layout from '@components/common/Layout'
import {Typography} from '@components/ui'
import {auth0, UserProfile} from '@lib/auth'
import {createLoginUrl} from '@lib/common'
import {useUserRepositories} from '@lib/github/github-hooks'

function ProfileCard({user}) {
  return (
    <>
      <Typography variant="h2" as="h1">
        Profile (private)
      </Typography>

      <div className="flex flex-col items-center space-y-4">
        <img
          className="w-36 h-36 rounded-lg"
          src={user.picture}
          alt="user picture"
        />
        <p>nickname: {user.nickname}</p>
        <p>name: {user.name}</p>
      </div>
    </>
  )
}

interface Props {
  user: UserProfile
}

export default function ProtectedRouteTest({user}: Props) {
  const {data: repos} = useUserRepositories(user.sub)

  return (
    <div className="flex flex-col items-center space-y-8">
      <ProfileCard user={user} />
    </div>
  )
}

export async function getServerSideProps({req, res}) {
  const session = await auth0.getSession(req)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: createLoginUrl('/profile'),
    })
    res.end()

    return
  }

  return {props: {user: session.user}}
}

ProtectedRouteTest.Layout = Layout
