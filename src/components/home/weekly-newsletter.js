import React from 'react'
import tinytime from 'tinytime'
import styled from 'styled-components'

import { ExternalLink, Section } from '../core'
import { useFetchLatestIssue } from '../../api/hooks'
import { Row, MainColumn, RightSideBar } from './layout'
import ProjectList from '../project-list/ProjectTable'
import { getProjectId } from '../core/project'
import { useSelector } from 'react-redux'
import { findProjectsByIds } from '../../selectors/project'
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
          <LatestIssue />
        </MainColumn>
        <RightSideBar>
          <SubscribeForm />
        </RightSideBar>
      </Row>
    </Section>
  )
}

export const LatestIssue = () => {
  const { data, isPending, error } = useFetchLatestIssue()
  if (isPending) {
    return <>Loading the latest story</>
  }
  if (error) {
    return <>Unable to load the latest issue</>
  }
  const { number, date, growing, story } = data
  return (
    <>
      <IssueSubTitle>
        Issue #{number}{' '}
        <span className="hidden-sm">
          (<IssueDate date={date} />)
        </span>
      </IssueSubTitle>
      <Story dangerouslySetInnerHTML={{ __html: story }} />
      <IssueSubTitle>Growing fast this week</IssueSubTitle>
      <Rankings projects={growing} />
    </>
  )
}

const IssueSubTitle = styled.h4`
  margin: 1rem 0;
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
      sortOption={{ id: 'daily' }}
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
