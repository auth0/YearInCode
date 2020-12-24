import React from 'react'
import Image from 'next/image'
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import {RippleArrow} from '@components/ui'
import ChevronRight from '@assets/svg/chevron-right.svg'
import ChevronLeft from '@assets/svg/chevron-left.svg'

import s from './ReadyCarousel.module.css'

interface Props {}

type DivRef = React.RefObject<HTMLDivElement>

const ReadyCarousel = (props: Props) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [sliderRef, slider] = useKeenSlider({
    initial: 1,
    slidesPerView: 3,
    centered: true,
    spacing: 50,
    mode: 'free-snap',
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide)
    },
  })

  return (
    <div className="relative flex items-center justify-center">
      <div ref={sliderRef as DivRef} className="keen-slider">
        <div className="keen-slider__slide">
          <Image
            width={457}
            height={600}
            layout="fixed"
            src="/img/picanova-placeholder-1.png"
            alt="Your death star canvas"
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            width={446}
            height={600}
            layout="fixed"
            src="/img/poster.png"
            alt="Your generated death star"
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            width={457}
            layout="fixed"
            height={600}
            src="/img/picanova-placeholder-2.png"
            alt="Your death star cellphone wallpaper"
          />
        </div>
      </div>
      {slider && (
        <div className={s.arrowContainer}>
          <RippleArrow
            onClick={e => {
              e.stopPropagation()
              slider.prev()
            }}
            disabled={currentSlide === 0}
            icon={<ChevronLeft />}
            aria-label="Next slide"
          />

          <RippleArrow
            onClick={e => {
              e.stopPropagation()
              slider.next()
            }}
            disabled={currentSlide === slider.details().size - 1}
            icon={<ChevronRight />}
            aria-label="Previous slide"
          />
        </div>
      )}
    </div>
  )
}

export default ReadyCarousel
