import 'typeface-poppins'

import '@assets/css/main.css'

const Noop: React.FC = ({children}) => <>{children}</>

function App({Component, pageProps}) {
  const Layout = (Component as any).Layout || Noop

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
