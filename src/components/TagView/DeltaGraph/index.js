import React from 'react'
import Graph from './Graph'
import sortOrderItems from '../../ProjectSortFilter/items'

const GraphCard = ({ projects, sortOrder }) => {
  const sortOrderItem = sortOrderItems.find(item => item.value === sortOrder)
  return (
    <div className="graph-card">
      <div className="graph-card-header">
        {sortOrderItem.title}
        <span
          data-balloon={'Sorted by average number of stars added every day'}
          style={{ marginLeft: '.5rem' }}
        >
          <span className="octicon octicon-question" />
        </span>
      </div>
      <div className="graph-container">
        <Graph projects={projects} sortOrder={sortOrder} />
      </div>
    </div>
  )
}

export default GraphCard
