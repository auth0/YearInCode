import dynamic from 'next/dynamic'

import {ReadyCarousel, LayoutNoBackdrop, GetPoster} from '@components/poster'
import {
  getMockData,
  getRandomArbitrary,
} from '@components/poster/Star/Star.utils'

const Star = dynamic(() => import('@components/poster/Star'), {ssr: false})

export default function Ready() {
  return (
    <section className="flex flex-1 flex-col items-center pb-12 px-4 overflow-hidden">
      <ReadyCarousel />
      <GetPoster />
      <Star
        wrapperClassName="mt-12"
        data={getMockData([16, 32, 52][getRandomArbitrary(0, 3)])}
      />
    </section>
  )
}

Ready.Layout = LayoutNoBackdrop
