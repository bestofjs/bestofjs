import React from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { AxisLeft } from '@visx/axis'
import { scaleLinear, scaleBand } from '@visx/scale'
import { Text } from '@visx/text'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import numeral from 'numeral'

const margin = { top: 20, bottom: 25, left: 80, right: 50 }

const barHeight = 20

const x = d => d.value
const y = d => d.project

type Props = {
  data: { project: string; value: number }[]
  width: number
  width: number
}
function BasicBarGraph({ data, width, height }: Props) {
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

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
    paddingInner: 0.1
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

          return (
            <Group key={`bar-${i}`}>
              <Bar
                y={yPoint(d)}
                x={0}
                rx={4}
                height={barHeight}
                fill="var(--bestofjsOrange)"
                width={barWidth}
              />
              <Text
                x={barWidth + 20}
                y={yPoint(d)}
                dy={15}
                width={200}
                textAnchor="middle"
              >
                {formatDelta(d.value, { decimals: 1, showPlusSymbol: true })}
              </Text>
            </Group>
          )
        })}
        <AxisLeft
          scale={yScale}
          hideTicks
          tickLabelProps={props => ({
            ...props,
            fill: 'var(--textPrimaryColor)',
            // textAnchor: 'left',
            fontSize: 12,
            dx: -70
          })}
        />
      </Group>
    </svg>
  )
}

export const HorizontalBarGraph = ({ data }) => {
  const height = (data.length - 1) * 50
  return (
    <ParentSize>
      {({ width }) => (
        <BasicBarGraph width={width} height={height} data={data} />
      )}
    </ParentSize>
  )
}

function formatDelta(value, { decimals = 0, showPlusSymbol = false }) {
  const numberFormat =
    decimals === 0 || value < 1000 ? '0' : `0.${'0'.repeat(decimals)}`
  const formattedNumber = numeral(value).format(`${numberFormat}a`)
  return showPlusSymbol && value > 0 ? `+${formattedNumber}` : formattedNumber
}
