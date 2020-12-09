// This import is only needed when checking authentication status directly from getInitialProps
// import auth0 from '../lib/auth0'
import Layout from '@components/common/Layout'
import {useFetchUser} from '@lib/user'

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
  const {user, loading} = useFetchUser({required: true})

  return (
    <Layout user={user} loading={loading}>
      {loading ? <>Loading...</> : <ProfileCard user={user} />}
    </Layout>
  )
}

export default Profile
