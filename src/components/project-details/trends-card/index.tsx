import React from 'react'
import styled from 'styled-components'
import { GoGraph } from 'react-icons/go'

import { getDeltaByDay } from '../../../selectors'
import { HeatMapContainer } from './heatmap'
import { MonthlyTrends } from './monthly-trends'
import { StarDelta } from '../../core/project'
import { Card } from '../../core'
import { StarIcon } from '../../core/icons'

export const TrendsCard = ({ project }) => {
  const dailyDeltas = project.timeSeries && project.timeSeries.daily
  const showHeatMap = dailyDeltas && dailyDeltas.length > 1

  const monthlyDeltas = project.timeSeries && project.timeSeries.monthly
  const showMonthlyChart = monthlyDeltas && monthlyDeltas.length > 1

  return (
    <Card style={{ marginTop: '2rem' }}>
      <Card.Header>
        <GoGraph className="icon" size={20} />
        TRENDS
      </Card.Header>
      <Card.Body>
        {showMonthlyChart && (
          <Card.Section>
            <MonthlyTrends deltas={monthlyDeltas} />
          </Card.Section>
        )}
        {showHeatMap && (
          <Card.Section>
            <HeatMapContainer deltas={dailyDeltas} />
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
