import React from 'react'
import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'
import { AxisBottom } from '@visx/axis'
import { scaleLinear, scaleBand } from '@visx/scale'
import { Text } from '@visx/text'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import { MarkerCircle } from '@visx/marker'
import numeral from 'numeral'

const margin = { top: 20, bottom: 25, left: 0, right: 0 }

const x = d => new Date(d.year, d.month - 1, 1)
const y = d => d.value

type Props = {
  data: { month: number; tear: number; value: number }[]
  width: number
  width: number
}
export function BasicBarGraph({ data, width, height }: Props) {
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    paddingOuter: 0,
    paddingInner: 0.1
  })
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y))]
  })

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale, accessor) => data => scale(accessor(data))
  const xPoint = compose(xScale, x)
  const yPoint = compose(yScale, y)

  const barWidth = xScale.bandwidth()

  return (
    <svg width={width} height={height}>
      <MarkerCircle id="marker-circle" fill="#ec8118" size={2} refX={2} />
      <LinePath
        data={data}
        x={d => xScale(x(d)) + barWidth / 2}
        y={d => yScale(y(d))}
        stroke="#ec8118"
        strokeWidth={3}
        shapeRendering="geometricPrecision"
        markerMid="url(#marker-circle)"
      />
      {data.map((d, i) => {
        const barHeight = yMax - yPoint(d)
        return (
          <Group key={`bar-${i}`} top={margin.top}>
            <Bar
              x={xPoint(d)}
              y={yMax - barHeight}
              height={barHeight}
              fill="#fbe6db"
              width={barWidth}
            />
            <Text
              x={xPoint(d) + barWidth / 2}
              y={height - barHeight}
              dy={-50}
              width={200}
              textAnchor="middle"
            >
              {formatDelta(d.value, { decimals: 1, showPlusSymbol: true })}
            </Text>
          </Group>
        )
      })}
      <AxisBottom
        top={yMax + margin.top}
        tickFormat={formatDate}
        scale={xScale}
        hideAxisLine
        hideTicks
        tickLabelProps={() => ({
          fill: 'black',
          fontSize: 12,
          textAnchor: 'middle'
        })}
      />
    </svg>
  )
}

export const BarGraph = ({ data }) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <BasicBarGraph width={width} height={250} data={data} />
      )}
    </ParentSize>
  )
}

function formatDate(d) {
  return (
    `'` +
    d
      .getFullYear()
      .toString()
      .slice(2, 4) +
    ' ' +
    monthNames[d.getMonth()]
  )
}

function formatDelta(value, { decimals = 0, showPlusSymbol = false }) {
  const numberFormat =
    decimals === 0 || value < 1000 ? '0' : `0.${'0'.repeat(decimals)}`
  const formattedNumber = numeral(value).format(`${numberFormat}a`)
  return showPlusSymbol && value > 0 ? `+${formattedNumber}` : formattedNumber
}

const monthNames = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
