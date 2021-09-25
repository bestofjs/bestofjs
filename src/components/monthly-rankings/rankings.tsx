import React from 'react'
import styled from '@emotion/styled'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'

import { findProjectsByIds } from 'selectors'
import { ProjectTable } from 'components/project-list/project-table'
import { getProjectId, StarDelta } from 'components/core/project'
import { IconButton } from 'components/core'
import { useSelector } from 'containers/project-data-container'

export type MonthlyDate = { year: number; month: number }

export const MonthlyRankingsNavigator = ({
  date,
  isFirst,
  isLatest,
  goToPrevious,
  goToNext
}) => {
  return (
    <NavigatorContainer>
      <IconButton
        onClick={goToPrevious}
        aria-label="Previous month"
        isDisabled={isFirst}
        icon={<GoChevronLeft fontSize="28px" />}
        variant="outline"
        isRound
      />
      <RankingsTitle>
        <RankingsDate date={date} />
      </RankingsTitle>
      <IconButton
        onClick={goToNext}
        aria-label="Next month"
        isDisabled={isLatest}
        icon={<GoChevronRight fontSize="28px" />}
        variant="outline"
        isRound
      />
    </NavigatorContainer>
  )
}

export const MonthlyRankingsProjects = ({
  projects,
  year,
  month,
  limit,
  footer
}: {
  projects: BestOfJS.Project[]
  year: number
  month: number
  limit: number
  footer?: React.ReactNode
}) => {
  const ids = projects.map((project) => getProjectId(project)).slice(0, limit)
  const trendingProjects = useSelector(findProjectsByIds(ids))

  return (
    <ProjectTable
      projects={trendingProjects}
      showActions={true}
      showDetails={true}
      sortOption={{ id: 'monthly' }}
      metricsCell={(project) => {
        const value = projects.find(findBySlug(project.slug))?.delta
        return <StarDelta value={value} average={false} />
      }}
      footer={footer}
    />
  )
}

const findBySlug = (slug) => (project) => getProjectId(project) === slug

export function getPreviousMonth(date: MonthlyDate): MonthlyDate {
  const { year, month } = date
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 }
}

export function getNextMonth(date: MonthlyDate): MonthlyDate {
  const { year, month } = date
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 }
}

const RankingsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 400;
`

const NavigatorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: space-between;
`

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const RankingsDate = ({ date }: { date: MonthlyDate }) => {
  return (
    <>
      {monthNames[date.month - 1]} {date.year.toString()}
    </>
  )
}
