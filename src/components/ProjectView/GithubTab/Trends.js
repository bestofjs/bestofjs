import React from 'react'
import Heatmap from './Heatmap'

import StarDelta from '../../common/utils/StarDelta'
import StarIcon from '../../common/utils/StarIcon'

// New "DAILY TRENDS" block (Sep. 2017, v0.9)
// Show the heat map only if we have at least 2 daily deltas to show
const Trends = ({ project }) => (
  <div className="card" style={{ marginTop: '2rem' }}>
    <div className="header">
      <span className="octicon octicon-graph" />
      <span> DAILY TRENDS</span>
    </div>
    <div className="body">
      {project.deltas.length > 1 && (
        <div className="inner">
          <Heatmap deltas={project.deltas} />
        </div>
      )}
      <MonthlyTrends project={project} />
    </div>
  </div>
)

const MonthlyTrendsItem = ({ item, stats }) => {
  const { label, category } = item
  const value = stats[category]
  return (
    <div>
      <div>{label}</div>
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
  const OnlyYesterday = ({ stats }) => {
    const value = stats.daily
    if (value === 0) return <div>No star added on GitHub yesterday</div>
    return value > 0 ? (
      <div>
        {value}
        <StarIcon /> added yesterday
      </div>
    ) : (
      <div>
        {value}
        <StarIcon /> lost yesterday
      </div>
    )
    // return <MonthlyTrendsItem item={items[0]} stats={stats} />
  }
  return (
    <div className="card-section">
      {stats.weekly || stats.weekly === 0 ? (
        <div>
          <p>Stars added on GitHub, per day, on average:</p>
          <div className="daily-trends-container">
            {items.map((item, i) => (
              <MonthlyTrendsItem item={item} key={i} stats={stats} />
            ))}
          </div>
        </div>
      ) : (
        <OnlyYesterday stats={stats} />
      )}
    </div>
  )
}

export default Trends
