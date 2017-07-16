/* eslint-disable */

/* WORK in PROGRESS, COMING SOON! */

import React from 'react'
import Graph from './Graph'
// import sortOrderItems from '../../ProjectSortFilter/items'
import Table from './ProjectList'

const GraphCard = ({ projects, sortOrder }) => {
  // const sortOrderItem = sortOrderItems.find(item => item.value === sortOrder)
  return (
    <div className="graph-card">
      <div className="graph-card-header">
        Most popular projects, by total number of stars
      </div>
      <div className="graph-container">
        <Graph projects={projects} />
        <Table projects={projects} />
      </div>
    </div>
  )
}

export default GraphCard
