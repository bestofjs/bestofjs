import React from 'react'
import Heatmap from './Heatmap'

import StarDelta from '../../common/utils/StarDelta'

// New "DAILY TRENDS" block (Sep. 2017, v0.9)
// Show the heat map only if we have at least 2 daily deltas to show
const Trends = ({ project }) =>
  <div className="card" style={{ marginTop: '2rem' }}>
    <div className="header">
      <span className="octicon octicon-graph" />
      <span> DAILY TRENDS</span>
    </div>
    <div className="body">
      {project.deltas.length > 1 &&
        <div className="inner">
          <Heatmap deltas={project.deltas} />
        </div>}
      <MonthlyTrends project={project} />
    </div>
  </div>

const MonthlyTrendsItem = ({ item, stats }) => {
  const { label, category } = item
  const value = stats[category]
  return (
    <div>
      <div>
        {label}
      </div>
      <StarDelta value={value} inline average={category !== 'daily'} />
    </div>
  )
}

const MonthlyTrends = ({ project }) => {
  const stats = project.stats
  const items = [
    { label: 'Yesterday', category: 'daily' },
    { label: 'Last week', category: 'weekly' },
    { label: 'Last month', category: 'monthly' },
    { label: 'Last 3 months', category: 'quaterly' },
    { label: 'Last 12 months', category: 'yearly' }
  ].filter(item => {
    const value = stats[item.category]
    return value !== undefined && value !== null
  })
  return (
    <div className="card-section">
      <p>Stars added on GitHub, per day, on average:</p>
      <div className="daily-trends-container">
        {items.map((item, i) =>
          <MonthlyTrendsItem item={item} key={i} stats={stats} />
        )}
      </div>
    </div>
  )
}

export default Trends
