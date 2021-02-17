import {NextSeo} from 'next-seo'

import {LayoutNoBackdrop, DownloadPoster} from '@components/poster'
import {PosterService} from '@lib/poster/poster-service'
import {Poster, PosterSlugResponse} from '@nebula/types/poster'
import {logger} from '@nebula/log'
import PosterComponent from '@components/poster/Poster'
import {constants} from '@lib/common'
import {Year} from '@nebula/types/queue'
import {auth0} from '@lib/auth'

interface PosterBySlugProps {
  year: Year
  posterSlug: string
  posterData: Poster
  posterImages: PosterSlugResponse['posterImages']
  otherPosters: PosterSlugResponse['otherPosters']
  isLoggedIn: boolean
}

export default function PosterBySlug({
  year,
  posterData,
  posterImages,
  posterSlug,
  otherPosters,
  isLoggedIn,
}: PosterBySlugProps) {
  const siteUrl = `${constants.site.url}/posters/${posterSlug}`

  return (
    <>
      <NextSeo
        title={`${posterData.name}'s ${posterData.year} Year in Code`}
        openGraph={{
          site_name: siteUrl,
          description: `Come take a look at the art generated from ${posterData.name}’s code in ${posterData.year}!`,
          images: [
            {
              url: `${constants.site.cloudfront_url}/${posterImages.openGraph}`,
              width: 1280,
              height: 680,
            },
          ],
        }}
        twitter={{
          site: siteUrl,
        }}
      />

      <DownloadPoster
        year={year}
        isLoggedIn={isLoggedIn}
        posterImages={posterImages}
        posterSlug={posterSlug}
        otherPosters={otherPosters}
      />

      <section className="flex flex-col items-center flex-1 px-4 pb-12 overflow-auto">
        <PosterComponent wrapperClassName="mt-12" data={posterData} />
      </section>
    </>
  )
}

export async function getServerSideProps({params, res, req}) {
  try {
    const {slug} = params

    const session = await auth0.getSession(req)

    const {
      posterData,
      posterImages,
      year,
      otherPosters,
    } = await PosterService.getPosterBySlug(slug)

    return {
      props: {
        year,
        posterSlug: slug,
        posterData: JSON.parse(posterData) as Poster,
        posterImages,
        otherPosters,
        isLoggedIn: Boolean(session),
      },
    }
  } catch (err) {
    logger.error(err)

    const e = err.message.split(' ')
    const errorStatus: string = e[e.length - 1]

    if (errorStatus === '404') {
      res.writeHead(302, {
        Location: `/`,
      })

      res.end()

      return {props: {}}
    }
  }
}

PosterBySlug.Layout = LayoutNoBackdrop
