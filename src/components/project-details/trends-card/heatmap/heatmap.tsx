import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import tinytime from 'tinytime'
import times from 'lodash.times'

import './heatmap.css'

const fulldate = tinytime('{YYYY}/{Mo}/{DD} ({dddd})', {
  padMonth: true,
  padDays: true
})

const dayOfWeek = tinytime('{dddd}')

const values = times(40)
  .map(i => i + 1)
  .concat([45, 50, 55, 60, 70, 80, 90, 100, 200, 500])
const steps = values.length
const max = values[values.length - 1]

function scale(value) {
  if (!value) return 0
  if (value < 0) return `negative`
  if (value >= max) return steps
  const found = values.find(val => value < val)
  return values.indexOf(found)
}

const formatDate = date => date.toISOString().slice(0, 10)

const sameDate = (a, b) => {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10)
}

const getClassName = active => value =>
  `${
    active && value && sameDate(value.date, active.date) ? 'active ' : ''
  }color-${value ? scale(value.count) : 'empty'}`

const getTitle = value => {
  if (!value) return 'No data'
  const { count, date } = value
  if (count === 0) return `No star added on ${formatDate(date)}`
  return `${count > 0 ? '+' : '-'} ${Math.abs(count)} stars on ${formatDate(
    date
  )}`
}

const Details = ({ date, delta, yesterday }) => {
  const starVariation = () => {
    if (!delta) return 'no stars added'
    const starText = Math.abs(delta) === 1 ? 'star' : 'stars'
    return delta > 0
      ? `${delta} ${starText} added`
      : `${-delta} ${starText} lost`
  }
  const renderDate = () =>
    sameDate(date, yesterday)
      ? `Yesterday (${dayOfWeek.render(date)})`
      : fulldate.render(date)
  return (
    <div className="text-secondary" style={{ marginTop: '.5rem' }}>
      {renderDate()}: {starVariation()}
    </div>
  )
}

export const HeatMap = ({ values, active, selected, onClick }) => {
  const today = new Date()
  const yesterday = new Date(today.setDate(today.getDate() - 1))
  return (
    <div>
      <CalendarHeatmap
        endDate={yesterday}
        numDays={365}
        values={values}
        classForValue={getClassName(active)}
        titleForValue={getTitle}
        onClick={onClick}
      />
      <div style={{ marginTop: '.5rem' }}>
        {selected ? (
          <SelectedDate active={active} yesterday={yesterday} />
        ) : (
          <div className="text-secondary">
            <i>
              Click on any square to check the number of stars added at a given
              date.
            </i>
          </div>
        )}
      </div>
    </div>
  )
}

const SelectedDate = ({ active, yesterday }) => {
  return active ? (
    <Details date={active.date} delta={active.count} yesterday={yesterday} />
  ) : (
    <div>Sorry, no data for this day.</div>
  )
}
