import NextHead from 'next/head'
import {DefaultSeo} from 'next-seo'

import {constants} from '@lib/common'
import config from '@config/seo.json'

const Head: React.FC = () => {
  return (
    <>
      <DefaultSeo
        title={config.title}
        titleTemplate={config.titleTemplate}
        description={config.description}
        openGraph={{
          ...config.openGraph,
          site_name: constants.site.url,
          images: [{url: constants.site.url + '/img/poster-placeholder.png'}],
        }}
        twitter={{...config.twitter, site: constants.site.url}}
      />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
      </NextHead>
    </>
  )
}

export default Head
