import React from 'react'
import numeral from 'numeral'

import StarIcon from './StarIcon'

const StarTotal = ({ value, icon = true }) => {
  const digits = value > 1000 && value < 10000 ? '0.0' : '0'
  return (
    <span>
      {numeral(value).format(digits + ' a')}
      <StarIcon />
    </span>
  )
}
export default StarTotal
