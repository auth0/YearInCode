import * as React from 'react'
import {ParentSize} from '@visx/responsive'
import clsx from 'clsx'
import {useWindowSize} from 'react-use'
import {useTooltip, useTooltipInPortal, TooltipWithBounds} from '@visx/tooltip'
import {AnimatePresence, motion} from 'framer-motion'

import {Poster} from '@nebula/types/poster'
import {Typography} from '@components/ui'
import NameIcon from '@assets/svg/name.svg'
import YearIcon from '@assets/svg/year.svg'
import FollowersIcon from '@assets/svg/followers.svg'
import LanguageIcon from '@assets/svg/language.svg'
import LinesIcon from '@assets/svg/lines.svg'
import CommitsIcon from '@assets/svg/commits.svg'
import HashIcon from '@assets/svg/hash.svg'
import RepositoryIcon from '@assets/svg/repository.svg'

import PosterSVG from './PosterSvg'
import {PosterTooltipData} from './Poster.utils'

interface PosterComponentProps {
  data: Poster

  width?: number
  height?: number
}

let tooltipTimeout: number

const PosterComponent: React.FC<PosterComponentProps> = ({
  data,
  width,
  height,
}) => {
  const {
    showTooltip,
    hideTooltip,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    tooltipOpen,
  } = useTooltip<PosterTooltipData>()
  const {containerRef, containerBounds} = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const margin = {top: 20, right: 10, bottom: 20, left: 10}
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  const outerRadius = Math.min(xMax, yMax) / 2

  const isMobile = outerRadius < 300

  const handleMouseMove = React.useCallback(
    (data: PosterTooltipData) => (event: React.MouseEvent) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)

      showTooltip({
        tooltipLeft: event.clientX - containerBounds.left,
        tooltipTop: event.clientY - containerBounds.top,
        tooltipData: data,
      })
    },
    [showTooltip],
  )

  const handleTouchMove = React.useCallback(
    (data: PosterTooltipData) => (event: React.TouchEvent) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)

      showTooltip({
        tooltipLeft: event.touches[0].clientX - containerBounds.left,
        tooltipTop: event.touches[0].clientY - containerBounds.top,
        tooltipData: data,
      })
    },
    [showTooltip],
  )

  const handleMouseLeave = React.useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip()
    }, 100)
  }, [])

  return (
    <section
      ref={containerRef}
      style={{marginBottom: margin.bottom}}
      className="relative flex flex-col items-center"
    >
      <PosterSVG
        className="z-10"
        data={data}
        width={width}
        height={height}
        selectedIndex={tooltipData?.index}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      />

      <AnimatePresence>
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <TooltipWithBounds
              className="absolute z-30 px-3 py-2 w-full max-w-48 text-white font-light bg-black border border-gray-500 rounded-md"
              left={tooltipLeft}
              top={tooltipTop - 20}
              unstyled
            >
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
              >
                <TooltipRow icon={<CommitsIcon />}>
                  {tooltipData.commits} commits
                </TooltipRow>
                <TooltipRow icon={<LinesIcon />}>
                  {tooltipData.lines} lines
                </TooltipRow>
                <TooltipRow icon={<RepositoryIcon />}>
                  {tooltipData.dominantRepository}
                </TooltipRow>
                <TooltipRow className="text-flamingo-500" icon={<HashIcon />}>
                  {tooltipData.dominantLanguage}
                </TooltipRow>
              </motion.div>
            </TooltipWithBounds>
          )}
      </AnimatePresence>

      <div
        style={{
          height: isMobile
            ? undefined
            : height / 2 + outerRadius + margin.top * 2,
          width: outerRadius * 1.5,
        }}
        className={clsx('flex items-center', {
          absolute: !isMobile,
          'relative mt-6': isMobile,
        })}
      >
        <div
          className={clsx('z-20 bottom-0 grid flex-1', {
            'absolute grid-cols-2 grid-rows-2': !isMobile,
          })}
        >
          <InfoBox
            label="Name"
            value={data.name}
            icon={<NameIcon className="w-full h-full" />}
          />
          <InfoBox
            label="Year"
            value={data.year.toString()}
            icon={<YearIcon className="w-full h-full" />}
          />
          <InfoBox
            label="Followers"
            value={data.followers.toString()}
            icon={<FollowersIcon className="w-full h-full" />}
          />
          <InfoBox
            label="Dominant Language"
            value={data.dominantLanguage}
            icon={<LanguageIcon className="w-full h-full" />}
          />
        </div>
      </div>
    </section>
  )
}

interface TooltipRowProps {
  icon: React.ReactNode
  className?: string
}

const TooltipRow: React.FC<TooltipRowProps> = ({children, icon, className}) => (
  <div className={clsx('flex items-center space-x-4', className)}>
    <div className="w-6">{icon}</div>
    <Typography variant="body1">{children}</Typography>
  </div>
)

interface InfoBoxProps {
  label: string
  value: string
  icon: React.ReactNode
}

const InfoBox: React.FC<InfoBoxProps> = ({label, value, icon}) => {
  return (
    <section className="flex items-center bg-black">
      <div
        aria-hidden
        style={{
          borderWidth: '0.5px',
        }}
        className={clsx(
          'flex items-center justify-center p-2 w-1/4 h-full border-gray-600',
          'xl:p-4',
        )}
      >
        {icon}
      </div>

      <header className="flex flex-col justify-center p-4 w-3/4 h-full border border-gray-600 space-y-3">
        <Typography
          variant="caption"
          as="h1"
          style={{
            letterSpacing: '0.2em',
          }}
          className="text-white text-opacity-40 uppercase"
        >
          {label}
        </Typography>
        <Typography variant="h5" className="font-light">
          {value}
        </Typography>
      </header>
    </section>
  )
}

interface WrappedStarProps extends PosterComponentProps {
  wrapperClassName: string

  screenWidth?: number
}

const WrappedStar: React.FC<WrappedStarProps> = props => {
  const {height: screenHeight} = useWindowSize()
  const height = screenHeight * 0.95

  return (
    <ParentSize className={props.wrapperClassName}>
      {({width}) => (
        <PosterComponent width={width} height={height} {...props} />
      )}
    </ParentSize>
  )
}

export default WrappedStar
