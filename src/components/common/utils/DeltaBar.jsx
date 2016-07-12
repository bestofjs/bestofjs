import React from 'react'
import Delta from './Delta'

function getTooltipText(star, i) {
  if (star === 0) return `No star added ${getDate(i)}`
  const abs = Math.abs(star)
  const s = abs > 1 ? 'stars' : 'star'
  if (star > 0) return `${star} ${s} added ${getDate(i)}`
  if (star < 0) return `${abs} ${s} lost ${getDate(i)}`
}

function getDate(i) {
  if (i === 0) return 'yesterday'
  if (i === 6) return 'one week ago'
  return `${i + 1} days ago`
}

const DeltaBar = (props) => {
  const deltas = props.data
  return (
    <div>
      <div className="delta-bar-container">
      { deltas.map((item, i) =>
        <Delta key={ i } value={ item } tooltip={ getTooltipText(item, i) } />
      ) }
      </div>
    </div>
  )
}
export default DeltaBar
