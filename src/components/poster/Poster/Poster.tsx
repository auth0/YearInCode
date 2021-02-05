import * as React from 'react'
import {ParentSize} from '@visx/responsive'
import clsx from 'clsx'
import {useWindowSize} from 'react-use'
import {withTooltip, Tooltip} from '@visx/tooltip'
import {WithTooltipProvidedProps} from '@visx/tooltip/lib/enhancers/withTooltip'

import {Poster} from '@nebula/types/poster'
import NameIcon from '@assets/svg/name.svg'
import YearIcon from '@assets/svg/year.svg'
import FollowersIcon from '@assets/svg/followers.svg'
import LanguageIcon from '@assets/svg/language.svg'
import {Typography} from '@components/ui'

import PosterSVG from './PosterSvg'

interface PosterComponentProps {
  data: Poster

  width?: number
  height?: number
}

const PosterComponent: React.FC<PosterComponentProps> = ({
  data,
  width,
  height,
}) => {
  const margin = {top: 20, right: 10, bottom: 20, left: 10}
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  const outerRadius = Math.min(xMax, yMax) / 2

  const isMobile = outerRadius < 300

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      console.log(event)
      // if (tooltipTimeout) clearTimeout(tooltipTimeout);
      // if (!svgRef.current) return;

      // // find the nearest polygon to the current mouse position
      // const point = localPoint(svgRef.current, event);
      // if (!point) return;
      // const neighborRadius = 100;
      // const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
      // if (closest) {
      //   showTooltip({
      //     tooltipLeft: xScale(x(closest.data)),
      //     tooltipTop: yScale(y(closest.data)),
      //     tooltipData: closest.data,
      //   });
      // }
    },
    [],
  )

  const handleMouseLeave = React.useCallback(() => {
    // tooltipTimeout = window.setTimeout(() => {
    //   hideTooltip();
    // }, 300);
  }, [])

  return (
    <section
      style={{marginBottom: margin.bottom}}
      className="relative flex flex-col items-center"
    >
      <PosterSVG
        className="z-10"
        data={data}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseLeave}
      />

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
