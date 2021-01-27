import dynamic from 'next/dynamic'

import {
  ReadyCarousel,
  LayoutNoBackdrop,
  GetPoster,
} from '@components/death-star'
import {
  getMockData,
  getRandomArbitrary,
} from '@components/death-star/Star/Star.utils'

const Star = dynamic(() => import('@components/death-star/Star'), {ssr: false})

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
