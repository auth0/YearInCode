import {NextSeo} from 'next-seo'

import {LayoutNoBackdrop, DownloadPoster} from '@components/poster'
import {PosterService} from '@lib/poster/poster-service'
import {Poster, PosterSlugResponse} from '@nebula/types/poster'
import {logger} from '@nebula/log'
import PosterComponent from '@components/poster/Poster'
import {constants} from '@lib/common'

interface PosterBySlugProps {
  posterSlug: string
  posterData: Poster
  posterImages: PosterSlugResponse['posterImages']
}

export default function PosterBySlug({
  posterData,
  posterImages,
  posterSlug,
}: PosterBySlugProps) {
  const siteUrl = `${constants.site.url}/posters/${posterSlug}`

  return (
    <>
      <NextSeo
        title={`${posterData.name}'s Year in Code`}
        openGraph={{
          site_name: siteUrl,
          description: `Come and check out ${posterData.name}'s developer activity!`,
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

      <DownloadPoster posterImages={posterImages} posterSlug={posterSlug} />

      <section className="flex flex-col items-center flex-1 px-4 pb-12 overflow-auto">
        <PosterComponent wrapperClassName="mt-12" data={posterData} />
      </section>
    </>
  )
}

export async function getServerSideProps({params, res}) {
  try {
    const {slug} = params

    const {posterData, posterImages} = await PosterService.getPosterBySlug(slug)

    return {
      props: {
        posterSlug: slug,
        posterData: JSON.parse(posterData) as Poster,
        posterImages,
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
