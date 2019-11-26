import React from 'react'
import numeral from 'numeral'

const DownloadCount = ({ value }) => {
  if (value === undefined) {
    return <div className="star-delta text-secondary text-small">N/A</div>
  }

  return <span>{numeral(value).format('a')}</span>
}

export default DownloadCount
