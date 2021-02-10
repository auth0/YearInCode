import NextHead from 'next/head'
import {DefaultSeo} from 'next-seo'

import config from '@config/seo.json'

const siteUrl = process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI

const Head: React.FC = () => {
  return (
    <>
      <DefaultSeo
        title={config.title}
        titleTemplate={config.titleTemplate}
        description={config.description}
        openGraph={{
          ...config.openGraph,
          site_name: siteUrl,
          images: [{url: siteUrl + '/img/poster-placeholder.png'}],
        }}
        twitter={{...config.twitter, site: siteUrl}}
      />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
      </NextHead>
    </>
  )
}

export default Head
