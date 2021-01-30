import * as React from 'react'
import {scaleBand, scaleRadial} from '@visx/scale'
import {Group} from '@visx/group'
import {arc, Arc, Line} from '@visx/shape'
import {ParentSize} from '@visx/responsive'
import {LinearGradient} from '@visx/gradient'
import * as d3 from 'd3-array'
import clsx from 'clsx'
import {parseSVG} from 'svg-path-parser'
import {useWindowSize} from 'react-use'

import {Poster} from '@nebula/types/poster'
import NameIcon from '@assets/svg/name.svg'
import YearIcon from '@assets/svg/year.svg'
import FollowersIcon from '@assets/svg/followers.svg'
import LanguageIcon from '@assets/svg/language.svg'
import SittingPersonIcon from '@assets/svg/sitting-person.svg'
import {Typography} from '@components/ui'

import {commitColors, genPoints, linesColors, toRadians} from './Star.utils'

const AXIS_LINE_AMOUNT = 30

interface StarProps {
  data: Poster

  width?: number
  height?: number
}

const Star: React.FC<StarProps> = ({data, width, height}) => {
  const margin = {top: 20, right: 10, bottom: 20, left: 10}
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  const innerRadius = 20
  const outerRadius = Math.min(xMax, yMax) / 2
  const anglePadding = 0.07

  const x = React.useMemo(
    () =>
      scaleBand({
        domain: data.weeks.map((_, i) => i + 1),
        range: [toRadians(-125), toRadians(125)],
        align: 0,
      }),
    [],
  )

  const barY = React.useMemo(
    () =>
      scaleRadial({
        domain: [0, d3.max(data.weeks, d => d.total)], // TODO: Improve scale
        range: [innerRadius, outerRadius],
      }),
    [data, outerRadius],
  )

  const axesOriginPoints = genPoints(AXIS_LINE_AMOUNT, innerRadius)
  const axesOuterPoints = genPoints(AXIS_LINE_AMOUNT, outerRadius)
  const isMobile = outerRadius < 300

  console.log(data)

  return (
    <section
      style={{marginBottom: margin.bottom}}
      className="relative flex flex-col items-center"
    >
      <svg width={width} height={outerRadius * 2 + margin.top}>
        <Group top={outerRadius + margin.top} left={width / 2}>
          {/* Axis lines */}
          <Group>
            {[...new Array(AXIS_LINE_AMOUNT)].map((_, i) => (
              <Line
                key={i}
                from={axesOriginPoints[i]}
                to={axesOuterPoints[i]}
                stroke="#fff"
                strokeOpacity={0.3}
              />
            ))}
          </Group>

          {/* Gradients */}
          <defs>
            {data.weeks.map((d, i) => {
              const week = i + 1
              const {lines, total, dominantLanguage} = d

              // Get each bar vector
              const path = arc({
                innerRadius: barY(0),
                outerRadius: barY(total),
                startAngle: x(week),
                endAngle: x(week) + x.bandwidth(),
                padAngle: anglePadding,
                padRadius: innerRadius,
                cornerRadius: 9999,
              })(d)

              // extract vector points
              const parsedPath = parseSVG(path).filter(({code}) =>
                ['M', 'L'].includes(code),
              ) as Array<{x: number; y: number}>

              return (
                <LinearGradient
                  key={week}
                  id={`starGradient-${week}`}
                  from={'#000'}
                  fromOffset={`90%`} // TODO: improve the from offset
                  to={commitColors[dominantLanguage]}
                  toOffset="100%"
                  gradientUnits="userSpaceOnUse"
                  x1={parsedPath[1].x}
                  y1={parsedPath[1].y}
                  x2={parsedPath[0].x}
                  y2={parsedPath[0].y}
                />
              )
            })}
          </defs>

          <Group>
            {/* Commit bars */}
            <Group>
              {data.weeks.map(({total}, i) => (
                <Arc
                  key={i + 1}
                  id={`commit-bar-${i + 1}`}
                  innerRadius={barY(0)}
                  outerRadius={barY(total)}
                  startAngle={x(i + 1)}
                  endAngle={x(i + 1) + x.bandwidth()}
                  padAngle={anglePadding}
                  padRadius={innerRadius}
                  cornerRadius={9999}
                  fill={`url(#starGradient-${i + 1})`}
                />
              ))}
            </Group>

            {/* Line bars */}
            <Group>
              {data.weeks.map(({lines, dominantLanguage}, i) => (
                <Arc
                  key={i + 1}
                  data={data}
                  innerRadius={barY(0)}
                  outerRadius={barY(lines)}
                  startAngle={x(i + 1)}
                  endAngle={x(i + 1) + x.bandwidth()}
                  padAngle={anglePadding}
                  padRadius={innerRadius}
                  cornerRadius={9999}
                  fill={linesColors[dominantLanguage]}
                />
              ))}
            </Group>
          </Group>
        </Group>

        {/*Sitting person in center*/}
        <Group top={outerRadius + margin.top - 60} left={width / 2 - 25.5}>
          <SittingPersonIcon />
        </Group>
      </svg>

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

interface WrappedStarProps extends StarProps {
  wrapperClassName: string

  screenWidth?: number
}

const WrappedStar: React.FC<WrappedStarProps> = props => {
  const {height: screenHeight} = useWindowSize()
  const height = screenHeight * 0.95

  return (
    <ParentSize className={props.wrapperClassName}>
      {({width}) => <Star width={width} height={height} {...props} />}
    </ParentSize>
  )
}

export default WrappedStar
