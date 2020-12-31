import Head from 'next/head'

import {Header, Footer, DeathStarBackdrop} from '@components/common'

const Layout: React.FC = ({children}) => (
  <div className="container flex flex-col mx-auto min-h-screen">
    <Head>
      <title>Next.js with Auth0</title>
    </Head>

    <Header />

    <DeathStarBackdrop>{children}</DeathStarBackdrop>

    <Footer />
  </div>
)

export default Layout
