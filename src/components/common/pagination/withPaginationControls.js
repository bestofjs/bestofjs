import React from 'react'
import PaginationControls from './PaginationControls'

function withPaginationControls(
  View,
  { url, pageNumber = 1, pageSize = 10, total, query }
) {
  return function PaginatedView(props) {
    const showPaginationControls = ({ style = {} }) =>
      total > pageSize &&
      <PaginationControls
        currentPage={pageNumber}
        query={query}
        total={total}
        limit={10}
        pageSize={pageSize}
        url={url}
        singular={'item'}
        plural={'items'}
        style={style}
      />
    return (
      <div>
        {showPaginationControls({})}
        <View {...props} />
        {showPaginationControls({ style: { marginTop: '2rem' } })}
        <hr />
      </div>
    )
  }
}

export default withPaginationControls
