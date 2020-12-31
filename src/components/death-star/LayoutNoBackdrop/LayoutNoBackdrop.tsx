import Head from 'next/head'

import {Header} from '@components/common'

const Layout: React.FC = ({children}) => (
  <div className="container flex flex-col mx-auto min-h-screen">
    <Head>
      <title>Next.js with Auth0</title>
    </Head>

    <Header />

    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="container z-10 flex flex-1 flex-col mx-auto">
        {children}
      </div>
    </main>
  </div>
)

export default Layout
