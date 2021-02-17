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
import YearTooltipIcon from '@assets/svg/year-tooltip.svg'
import FollowersIcon from '@assets/svg/followers.svg'
import LanguageIcon from '@assets/svg/language.svg'
import LinesIcon from '@assets/svg/lines.svg'
import CommitsIcon from '@assets/svg/commits.svg'
import HashIcon from '@assets/svg/hash.svg'
import RepositoryIcon from '@assets/svg/repository.svg'
import TotalLinesOfCodeIcon from '@assets/svg/total-lines.svg'

import PosterSVG from './PosterSvg'
import {PosterTooltipData, separateNumber} from './Poster.utils'

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

  const margin = {top: 20, right: 10, bottom: 40, left: 10}
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
    [showTooltip, containerBounds],
  )

  const handleTouchStart = React.useCallback(
    (data: PosterTooltipData) => (event: React.TouchEvent) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)

      showTooltip({
        tooltipLeft: event.touches[0].clientX - containerBounds.left,
        tooltipTop: event.touches[0].clientY - containerBounds.top,
        tooltipData: data,
      })
    },
    [showTooltip, containerBounds],
  )

  const handleTouchEnd = React.useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip()
    }, 300)
  }, [])

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <AnimatePresence>
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <motion.div
              className="z-30"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
            >
              <TooltipWithBounds
                className={clsx(
                  'absolute px-3 py-2 w-full max-w-52 text-white font-light bg-black border border-gray-500 rounded-md space-y-1',
                  'md:min-w-52 md:w-auto md:max-w-none',
                )}
                left={tooltipLeft + 20}
                top={tooltipTop - 20}
                unstyled
              >
                <TooltipRow icon={<YearTooltipIcon />}>
                  Week {tooltipData.week}
                </TooltipRow>
                <TooltipRow icon={<CommitsIcon />}>
                  {separateNumber(tooltipData.commits, ',')} commits
                </TooltipRow>
                <TooltipRow icon={<LinesIcon />}>
                  {separateNumber(tooltipData.lines, ',')} lines
                </TooltipRow>
                <TooltipRow icon={<RepositoryIcon />}>
                  {tooltipData.dominantRepository}
                </TooltipRow>
                <TooltipRow className="text-flamingo-500" icon={<HashIcon />}>
                  {tooltipData.dominantLanguage}
                </TooltipRow>
              </TooltipWithBounds>
            </motion.div>
          )}
      </AnimatePresence>

      <div
        style={{
          width: outerRadius * 2,
        }}
        className={clsx('relative flex items-center', {
          '-mt-36': !isMobile,
          'mt-6': isMobile,
        })}
      >
        <div
          className={clsx(
            'z-20 bottom-0 flex flex-row flex-wrap w-full',
            'md:flex-nowrap',
            'lg:flex-col',
          )}
        >
          <div
            className={clsx('flex flex-col flex-wrap w-full', 'lg:flex-row')}
          >
            <InfoBox
              label="Name"
              value={data.name}
              icon={<NameIcon className="w-8" />}
            />
            <InfoBox
              label="Followers"
              value={data.followers.toString()}
              icon={<FollowersIcon className="w-8" />}
            />
            <InfoBox
              label="Year"
              value={data.year.toString()}
              icon={<YearIcon className="w-8" />}
            />
          </div>
          <div
            className={clsx('flex flex-col flex-wrap w-full', 'lg:flex-row')}
          >
            <InfoBox
              label="#1 Language"
              value={data.dominantLanguage}
              icon={<LanguageIcon className="w-8" />}
            />
            <InfoBox
              label="#1 Repo"
              value={data.dominantRepository}
              icon={
                <RepositoryIcon style={{color: '#57585A'}} className="w-8" />
              }
            />
            <InfoBox
              label="Lines of Code"
              value={separateNumber(data.totalLinesOfCode)}
              icon={<TotalLinesOfCodeIcon className="w-8" />}
            />
          </div>
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
    <section className="flex items-center flex-1 bg-black">
      <div
        aria-hidden
        style={{
          borderWidth: '0.5px',
        }}
        className={clsx(
          'flex items-center justify-center px-6 py-2 h-full border-gray-600',
        )}
      >
        {icon}
      </div>

      <header className="flex flex-col justify-center flex-1 h-full p-4 space-y-3 border border-gray-600">
        <Typography
          variant="caption"
          as="h1"
          style={{
            letterSpacing: '0.2em',
          }}
          className="text-white uppercase text-opacity-40"
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
