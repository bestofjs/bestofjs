import React from 'react'

import bgColors from './bgColors'

const Delta = (props) => {
  const { value, big, perDay, tooltip, color = true } = props

  const formatDelta = function (d) {
    if (d === null) return 'N/A'
    if (d === 0) return '='
    if (d < 0) return '- ' + Math.abs(d)
    return '+ ' + d
  }
  const getStyle = function (d) {
    const textColor = d < 40 ? 'rgba(55, 55, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'
    return {
      backgroundColor: bgColors[Math.min(parseInt(value / 2, 10), bgColors.length - 1)],
      color: textColor,
      fontSize: big ? 'inherited' : 13,
      textAlign: 'center'
    }
  }

  const style = getStyle(value)
  if (value < 0) {
    style.color = '#cc0000'
  }
  style.padding = '2px 5px'

  return (
    <div
      style={color ? style : {}}
      data-balloon={tooltip}
    >
      {formatDelta(value)}
      {props.icon && value !== 0 && (
        <span className="octicon octicon-star" style={{ fontSize: 14, marginLeft: 2 }} />
      )}
      {perDay && value !== 0 && value !== null && '/day'}
    </div>
  )
}
export default Delta
