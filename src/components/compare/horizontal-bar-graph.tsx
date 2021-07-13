import React from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { AxisLeft } from '@visx/axis'
import { scaleLinear, scaleBand } from '@visx/scale'
import { Text } from '@visx/text'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

import { formatNumber } from './utils'

const margin = { top: 0, bottom: 0, left: 80, right: 50 }

const x = d => d.value
const y = d => d.project

type Props = {
  data: { project: string; value: number }[]
  width: number
  width: number
  formatValue?: (value: number) => string
}
function BasicBarGraph({
  data,
  width,
  height,
  formatValue = defaultFormatter
}: Props) {
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  console.log({ yMax })

  const xScale = scaleLinear({
    range: [0, xMax],
    round: true,
    domain: [0, Math.max(...data.map(x))]
  })
  const yScale = scaleBand({
    range: [0, yMax],
    round: true,
    domain: data.map(y),
    paddingOuter: 0,
    paddingInner: 0.4
  })

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale, accessor) => data => scale(accessor(data))
  const xPoint = compose(xScale, x)
  const yPoint = compose(yScale, y)

  // const colorScale = scaleOrdinal<string, string>({
  //   domain: keys,
  //   range: [blue, green, purple],
  // });

  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        {data.map((d, i) => {
          const barWidth = xPoint(d)
          const barHeight = yScale.bandwidth()
          const y = yPoint(d)

          console.log({ x: 0, y, barWidth })

          return (
            <Group key={`bar-${i}`}>
              <Bar
                y={y}
                x={0}
                rx={4}
                height={barHeight}
                width={barWidth}
                fill="var(--bestofjsOrange)"
              />
              <Text
                x={barWidth + 20}
                y={y}
                dy={15}
                width={200}
                textAnchor="middle"
              >
                {formatValue(d.value)}
              </Text>
            </Group>
          )
        })}
        {true && (
          <AxisLeft
            scale={yScale}
            hideTicks
            hideAxisLine
            tickLabelProps={props => ({
              ...props,
              fill: 'var(--textPrimaryColor)',
              // textAnchor: 'left',
              fontSize: 12,
              dx: -70,
              dy: 5
            })}
          />
        )}
      </Group>
    </svg>
  )
}

export const HorizontalBarGraph = ({ data, ...props }) => {
  const spacing = 50
  const height = (data.length - 1) * spacing

  return (
    <ParentSize>
      {({ width }) => (
        <BasicBarGraph width={width} height={height} data={data} {...props} />
      )}
    </ParentSize>
  )
}

const defaultFormatter = value => formatNumber(value, { decimals: 1 })
