import React from 'react'
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory'
import numeral from 'numeral'
import randomColor from 'randomcolor'

function createDate (delta) {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  d.setMonth(now.getMonth() - delta)
  return d
}

const dates = [12, 9, 6, 3, 0].map(createDate)

function getGraphData (project) {
  const data = project.stats.oneYear
    .concat([project.stars])
    .map((item, i) => ({
      name: project.name,
      monthsAgo: new Date(dates[i].getFullYear(), dates[i].getMonth(), dates[i].getDate()),
      // stars: item - project.stats.oneYear[0]
      stars: item
    }))
  return data
}

function getTickValues () {
  return [12, 9, 6, 3, 0].map(createDate)
}

function formatDate (d) {
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
  const label = `'${d.getFullYear().toString().substr(2)} ${months[d.getMonth()]}`
  return label
}

function formatStars (value) {
  const digits = (value > 1000 && value < 10000 && value % 1000 !== 0) ? '0.0' : '0'
  return numeral(value).format(`${digits} a`)
}

const Graph = ({ projects }) => {
  if (!projects || projects.length === 0) return <div>No data</div>
  return (
    <div className="graph-container">
      <VictoryChart
        domainPadding={20}
        themeXX={VictoryTheme.material}
        tickFormat={formatDate}
        padding={styles.chart.padding}
      >
        <VictoryAxis
          scale="time"
          style={styles.axis}
          tickValues={getTickValues()}
          tickFormat={formatDate}
        />
        <VictoryAxis
          dependentAxis
          tickCount={5}
          tickFormat={formatStars}
          style={styles.axis}
        />
        {projects.map(project => {
          const color = randomColor({
            luminosity: 'dark'
          })
          return (
          // <ProjectLine key={project.id} project={project} />
            <VictoryLine
              key={project.id}
              data={getGraphData(project)}
              x="monthsAgo"
              y="stars"
              label={project.name}
              style={{
                data: {
                  stroke: color
                },
                labels: {
                  fill: color
                }
              }}
            />
          )
        })}
      </VictoryChart>
    </div>
  )
}
// const ProjectLine = ({ project }) => {
//   const data = getGraphData(project)
//   return (
//     <VictoryLine
//       data={data}
//       x="monthsAgo"
//       y="stars"
//     />
//   )
// }

const styles = {
  chart: {
    padding: {
      top: 20,
      left: 60,
      bottom: 50,
      right: 60
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
