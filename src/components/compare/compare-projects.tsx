import React from 'react'

import { Box, Grid, MainContent, PageHeader } from 'components/core'
import { HorizontalBarGraph } from './horizontal-bar-graph'
import { formatDelta } from './utils'
import { useFetchCompareProjects } from 'api/hooks'
import { ReadmeTabs } from './readme-tabs'

type Props = { projects: BestOfJS.Project[] }

export const CompareProjects = ({ projects }: Props) => {
  // const data = null
  const { data } = useFetchCompareProjects({
    full_names: projects.map(project => project.full_name)
  })
  if (!projects?.length) return null

  return (
    <MainContent>
      <PageHeader title="Compare">Compare projects</PageHeader>
      <Box mb={4} fontSize={3}>
        {projects
          .filter(project => !!project)
          .map(project => project.name)
          .join(' + ')}
      </Box>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={4}>
        <GraphCard title={<>TODAY</>}>
          <ChartStarsDaily projects={projects} />
        </GraphCard>
        <GraphCard title={<>LAST 7 days</>}>
          <ChartStarsWeekly projects={projects} />
        </GraphCard>
        <GraphCard title={<>LAST 30 days</>}>
          <ChartStarsMonthly projects={projects} />
        </GraphCard>
        <GraphCard title={<>LAST 365 days</>}>
          <ChartStarsYearly projects={projects} />
        </GraphCard>
        <GraphCard title={<>Contributors</>}>
          <ChartContributors projects={projects} />
        </GraphCard>
        {data && (
          <GraphCard title={<>Number of commits</>}>
            <ChartCommits projects={data} />
          </GraphCard>
        )}
        {data && (
          <GraphCard title={<>Bundle size</>}>
            <ChartBundleSize projects={data} />
          </GraphCard>
        )}
      </Grid>
      <ReadmeTabs projects={projects} mt={4} />
    </MainContent>
  )
}

const GraphCard = ({ title, children }) => {
  return (
    <Box bg="white">
      <Box p={2} borderBottomWidth="1px">
        {title}
      </Box>
      <Box p={3}>{children}</Box>
    </Box>
  )
}

const ChartStarsDaily = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.daily
  }))
  return <HorizontalBarGraph data={data} formatValue={formatDelta} />
}

const ChartStarsWeekly = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.weekly
  }))
  return <HorizontalBarGraph data={data} formatValue={formatDelta} />
}

const ChartStarsMonthly = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.monthly
  }))
  return <HorizontalBarGraph data={data} />
}
const ChartStarsYearly = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.trends.yearly
  }))
  return <HorizontalBarGraph data={data} />
}

const ChartContributors = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.contributor_count
  }))
  return <HorizontalBarGraph data={data} />
}

const ChartBundleSize = ({ projects }: Props) => {
  const data = projects.map(project => ({
    project: project.name,
    value: project.bundle.gzip || 0
  }))
  return <HorizontalBarGraph data={data} />
}

const ChartCommits = ({
  projects
}: {
  projects: BestOfJS.ProjectDetails[]
}) => {
  console.log({ projects })
  const data = projects.map(project => ({
    project: project.name,
    value: project.github.commit_count
  }))
  return <HorizontalBarGraph data={data} />
}
