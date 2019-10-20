import React from 'react'
import numeral from 'numeral'
import styled from 'styled-components'

import { StarIcon } from '../../core/icons'
const Span = styled.span`
  display: inline-flex;
  align-items: center;
`

const StarTotal = ({ value, size = 14 }) => {
  const digits = value > 1000 && value < 10000 ? '0.0' : '0'
  return (
    <Span>
      <span style={{ fontSize: size }}>
        {numeral(value).format(digits + ' a')}
      </span>
      <StarIcon size={size} />
    </Span>
  )
}
export default StarTotal
