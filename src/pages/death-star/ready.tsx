import {
  ReadyCarousel,
  LayoutNoBackdrop,
  GetPoster,
} from '@components/death-star'

export default function Ready() {
  return (
    <section className="flex flex-1 flex-col items-center pb-12 px-4 overflow-hidden">
      <ReadyCarousel />
      <GetPoster />
    </section>
  )
}

Ready.Layout = LayoutNoBackdrop
