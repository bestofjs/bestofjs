import React from 'react'

import { MonthlyChart } from '../monthly-bar-chart'

export const MonthlyTrends = ({ deltas }) => {
  const values = deltas.map(({ year, month, delta }) => ({
    year,
    month,
    value: delta
  }))
  return (
    <>
      <p>Stars added on GitHub, month by month</p>
      <MonthlyChart values={values} showPlusSymbol />
    </>
  )
}

export default MonthlyTrends
