import {QueryClientProvider, QueryClient} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import 'typeface-poppins'

import '@assets/css/main.css'

const Noop: React.FC = ({children}) => <>{children}</>
const queryClient = new QueryClient()

function App({Component, pageProps}) {
  const Layout = (Component as any).Layout || Noop

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Layout>
    </QueryClientProvider>
  )
}

export default App
