import React from 'react'
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory'

function getGraphData (projects, sortOrder) {
  const count = 10
  const data = projects
    .filter(project => project.stats[sortOrder] > 0)
    .slice(0, count)
    .map((project, i) => {
      return {
        label: project.name,
        color: project.color,
        x: count - i,
        y: project.stats[sortOrder]
      }
    })
  return data
}

function formatDelta (delta) {
  return `+${delta}☆`
}

const Label = () => (
  <a href={`/projects/`}>link</a>
)

const Graph = ({ projects, sortOrder }) => {
  return (
    <div>
      <VictoryChart
        domainPadding={20}
        padding={styles.chart.padding}
      >
        <VictoryAxis
          style={styles.axis}
          labelXX={`Stars added by day`}
          axisLabelComponent={<VictoryLabel dy={1} />}
          tickFormat={formatDelta}
        />
        <VictoryAxis
          dependentAxis
          tickCount={5}
          tickFormat={x => ''}
        />
        <VictoryBar
          data={getGraphData(projects, sortOrder)}
          horizontal
          label={project => project.label}
          labelComponentX={<Label />}
          style={{
            data: {
              fill: project => project.color
            },
            labels: {
              fill: project => project.color
            }
          }}
        />
      </VictoryChart>
    </div>
  )
}

const styles = {
  chart: {
    padding: {
      top: 16,
      left: 16,
      bottom: 48,
      right: 100
    }
  },
  axis: {
    axis: { stroke: 'black', strokeWidth: 1 },
    ticks: {
      size: (tick) => 10,
      stroke: 'black',
      strokeWidth: 1
    },
    tickLabels: {
      fill: 'black',
      fontFamily: 'inherit'
    }
  }
}

export default Graph
