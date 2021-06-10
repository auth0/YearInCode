import {GetServerSideProps} from 'next'

import {Footer, Header, Layout} from '@components/common'
import {auth0} from '@lib/auth'

const ErrorPage: React.FC<ErrorPageProps> = ({isLoggedIn}) => (
  <Layout
    navigation={<Header isLoggedIn={isLoggedIn} />}
    footer={<Footer />}
    content={null}
  />
)

export const getServerSideProps: GetServerSideProps<ErrorPageProps> = async ({
  req,
}) => {
  const session = await auth0.getSession(req)
  return {props: {isLoggedIn: Boolean(session)}}
}

type ErrorPageProps = {isLoggedIn: boolean}

export default ErrorPage
