import * as React from 'react'
import {scaleBand, scaleLinear, scaleRadial, scaleSqrt} from '@visx/scale'
import {Group} from '@visx/group'
import {arc, Arc, Line} from '@visx/shape'
import {LinearGradient} from '@visx/gradient'
import * as d3 from 'd3-array'
import {Command, parseSVG} from 'svg-path-parser'

import {Poster} from '@nebula/types/poster'
import SittingPersonIcon from '@assets/svg/sitting-person.svg'

import {
  commitColors,
  genPoints,
  linesColors,
  numberOrZero,
  PosterTooltipData,
  toRadians,
} from './Poster.utils'

const AXIS_LINE_AMOUNT = 30

interface PosterSVGProps {
  data: Poster

  width: number
  height: number
  className?: string
  selectedIndex?: number

  sittingPersonWidth?: number
  sittingPersonHeight?: number

  onMouseMove?: (
    data: PosterTooltipData,
  ) => (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void
  onMouseLeave?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void

  onTouchStart?: (
    data: PosterTooltipData,
  ) => (event: React.TouchEvent<SVGPathElement>) => void
  onTouchEnd?: (event: React.TouchEvent<SVGPathElement>) => void
}

export const PosterSvg: React.FC<PosterSVGProps> = ({
  data,
  width,
  height,
  onMouseLeave,
  onMouseMove,
  onTouchEnd,
  onTouchStart,
  className,
  selectedIndex,
  sittingPersonWidth = 51,
  sittingPersonHeight = 82,
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

  const normalizeLines = React.useMemo(
    () =>
      scaleSqrt({
        domain: [0, d3.max(data.weeks, d => d.lines) as number],
        range: [0, 320],
      }),
    [data],
  )

  const normalizeCommits = React.useMemo(
    () =>
      scaleLinear({
        domain: [
          d3.min(data.weeks, d => d.commits) as number,
          d3.max(data.weeks, d => d.commits) as number,
        ],
        range: [
          normalizeLines.range()[0],
          Math.abs(normalizeLines.range()[1] - outerRadius),
        ],
      }),
    [data, outerRadius],
  )

  const barY = React.useMemo(
    () =>
      scaleRadial({
        domain: [
          normalizeLines.range()[0],
          normalizeCommits.range()[1] + normalizeLines.range()[1],
        ],
        range: [innerRadius, outerRadius],
      }),
    [data, outerRadius],
  )

  const axesOriginPoints = genPoints(AXIS_LINE_AMOUNT, innerRadius)
  const axesOuterPoints = genPoints(AXIS_LINE_AMOUNT, outerRadius)

  return (
    <svg
      className={className}
      width={width}
      height={outerRadius * 2 + margin.top}
    >
      <Group top={outerRadius + margin.top} left={width / 2}>
        {/* Axis lines */}
        <Group>
          {[...new Array(AXIS_LINE_AMOUNT)].map((_, i) => (
            <Line
              key={i}
              from={axesOriginPoints[i]}
              to={axesOuterPoints[i]}
              stroke={`url(#line-fill-${i})`}
              strokeOpacity={0.3}
            />
          ))}
        </Group>

        {/*Axis lines gradients*/}
        <defs>
          {[...new Array(AXIS_LINE_AMOUNT)].map((_, i) => (
            <LinearGradient
              key={i}
              id={`line-fill-${i}`}
              from={'#000'}
              to={'#fff'}
              gradientUnits="userSpaceOnUse"
              x1={axesOriginPoints[i].x}
              y1={axesOriginPoints[i].y}
              x2={axesOuterPoints[i].x}
              y2={axesOuterPoints[i].y}
            />
          ))}
        </defs>

        {/* Gradients */}
        <defs>
          {data.weeks.map((d, i) => {
            const week = i + 1
            const {lines, commits, dominantLanguage} = d

            // Get each bar vector
            const path = arc({
              innerRadius: barY(0),
              outerRadius: barY(
                normalizeCommits(commits) + normalizeLines(lines),
              ),
              startAngle: x(week),
              endAngle: (x(week) as number) + x.bandwidth(),
              padAngle: anglePadding,
              padRadius: innerRadius,
              cornerRadius: 9999,
            })(d)

            // parse vector points
            const parsedPath = parseSVG(path as string) as Array<
              Command & {
                x: number
                y: number
              }
            >

            const movePathIndex = parsedPath.findIndex(({code}) => code === 'M')
            const linePathIndex = parsedPath.findIndex(({code}) => code === 'L')

            const movePath = parsedPath[movePathIndex]
            const linePath = parsedPath[linePathIndex]

            const x1 =
              (numberOrZero(linePath?.x) +
                numberOrZero(parsedPath[linePathIndex + 1]?.x)) /
              1.92
            const y1 =
              (numberOrZero(linePath?.y) +
                numberOrZero(parsedPath[linePathIndex + 1]?.y)) /
              1.92

            const x2 =
              (numberOrZero(movePath?.x) +
                numberOrZero(parsedPath[movePathIndex + 1]?.x)) /
              1.92
            const y2 =
              (numberOrZero(movePath?.y) +
                numberOrZero(parsedPath[movePathIndex + 1]?.y)) /
              1.92

            const shadowOffset = 1.005

            const fromOffset = `${
              (barY(normalizeLines(lines)) /
                barY(normalizeCommits(commits) + normalizeLines(lines))) *
              95
            }%`

            return (
              <LinearGradient
                key={week}
                id={`starGradient-${week}`}
                from={'#000'}
                fromOffset={fromOffset}
                to={
                  selectedIndex === i || typeof selectedIndex === 'undefined'
                    ? commitColors[dominantLanguage]
                    : '#fff'
                }
                toOffset="100%"
                gradientUnits="userSpaceOnUse"
                x1={x1 ? x1 * shadowOffset : 0}
                y1={y1 ? y1 * shadowOffset : 0}
                x2={x2 ? x2 * shadowOffset : 0}
                y2={y2 ? y2 * shadowOffset : 0}
              />
            )
          })}
        </defs>

        <Group>
          {/* Commit bars */}
          <Group>
            {data.weeks.map(
              (
                {lines, commits, dominantLanguage, dominantRepository, week},
                i,
              ) => (
                <Arc
                  key={i + 1}
                  id={`commit-bar-${i + 1}`}
                  innerRadius={barY(0)}
                  outerRadius={barY(
                    normalizeCommits(commits) + normalizeLines(lines),
                  )}
                  startAngle={x(i + 1)}
                  endAngle={(x(i + 1) as number) + x.bandwidth()}
                  padAngle={anglePadding}
                  padRadius={innerRadius}
                  cornerRadius={9999}
                  fill={`url(#starGradient-${i + 1})`}
                  onMouseMove={
                    onMouseMove &&
                    onMouseMove({
                      index: i,
                      week,
                      lines,
                      commits,
                      dominantLanguage,
                      dominantRepository,
                    })
                  }
                  onMouseLeave={onMouseLeave}
                  onTouchStart={
                    onTouchStart &&
                    onTouchStart({
                      index: i,
                      week,
                      lines,
                      commits,
                      dominantLanguage,
                      dominantRepository,
                    })
                  }
                  onTouchEnd={onTouchEnd}
                />
              ),
            )}
          </Group>

          {/* Line bars */}
          <Group>
            {data.weeks.map(
              (
                {lines, commits, dominantLanguage, dominantRepository, week},
                i,
              ) => (
                <Arc
                  key={i + 1}
                  data={data}
                  innerRadius={barY(0)}
                  outerRadius={barY(normalizeLines(lines))}
                  startAngle={x(i + 1)}
                  endAngle={(x(i + 1) as number) + x.bandwidth()}
                  padAngle={anglePadding}
                  padRadius={innerRadius}
                  cornerRadius={9999}
                  fill={
                    selectedIndex === i || typeof selectedIndex === 'undefined'
                      ? linesColors[dominantLanguage]
                      : '#fff'
                  }
                  onMouseMove={
                    onMouseMove &&
                    onMouseMove({
                      index: i,
                      week,
                      lines,
                      commits,
                      dominantLanguage,
                      dominantRepository,
                    })
                  }
                  onMouseLeave={onMouseLeave}
                  onTouchStart={
                    onTouchStart &&
                    onTouchStart({
                      index: i,
                      week,
                      lines,
                      commits,
                      dominantLanguage,
                      dominantRepository,
                    })
                  }
                  onTouchEnd={onTouchEnd}
                />
              ),
            )}
          </Group>
        </Group>
      </Group>

      {/*Sitting person in center*/}
      <Group
        left={width / 2 - sittingPersonWidth * 0.5}
        top={outerRadius + margin.top - sittingPersonHeight * 0.7317}
      >
        <SittingPersonIcon
          width={sittingPersonWidth}
          height={sittingPersonHeight}
        />
      </Group>
    </svg>
  )
}

export default PosterSvg
