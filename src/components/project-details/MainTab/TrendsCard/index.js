import React from 'react'
import styled from 'styled-components'

import Heatmap from './Heatmap'
import StarDelta from '../../../common/utils/StarDelta'
import Card from '../../../common/Card'
import { getDeltaByDay } from '../../../../selectors/project'
import { StarIcon } from '../../../core/icons'

// New "DAILY TRENDS" block (Sep. 2017, v0.9)
// Show the heat map only if we have at least 2 daily deltas to show
const TrendsCards = ({ project }) => (
  <Card style={{ marginTop: '2rem' }}>
    <Card.Header>
      <span className="octicon octicon-graph" />
      <span> DAILY TRENDS</span>
    </Card.Header>
    <Card.Body>
      {project.deltas && project.deltas.length > 1 && (
        <div className="inner">
          <Heatmap deltas={project.deltas} />
        </div>
      )}
      <MonthlyTrends project={project} />
    </Card.Body>
  </Card>
)

const MonthlyTrendsItem = ({ item, trends }) => {
  const { label, category } = item
  const value = getDeltaByDay(category)({ trends })
  return (
    <div>
      <div>{label}</div>
      <StarDelta value={value} inline average={category !== 'daily'} />
    </div>
  )
}

const Div = styled.div`
  width: 100%;
  display: flex;
  > div {
    flex: 1;
    text-align: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    > div:not(:first-child) {
      margin-top: 0.5rem;
    }
  }
`

const MonthlyTrends = ({ project }) => {
  const { trends } = project
  const items = [
    { label: 'Yesterday', category: 'daily' },
    { label: 'Last week', category: 'weekly' },
    { label: 'Last month', category: 'monthly' },
    { label: 'Last 3 months', category: 'quarterly' },
    { label: 'Last 12 months', category: 'yearly' }
  ].filter(({ category }) => {
    const value = trends[category]
    return value !== undefined && value !== null
  })

  const OnlyYesterday = ({ trends }) => {
    const value = trends.daily
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
  }
  return (
    <Card.Section>
      {trends.weekly || trends.weekly === 0 ? (
        <div>
          <p>Stars added on GitHub, per day, on average:</p>
          <Div>
            {items.map((item, i) => (
              <MonthlyTrendsItem item={item} key={i} trends={trends} />
            ))}
          </Div>
        </div>
      ) : (
        <OnlyYesterday trends={trends} />
      )}
    </Card.Section>
  )
}

export default TrendsCards
