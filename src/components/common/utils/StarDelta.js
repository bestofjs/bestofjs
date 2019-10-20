import React from 'react'
import styled from 'styled-components'

import { StarIcon } from '../../core/icons'

const getSign = value => {
  if (value === 0) return ''
  return value > 0 ? '+' : '-'
}

const StarDeltaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StarDelta = ({ average, ...props }) =>
  average ? <StarDeltaAverage {...props} /> : <StarDeltaNormal {...props} />

const StarDeltaNormal = ({ value }) => {
  const sign = getSign(value)
  return (
    <StarDeltaContainer>
      <span style={{ marginRight: 2 }}>{sign}</span>
      <span>{Math.abs(value)}</span>
      <StarIcon />
    </StarDeltaContainer>
  )
}

const StarDeltaAverageContainer = styled.div`
  text-align: center;
`

const StarDeltaAverage = ({ value }) => {
  const integerPart = Math.abs(Math.trunc(value))
  const decimalPart = (Math.abs(value - integerPart) * 10).toFixed().slice(0, 1)
  const sign = getSign(value)

  if (value === undefined)
    return <div className="star-delta text-secondary text-small">N/A</div>

  return (
    <StarDeltaAverageContainer>
      <StarDeltaContainer>
        <span style={{ marginRight: 2 }}>{sign}</span>
        <span>{integerPart}</span>
        <span className="text-smallX">.{decimalPart}</span>
      </StarDeltaContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <StarIcon />
        <div className="text-small"> by day</div>
      </div>
    </StarDeltaAverageContainer>
  )
}

export default StarDelta
