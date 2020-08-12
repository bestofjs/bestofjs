import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'

import { MainContent, PageTitle, Spinner } from 'components/core'
import { allProjects } from 'selectors'
import { useSelector } from 'containers/project-data-container'
import { Avatar } from 'components/core/project'
import { Timeline } from 'components/timeline/timeline'

export const TimelinePage = () => {
  const projects = useSelector(allProjects)
  if (!projects.length) return <Spinner />
  const byYear: Record<string, BestOfJS.Project[]> = groupBy(
    projects,
    getProjectYear
  )
  return (
    <MainContent>
      <PageTitle>Timeline: 2006-2020 in 20 projects</PageTitle>
      <PageDescription>
        Our favorite newsletter{' '}
        <a href="https://javascriptweekly.com/issues/500">JavaScript Weekly</a>,
        has just released its 500th issue.
        <br />
        Let's celebrate this milestone by picking 20 significant projects, from
        2006 to 2020.
        <br />A short story of the web platform from <i>jQuery</i> to{' '}
        <i>Rome</i>.
      </PageDescription>
      <Timeline />
      {false && (
        <Wrapper>
          {Object.keys(byYear).map((year: string) => (
            <YearRow key={year} year={year} projects={byYear[year]} />
          ))}
        </Wrapper>
      )}
      <Disclaimer>
        <h3>Disclaimer</h3>
        <p>We could have mentioned a lot of other projects:</p>
        <ul>
          <li>
            <Link to="/projects/threejs">Three.js</Link> (2010)
          </li>
          <li>
            <Link to="/projects/meteor">Meteor</Link> (2012)
          </li>
          <li>
            <Link to="/projects/jest">Jest</Link> (2013)
          </li>
          <li>
            <Link to="/projects/redux">Redux</Link> (2015)
          </li>
          <li>
            <Link to="/projects/gatsby">Gatsby</Link> (2015)
          </li>
          <li>
            <Link to="/projects/storybook">Storybook</Link> (2016)
          </li>
        </ul>
        <p>...but we had to make choices to keep this timeline compact.</p>
        <p>The 2 main constraints were:</p>
        <ul>
          <li>
            We wanted <b>20</b> projects because we are in 2020
          </li>
          <li>
            We wanted at least one project for every year between 2010 and 2020.
          </li>
        </ul>
        <p>Thank you for your understanding!</p>
      </Disclaimer>
    </MainContent>
  )
}

export default TimelinePage

export const isIncludedInHotProjects = project => {
  const hotProjectsExcludedTags = ['meta', 'learning']
  const hasExcludedTag = hotProjectsExcludedTags.some(tag =>
    project.tags.includes(tag)
  )
  return !hasExcludedTag
}

const YearRow = ({ year, projects }) => {
  return (
    <>
      <YearCell>{year}</YearCell>
      <YearProjects>
        {orderBy(projects, ['stars'], ['desc'])
          .filter(project => !!project.icon)
          .filter(isIncludedInHotProjects)
          .slice(0, 10)
          .map(project => (
            <div key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="hint--top"
                aria-label={`${project.name} ${project.stars} stars`}
              >
                <Avatar project={project} size={50} />
              </Link>
            </div>
          ))}
      </YearProjects>
    </>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  > div {
    background-color: white;
    padding: 1rem;
  }
`
const YearCell = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`
const YearProjects = styled.div`
  margin-bottom: 1rem;
  background-color: white;
  display: flex;
  > div {
    margin-right: 1rem;
  }
`

const getProjectYear = (project: BestOfJS.ProjectDetails) =>
  new Date(project.created_at).getFullYear()

const PageDescription = styled.div`
  padding-left: 1rem;
  border-left: 2px solid #fa9e59;
  margin-bottom: 2rem;
`

const Disclaimer = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px dashed #fa9e59;
`
