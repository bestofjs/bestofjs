import React from 'react'
import styled from '@emotion/styled'

import { findProjectsByIds } from 'selectors'
import { Button } from 'components/core'
import { ChevronLeftIcon, ChevronRightIcon } from 'components/core/icons'
import { ProjectTable } from 'components/project-list/project-table'
import { getProjectId, StarDelta } from 'components/core/project'
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
      <NavButton onClick={goToPrevious} disabled={isFirst}>
        <ChevronLeftIcon size={28} />
      </NavButton>
      <RankingsTitle>
        <RankingsDate date={date} />
      </RankingsTitle>
      <NavButton onClick={goToNext} disabled={isLatest}>
        <ChevronRightIcon />
      </NavButton>
    </NavigatorContainer>
  )
}

export const MonthlyRankingsProjects = ({
  projects,
  year,
  month,
  limit,
  footer
}) => {
  const ids = projects.map(project => getProjectId(project)).slice(0, limit)
  const trendingProjects = useSelector(findProjectsByIds(ids))

  return (
    <ProjectTable
      projects={trendingProjects}
      showActions={true}
      showDetails={true}
      sortOption={{ id: 'monthly' }}
      metricsCell={project => {
        const value = projects.find(findBySlug(project.slug))?.delta
        return <StarDelta value={value} average={false} />
      }}
      footer={footer}
    />
  )
}

const findBySlug = slug => project => getProjectId(project) === slug

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

const NavButton = styled(Button)`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  padding: 0;
`
const RankingsTitle = styled.h4`
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
