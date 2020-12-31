import {Router} from 'next/router'
import NProgress from 'nprogress'
import {QueryClientProvider, QueryClient} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {SSRProvider} from '@react-aria/ssr'

import '@fontsource/inter/400.css' // Normal
import '@fontsource/inter/600.css' // Semi-Bold

import '@assets/css/main.css'

const Noop: React.FC = ({children}) => <>{children}</>

// Add tailwind-debug-screens in development
if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
  document.body.classList.add('debug-screens')
}

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App({Component, pageProps}) {
  const Layout = (Component as any).Layout || Noop

  return (
    <AppProviders>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Layout>
    </AppProviders>
  )
}

const queryClient = new QueryClient()

const AppProviders: React.FC = ({children}) => (
  <QueryClientProvider client={queryClient}>
    <SSRProvider>{children}</SSRProvider>
  </QueryClientProvider>
)

export default App
