import {LayoutNoBackdrop} from '@components/poster'
import {PosterComponent} from '@components/poster/Poster/Poster'
import {getMockData} from '@components/poster/Poster/Poster.utils'

export default function PosterBySlug({}) {
  return (
    <section className="flex flex-1 flex-col items-center pb-12 px-4 overflow-hidden">
      <PosterComponent data={getMockData()} width={300} height={300} />
      {/* <DownloadPoster /> */}
    </section>
  )
}

PosterBySlug.Layout = LayoutNoBackdrop
