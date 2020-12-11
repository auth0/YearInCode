import {QueryCache, ReactQueryCacheProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query-devtools'
import 'typeface-poppins'

import '@assets/css/main.css'

const Noop: React.FC = ({children}) => <>{children}</>
const queryCache = new QueryCache()

function App({Component, pageProps}) {
  const Layout = (Component as any).Layout || Noop

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Layout>
    </ReactQueryCacheProvider>
  )
}

export default App
