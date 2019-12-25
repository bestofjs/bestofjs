import React from 'react'
import styled from 'styled-components'

import Heatmap from './Heatmap'
import MonthlyTrends from './MonthlyTrends'
import { StarDelta } from '../../../core/project'
import { Card } from '../../../core'
import { getDeltaByDay } from '../../../../selectors/project'
import { StarIcon } from '../../../core/icons'

const TrendsCards = ({ project }) => {
  const dailyDeltas = project.timeSeries && project.timeSeries.daily
  const showHeatMap = dailyDeltas && dailyDeltas.length > 1

  const monthlyDeltas = project.timeSeries && project.timeSeries.monthly
  const showMonthlyChart = monthlyDeltas && monthlyDeltas.length > 1

  return (
    <Card style={{ marginTop: '2rem' }}>
      <Card.Header>
        <span className="octicon octicon-graph" />
        <span> TRENDS</span>
      </Card.Header>
      <Card.Body>
        {showMonthlyChart && (
          <Card.Section>
            <MonthlyTrends deltas={monthlyDeltas} />
          </Card.Section>
        )}
        {showHeatMap && (
          <Card.Section>
            <Heatmap deltas={dailyDeltas} />
          </Card.Section>
        )}
        <TrendSummary project={project} />
      </Card.Body>
    </Card>
  )
}

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

const TrendSummary = ({ project }) => {
  const { trends } = project
  const items = [
    { label: 'Yesterday', category: 'daily' },
    { label: 'Last week', category: 'weekly' },
    { label: 'Last month', category: 'monthly' },
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
          <p>Stars added on GitHub, per day, on average</p>
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
