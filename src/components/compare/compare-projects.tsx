import React from 'react'
import styled from '@emotion/styled'

import { MainContent, PageHeader } from 'components/core'
import { HorizontalBarGraph } from './horizontal-bar-graph'

type Props = { projects: BestOfJS.Project[] }

export const CompareProjects = ({ projects }: Props) => {
  if (!projects?.length) return null
  return (
    <MainContent>
      <PageHeader title="Compare">Compare projects</PageHeader>
      <div>
        {projects
          .filter(project => !!project)
          .map(project => project.name)
          .join(' + ')}
      </div>
      <GraphCard>
        TODAY
        <ChartStarsDaily projects={projects} />
      </GraphCard>
      <GraphCard>
        LAST 7 days
        <ChartStarsWeekly projects={projects} />
      </GraphCard>
      <GraphCard>
        LAST 30 days
        <ChartStarsMonthly projects={projects} />
      </GraphCard>
    </MainContent>
  )
}

const GraphCard = styled.div`
  padding: 1rem;
  border: 1px solid var(--iconColor);
`

const ChartStarsDaily = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.daily
  }))
  return <HorizontalBarGraph data={data} />
}

const ChartStarsWeekly = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.weekly
  }))
  return <HorizontalBarGraph data={data} />
}

const ChartStarsMonthly = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.monthly
  }))
  return <HorizontalBarGraph data={data} />
}
