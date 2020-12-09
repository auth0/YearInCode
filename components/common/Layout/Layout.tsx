import Head from 'next/head'

import {Header} from '@components/common'

function Layout({user, loading = false, children}) {
  return (
    <>
      <Head>
        <title>Next.js with Auth0</title>
      </Head>

      <Header user={user} loading={loading} />

      <main>
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  )
}

export default Layout
