import {Footer, Header, Layout, PosterBackdrop} from '@components/common'
import {Celebrate, Hero, ShowcaseGrid} from '@components/home'
import {auth0} from '@lib/auth'
import {PosterService} from '@lib/poster/poster-service'
import {PosterGalleryResponse} from '@nebula/types/poster'

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
  const posterImagesPromise = PosterService._getGalleryPosters()

  const session = await sessionPromise
  const posterImages = await posterImagesPromise

  return {
    props: {
      isLoggedIn: Boolean(session),
      galleryPosters: posterImages,
    },
  }
}
