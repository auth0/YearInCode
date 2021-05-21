import {AppProps} from 'next/dist/next-server/lib/router/router'
import {Router} from 'next/router'
import nProgress from 'nprogress'
import {QueryClientProvider, QueryClient} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {SSRProvider} from '@react-aria/ssr'
import {ToastContainer} from 'react-toastify'
import {OverlayProvider} from '@react-aria/overlays'

import '@fontsource/inter/400.css' // Normal
import '@fontsource/inter/600.css' // Semi-Bold
import 'react-toastify/dist/ReactToastify.min.css'

import {Head} from '@components/common'
import '@assets/css/main.css'

// Add tailwind-debug-screens in development
if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
  document.body.classList.add('debug-screens')
}

Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

function App({Component, pageProps}: AppProps) {
  return (
    <AppProviders>
      <Head />

      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </AppProviders>
  )
}

const queryClient = new QueryClient()

const AppProviders: React.FC = ({children}) => (
  <QueryClientProvider client={queryClient}>
    <SSRProvider>
      <OverlayProvider>{children}</OverlayProvider>
    </SSRProvider>
  </QueryClientProvider>
)

export default App
