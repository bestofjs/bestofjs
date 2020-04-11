import React, { useState } from 'react'
import tinytime from 'tinytime'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { findProjectsByIds } from '../../selectors'
import { ExternalLink, Section, Button } from '../core'
import { getProjectId } from '../core/project'
import { ChevronLeftIcon, ChevronRightIcon } from '../core/icons'
import { useWeeklyNewsletter } from '../../api/hooks'
import { Row, MainColumn, RightSideBar } from './layout'
import ProjectList from '../project-list/ProjectTable'
import { SubscribeForm } from './subscribe-form'

export const Weekly = () => {
  return (
    <Section>
      <Row>
        <MainColumn>
          <Section.Header icon="mail">
            <Section.Title>Weekly Newsletter</Section.Title>
          </Section.Header>
          Visit{' '}
          <ExternalLink url="https://weekly.bestofjs.org/">
            Weekly Best of JavaScript
          </ExternalLink>{' '}
          to check our weekly newsletter.
          <FetchNewsletterIssue />
        </MainColumn>
        <RightSideBar>
          <SubscribeForm />
        </RightSideBar>
      </Row>
    </Section>
  )
}

const FetchNewsletterIssue = () => {
  const [currentNumber, setCurrentNumber] = useState(0)
  const { data, isPending, error } = useWeeklyNewsletter(currentNumber)
  if (isPending) {
    return <Loading>Loading the story...</Loading>
  }
  if (error) {
    return <div>Unable to load the issue: {error.message}</div>
  }
  const { number } = data
  const goToPrevious = () => setCurrentNumber(number - 1)
  const goToNext = () => setCurrentNumber(number + 1)

  return (
    <NewsletterIssue
      data={data}
      goToPrevious={goToPrevious}
      goToNext={goToNext}
    />
  )
}

const Loading = styled.div`
  margin: 2rem 0;
`

const NewsletterIssue = ({ data, goToPrevious, goToNext }) => {
  const { number, isLatest, date, growing, story } = data
  return (
    <>
      <IssueSubTitle>
        <NavButton onClick={goToPrevious}>
          <ChevronLeftIcon size={28} />
        </NavButton>
        <StoryTitle>
          Issue #{number}{' '}
          <span className="hidden-sm">
            (<IssueDate date={date} />)
          </span>
        </StoryTitle>
        <NavButton onClick={goToNext} disabled={isLatest}>
          <ChevronRightIcon />
        </NavButton>
      </IssueSubTitle>

      <Story dangerouslySetInnerHTML={{ __html: story }} />

      <RankingsTitle>Growing fast this week</RankingsTitle>
      <p className="text-secondary">
        Rankings by % of GitHub stars added (relative growth)
      </p>

      <Rankings projects={growing} />
    </>
  )
}

const NavButton = styled(Button)`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  padding: 0;
`

const IssueSubTitle = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`

const StoryTitle = styled.h4`
  font-size: 1.2rem;
  flex-grow: 1;
  text-align: center;
`

const RankingsTitle = styled.h4`
  font-size: 1.2rem;
`

const Story = styled.div`
  margin-bottom: 2rem;
  padding 1rem;
  background-color: white;
  blockquote {
    padding: 0 1em;
    border-left: 0.25em solid #fa9e59;
    margin-left: 0;
    color: var(--textSecondaryColor);
  }
  pre {
    padding: 1rem;
    overflow: auto;
    line-height: 1.45;
    background-color: #f7f7f7;
  }
`

const template = tinytime('{MMMM} {DD}, {YYYY}', { padDays: true })

const IssueDate = ({ date }) => {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  return template.render(dateObject)
}

const Rankings = ({ projects }) => {
  const ids = projects.map(project => getProjectId(project)).slice(0, 5)
  const trendingProjects = useSelector(findProjectsByIds(ids))

  return (
    <ProjectList
      projects={trendingProjects}
      showDelta
      showStars={false}
      showMetrics={false}
      sortOption={{ id: 'total' }}
      showDetails={false}
      showRankingNumber={false}
      showActions={false}
      footer={
        <a href={`https://weekly.bestofjs.org/`} style={{ display: 'block' }}>
          View this week rankings »
        </a>
      }
    />
  )
}
