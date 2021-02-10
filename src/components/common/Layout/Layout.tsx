import {Header, Footer, PosterBackdrop} from '@components/common'

const Layout: React.FC = ({children}) => (
  <div className="container flex flex-col mx-auto min-h-screen">
    <Header />

    <PosterBackdrop>{children}</PosterBackdrop>

    <Footer />
  </div>
)

export default Layout
