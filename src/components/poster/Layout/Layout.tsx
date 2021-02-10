import Head from 'next/head'

import {Header, PosterBackdrop} from '@components/common'

const Layout: React.FC = ({children}) => (
  <div className="container flex flex-col mx-auto min-h-screen">
    <Header />

    <PosterBackdrop>{children}</PosterBackdrop>
  </div>
)

export default Layout
