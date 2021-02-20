import * as cache from 'memory-cache'

import {Footer, Header, Layout, PosterBackdrop} from '@components/common'
import {Celebrate, Hero, ShowcaseGrid} from '@components/home'
import {auth0} from '@lib/auth'
import {PosterService} from '@lib/poster/poster-service'
import {PosterGalleryResponse} from '@nebula/types/poster'
import {logger} from '@nebula/log'

interface HomeProps {
  isLoggedIn: boolean
  galleryPosters: PosterGalleryResponse
}

export default function Home({isLoggedIn, galleryPosters}: HomeProps) {
  return (
    <Layout
      navigation={<Header isLoggedIn={isLoggedIn} />}
      content={
        <PosterBackdrop>
          <div className="flex flex-col flex-1">
            <Hero />
            <Celebrate />
            <ShowcaseGrid galleryPosters={galleryPosters} />
          </div>
        </PosterBackdrop>
      }
      footer={<Footer />}
    />
  )
}

export async function getServerSideProps({req}) {
  const sessionPromise = auth0.getSession(req)

  const cachedGalleryPosters = cache.get('galleryPosters')
  if (!cachedGalleryPosters) {
    logger.info("Didn't find value in cache. Caching...")
    const galleryPostersPromise = PosterService._getGalleryPosters()
    const galleryPosters = await galleryPostersPromise

    const session = await sessionPromise

    cache.put('galleryPosters', galleryPosters)

    return {
      props: {
        isLoggedIn: Boolean(session),
        galleryPosters: galleryPosters,
      },
    }
  }

  logger.info('Found value in cache. Using it...')

  const session = await sessionPromise

  return {
    props: {
      isLoggedIn: Boolean(session),
      galleryPosters: cachedGalleryPosters,
    },
  }
}
