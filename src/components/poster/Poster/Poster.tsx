import * as React from 'react'
import {ParentSize} from '@visx/responsive'
import clsx from 'clsx'
import {useWindowSize} from 'react-use'

import {Poster} from '@nebula/types/poster'
import NameIcon from '@assets/svg/name.svg'
import YearIcon from '@assets/svg/year.svg'
import FollowersIcon from '@assets/svg/followers.svg'
import LanguageIcon from '@assets/svg/language.svg'
import {Typography} from '@components/ui'

import PosterSvg from './PosterSVG'

interface PosterProps {
  data: Poster

  width?: number
  height?: number
}

export const PosterComponent: React.FC<PosterProps> = ({
  data,
  width,
  height,
}) => {
  const margin = {top: 20, right: 10, bottom: 20, left: 10}
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  const outerRadius = Math.min(xMax, yMax) / 2

  const isMobile = outerRadius < 300

  return (
    <section
      style={{marginBottom: margin.bottom}}
      className="relative flex flex-col items-center"
    >
      <PosterSvg data={data} width={width} height={height} />

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
          className={clsx('bottom-0 grid flex-1', {
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

interface WrappedPosterProps extends PosterProps {
  wrapperClassName: string

  screenWidth?: number
}

const WrappedPoster: React.FC<WrappedPosterProps> = props => {
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

export default WrappedPoster
