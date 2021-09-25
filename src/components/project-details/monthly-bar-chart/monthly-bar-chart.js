import React from 'react'
import numeral from 'numeral'

import './monthly-chart.css'

const monthNames = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')

export const MonthlyChart = ({ values, showPlusSymbol }) => {
  if (values.length === 0)
    return (
      <div style={{ fontStyle: 'italic', marginBottom: '.5rem' }}>
        No data available
      </div>
    )

  const last12Months = getLas12Months()
  const findDeltaByMonth = ({ year, month }) => {
    const foundValue = values.find(
      (value) => value.year === year && value.month === month
    )
    return foundValue ? foundValue.value : undefined
  }

  const dataset = last12Months.map((item) => ({
    ...item,
    value: findDeltaByMonth(item)
  }))

  const months = dataset.map(({ month }) => monthNames[month - 1])
  const monthlyDeltas = dataset.map(({ value }) => value)
  const monthlyDeltaMax = Math.max(
    ...monthlyDeltas.filter((value) => value !== undefined)
  )

  return (
    <div>
      <div className="project-chart">
        <div className="project-chart-columns">
          {monthlyDeltas.map((value, i) => (
            <div key={i} className="project-chart-column">
              <div
                className="project-chart-bar"
                style={{
                  height: `${Math.round((value * 100) / monthlyDeltaMax)}%`
                }}
              >
                <div className="project-chart-stars">
                  {value === undefined ? (
                    <span className="text-secondary">N/A</span>
                  ) : (
                    <span>
                      {formatDelta(value, { decimals: 1, showPlusSymbol })}
                    </span>
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

function getLas12Months() {
  const date = getFirstDayOfPreviousMonth()
  const months = []
  for (let i = 0; i < 12; i++) {
    months.push({ year: date.getFullYear(), month: date.getMonth() + 1 })
    date.setMonth(date.getMonth() - 1)
  }
  months.reverse()
  return months
}

function getFirstDayOfPreviousMonth() {
  const today = new Date()
  // first we need to jump to the last day of the previous month (Dec 31th if we are in January)
  const date = new Date(today.getFullYear(), today.getMonth(), 0, 0, 0, 0)
  date.setDate(1)
  return date
}

function formatDelta(value, { decimals = 0, showPlusSymbol = false }) {
  const numberFormat =
    decimals === 0 || value < 1000 ? '0' : `0.${'0'.repeat(decimals)}`
  const formattedNumber = numeral(value).format(`${numberFormat}a`)
  return showPlusSymbol && value > 0 ? `+${formattedNumber}` : formattedNumber
}
