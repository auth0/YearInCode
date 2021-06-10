import {GetServerSideProps} from 'next'
import Link from 'next/link'

import NotFoundSvg from '@assets/svg/not-found.svg'
import {Footer, Header, Layout} from '@components/common'
import {Button, Typography} from '@components/ui'
import {auth0} from '@lib/auth'

const ErrorPage: React.FC<ErrorPageProps> = ({isLoggedIn}) => (
  <Layout
    navigation={<Header isLoggedIn={isLoggedIn} />}
    footer={<Footer />}
    content={
      <div className="flex flex-col flex-1 lg:flex-row items-center">
        <NotFoundSvg className="place-self-center" />
        <div className="flex flex-col flex-1 p-10 text-center justify-center items-center">
          <Typography variant="h2" className="font-bold mb-6">
            Oh, no!
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="text-white leading-relaxed opacity-60 mb-6"
          >
            This page does not exist, do not let this stop you from building
            awesome things.
          </Typography>
          <Link href="/" passHref>
            <Button color="primary" className="max-w-max">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    }
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
