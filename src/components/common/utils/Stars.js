import React from 'react'
import numeral from 'numeral'

const Stars = ({ value, icon = true }) => {
  const digits = value > 1000 && value < 10000 ? '0.0' : '0'
  return (
    <span>
      {numeral(value).format(digits + ' a')}
      {icon &&
        <span className="octicon octicon-star" style={{ marginLeft: 2 }} />}
    </span>
  )
}
export default Stars
