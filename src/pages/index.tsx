import {Footer, Header, Layout, PosterBackdrop} from '@components/common'
import {Celebrate, Hero, ShowcaseGrid} from '@components/home'
import {auth0} from '@lib/auth'

interface HomeProps {
  isLoggedIn: boolean
}

export default function Home({isLoggedIn}: HomeProps) {
  return (
    <Layout
      navigation={<Header isLoggedIn={isLoggedIn} />}
      content={
        <PosterBackdrop>
          <div className="flex flex-col flex-1">
            <Hero />
            <Celebrate />
            <ShowcaseGrid />
          </div>
        </PosterBackdrop>
      }
      footer={<Footer />}
    />
  )
}

export async function getServerSideProps({req}) {
  const session = await auth0.getSession(req)

  return {
    props: {
      isLoggedIn: Boolean(session),
    },
  }
}
