import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { GoCalendar } from 'react-icons/go'

import { useFetchMonthlyRankings } from 'api/hooks'
import { MainContent, PageHeader, Spinner } from 'components/core'
import {
  getNextMonth,
  getPreviousMonth,
  MonthlyRankingsNavigator,
  MonthlyRankingsProjects
} from 'components/monthly-rankings/rankings'

export const MonthlyRankingsPage = () => {
  const { year, month } = useParams()
  return (
    <MainContent>
      <PageHeader title="Monthly Rankings" icon={<GoCalendar size={32} />} />
      <FetchMonthlyRankings date={{ year, month }} />
    </MainContent>
  )
}

const FetchMonthlyRankings = ({ date }) => {
  const history = useHistory()
  const { data, error } = useFetchMonthlyRankings(date)

  if (error) {
    return <div>Unable to load the rankings</div>
  }
  if (!data) {
    return <Spinner />
  }
  const { year, month, isFirst, isLatest } = data as any

  const goToPrevious = () => {
    const target = getPreviousMonth({ year, month })
    history.push(`/rankings/monthly/${target.year}/${target.month}`)
  }
  const goToNext = () => {
    const target = getNextMonth({ year, month })
    history.push(`/rankings/monthly/${target.year}/${target.month}`)
  }

  return (
    <>
      <MonthlyRankingsNavigator
        date={date}
        isFirst={isFirst}
        isLatest={isLatest}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
      />
      <MonthlyRankingsProjects
        projects={data.trending}
        limit={50}
        year={year}
        month={month}
      />
    </>
  )
}
