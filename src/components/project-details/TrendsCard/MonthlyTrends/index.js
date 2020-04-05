import React from 'react'

import MonthlyChart from './MonthlyChart'

const MonthlyTrends = ({ deltas }) => {
  return (
    <>
      <p>Stars added on GitHub, month by month</p>
      <MonthlyChart values={deltas} />
    </>
  )
}

export default MonthlyTrends
