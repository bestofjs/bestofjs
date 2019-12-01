import React from 'react'
import numeral from 'numeral'

import './monthly-chart.css'

const monthNames = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')

const MonthlyChart = ({ values }) => {
  if (values.length === 0)
    return (
      <div style={{ fontStyle: 'italic', marginBottom: '.5rem' }}>
        No data available
      </div>
    )

  const last12Months = getLas12Months()
  const findDeltaByMonth = ({ year, month }) => {
    const foundValue = values.find(
      value => value.year === year && value.month === month
    )
    return foundValue ? foundValue.delta : undefined
  }

  const dataset = last12Months.map(value => ({
    ...value,
    delta: findDeltaByMonth(value)
  }))

  const months = dataset.map(({ month }) => monthNames[month - 1])
  const monthlyDeltas = dataset.map(({ delta }) => delta)
  const monthlyDeltaMax = Math.max(
    ...monthlyDeltas.filter(delta => delta !== undefined)
  )

  return (
    <div>
      <div className="project-chart">
        <div className="project-chart-columns">
          {monthlyDeltas.map((delta, i) => (
            <div key={i} className="project-chart-column">
              <div
                className="project-chart-bar"
                style={{
                  height: `${Math.round((delta * 100) / monthlyDeltaMax)}%`
                }}
              >
                <div className="project-chart-stars">
                  {delta === undefined ? (
                    <span className="text-secondary">N/A</span>
                  ) : (
                    <span>{formatDelta(delta, 1)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="project-chart-months">
          {months.map((monthName, i) => (
            <div key={i} className="project-chart-month">
              {monthName}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MonthlyChart

function getLas12Months() {
  const date = new Date()
  const months = []
  for (let i = 0; i < 12; i++) {
    date.setMonth(date.getMonth() - 1)
    months.push({ year: date.getFullYear(), month: date.getMonth() + 1 })
  }
  months.reverse()
  return months
}

function formatDelta(delta, decimals = 0) {
  const numberFormat =
    decimals === 0 || delta < 1000 ? '0' : `0.${'0'.repeat(decimals)}`
  const formattedNumber = numeral(delta).format(`${numberFormat}a`)
  return delta > 0 ? `+${formattedNumber}` : formattedNumber
}
