import Layout from '@components/common/Layout'
import {useAuth} from '@lib/auth'

function ProfileCard({user}) {
  return (
    <>
      <h1>Profile</h1>

      <div>
        <h3>Profile (client rendered)</h3>
        <img src={user.picture} alt="user picture" />
        <p>nickname: {user.nickname}</p>
        <p>name: {user.name}</p>
      </div>
    </>
  )
}

function Profile() {
  const {user, isLoading} = useAuth({required: true})

  return (
    <Layout>{isLoading ? <>Loading...</> : <ProfileCard user={user} />}</Layout>
  )
}

export default Profile
