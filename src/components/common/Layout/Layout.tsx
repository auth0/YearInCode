import NextHead from 'next/head'

import {constants} from '@lib/common'

interface LayoutProps {
  navigation?: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({navigation, content, footer}) => (
  <>
    <NextHead>
      {constants.site.cloudflareAnalyticsId && (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${constants.site.cloudflareAnalyticsId}"}`}
        ></script>
      )}
    </NextHead>
    <div className="container flex flex-col min-h-screen mx-auto">
      {navigation}
      <main className="flex flex-col flex-1">{content}</main>
      {footer}
    </div>
  </>
)

export default Layout
