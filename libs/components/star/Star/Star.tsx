import * as React from 'react'
import {scaleBand, scaleRadial} from '@visx/scale'
import {Group} from '@visx/group'
import {Arc, Line} from '@visx/shape'
import {withParentSize} from '@visx/responsive'
import {LinearGradient} from '@visx/gradient'
import * as d3 from 'd3-array'
import clsx from 'clsx'

import {Star as StarSchema, StarWeek} from '@nebula/types/death-star'
import NameIcon from '@assets/svg/name.svg'
import YearIcon from '@assets/svg/year.svg'
import FollowersIcon from '@assets/svg/followers.svg'
import LanguageIcon from '@assets/svg/language.svg'
import {Typography} from '@components/ui'

import {commitColors, linesColors, toDegrees, toRadians} from './Star.utils'

const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length

  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }))
}

const AXIS_LINE_AMOUNT = 30

interface Props {
  data: StarSchema

  parentWidth?: number
  parentHeight?: number
  initialWidth?: number
  initialHeight?: number
}

const Star: React.FC<Props> = ({
  data,
  parentWidth: width,
  parentHeight: height,
}) => {
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
        domain: [0, d3.max(data.weeks, d => d.total)],
        range: [innerRadius, outerRadius],
      }),
    [data, outerRadius],
  )

  const getVectors = (d: StarWeek) => {
    const startingRad = x(1) + toRadians(360)
    const bandwidth = toRadians(5.79)
    const weekRad = startingRad - (d.week - 1) * bandwidth
    const vectorX = Math.cos(weekRad)
    const vectorY = Math.sin(weekRad)

    const degrees = Math.floor(toDegrees(weekRad))

    return {
      vector: {
        x: vectorX,
        y: vectorY,
      },
      isLeftSide: degrees > 150,
      isRightSide: degrees <= 49,
      isCenter: degrees <= 150 && degrees > 49,
      weekRad,
    }
  }

  const getX1 = (d: StarWeek) => {
    const {vector, isLeftSide, isRightSide, isCenter} = getVectors(d)

    if (isLeftSide) {
      return `${Math.abs(vector.x) * 100}%`
    }

    if (isCenter) {
      return '0%'
    }

    if (isRightSide) {
      return '0%'
    }
  }

  const getY1 = (d: StarWeek) => {
    const {vector, isLeftSide, isRightSide, isCenter} = getVectors(d)

    if (isLeftSide) {
      return `${Math.abs(vector.y) * 100}%`
    }

    if (isCenter) {
      return '100%'
    }

    if (isRightSide) {
      return '0%'
    }
  }

  const getX2 = (d: StarWeek) => {
    const {isLeftSide, isCenter} = getVectors(d)

    if (isLeftSide) {
      return '0%'
    }

    if (isCenter) {
      return '0%'
    }
  }

  const getY2 = (d: StarWeek) => {
    const {vector, isLeftSide, isCenter} = getVectors(d)

    if (isLeftSide) {
      return `${Math.abs(vector.y) * 100}%`
    }

    if (isCenter) {
      return '0%'
    }
  }

  const axesOriginPoints = genPoints(AXIS_LINE_AMOUNT, innerRadius)
  const axesOuterPoints = genPoints(AXIS_LINE_AMOUNT, outerRadius)
  const starHeight = height / 2 + outerRadius + margin.top
  const infoBoxHeight = 192

  return (
    <section className="relative flex flex-col items-center">
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
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
            {data.weeks.map(d => {
              const {week, lines, total, dominantLanguage} = d

              return (
                <LinearGradient
                  key={week}
                  id={`starGradient-${week}`}
                  from={'#000'}
                  fromOffset={`${(lines / total) * 95}%`}
                  to={commitColors[dominantLanguage]}
                  toOffset="100%"
                  x1={getX1(d)}
                  y1={getY1(d)}
                  x2={getX2(d)}
                  y2={getY2(d)}
                />
              )
            })}
          </defs>

          <Group>
            {/* Commit bars */}
            <Group>
              {data.weeks.map(({week, total}) => (
                <Arc
                  key={week}
                  data={data}
                  innerRadius={barY(0)}
                  outerRadius={barY(total)}
                  startAngle={x(week)}
                  endAngle={x(week) + x.bandwidth()}
                  padAngle={anglePadding}
                  padRadius={innerRadius}
                  cornerRadius={9999}
                  fill={`url(#starGradient-${week})`}
                />
              ))}
            </Group>

            {/* Line bars */}
            <Group>
              {data.weeks.map(({week, lines, dominantLanguage}) => (
                <Arc
                  key={week}
                  data={data}
                  innerRadius={barY(0)}
                  outerRadius={barY(lines)}
                  startAngle={x(week)}
                  endAngle={x(week) + x.bandwidth()}
                  padAngle={anglePadding}
                  padRadius={innerRadius}
                  cornerRadius={9999}
                  fill={linesColors[dominantLanguage]}
                />
              ))}
            </Group>
          </Group>
        </Group>
      </svg>

      <div
        style={{
          height:
            outerRadius < 300
              ? infoBoxHeight + starHeight - margin.top
              : starHeight,
          width: outerRadius * 2,
        }}
        className="absolute flex items-center"
      >
        <div
          className={clsx(
            'absolute bottom-0 grid flex-1',
            'grid-cols-2 grid-rows-2',
          )}
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
          'flex items-center justify-center p-2 w-1/4 h-24 border-gray-600',
          'sm:p-6',
        )}
      >
        {icon}
      </div>

      <header className="flex flex-col justify-center p-4 w-3/4 h-24 border border-gray-600 space-y-3">
        <Typography
          variant="caption"
          as="h1"
          style={{
            letterSpacing: '0.2em',
          }}
          className="text-white text-opacity-30 uppercase"
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

export default withParentSize(Star)
