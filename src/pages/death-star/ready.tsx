import {
  ReadyCarousel,
  LayoutNoBackdrop,
  GetPoster,
} from '@components/death-star'
import {Star} from '@nebula/components/star'
import {getMockData} from '@nebula/components/star/Star/Star.utils'

export default function Ready() {
  return (
    <section className="flex flex-1 flex-col items-center pb-12 px-4 overflow-hidden">
      <Star data={getMockData()} />
      <ReadyCarousel />
      <GetPoster />
    </section>
  )
}

Ready.Layout = LayoutNoBackdrop
