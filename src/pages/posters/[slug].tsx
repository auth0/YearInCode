import {NextSeo} from 'next-seo'

import {LayoutNoBackdrop, DownloadPoster} from '@components/poster'
import {PosterService} from '@lib/poster/poster-service'
import {Poster} from '@nebula/types/poster'
import {logger} from '@nebula/log'
import PosterComponent from '@components/poster/Poster'

interface PosterBySlugProps {
  posterSlug: string
  posterData: Poster
}

export default function PosterBySlug({
  posterData,
  posterSlug,
}: PosterBySlugProps) {
  return (
    <>
      <NextSeo title={`${posterData.name}'s Year in Code`} />
      <section className="py-12">
        <DownloadPoster posterSlug={posterSlug} />
      </section>
      <section className="flex flex-1 flex-col items-center pb-12 px-4 overflow-hidden">
        <PosterComponent wrapperClassName="mt-12" data={posterData} />
      </section>
    </>
  )
}

export async function getServerSideProps({params, res}) {
  try {
    const {slug} = params

    const {posterData} = await PosterService.getPosterBySlug(slug)

    return {
      props: {
        posterSlug: slug,
        posterData: JSON.parse(posterData) as Poster,
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
