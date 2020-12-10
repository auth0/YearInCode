import Head from 'next/head'

import {Header} from '@components/common'

function Layout({children}) {
  return (
    <>
      <Head>
        <title>Next.js with Auth0</title>
      </Head>

      <Header />

      <main>
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  )
}

export default Layout
