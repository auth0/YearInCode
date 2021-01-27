import dynamic from 'next/dynamic'

import {
  ReadyCarousel,
  LayoutNoBackdrop,
  GetPoster,
} from '@components/death-star'
import {getMockData} from '@components/death-star/Star/Star.utils'

const Star = dynamic(() => import('@components/death-star/Star'), {ssr: false})

export default function Ready() {
  return (
    <section className="flex flex-1 flex-col items-center pb-12 px-4 overflow-hidden">
      <ReadyCarousel />
      <GetPoster />
      <Star wrapperClassName="mt-12" data={getMockData()} />
    </section>
  )
}

Ready.Layout = LayoutNoBackdrop
