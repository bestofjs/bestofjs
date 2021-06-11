import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { MainContent, Title, Spinner } from 'components/core'
import { allProjects } from 'selectors'
import { useSelector } from 'containers/project-data-container'
import { Timeline } from 'components/timeline/timeline'

export const TimelinePage = () => {
  const projects = useSelector(allProjects)
  if (!projects.length) return <Spinner />

  return (
    <MainContent>
      <Title>Timeline: 2006-2020 in 20 projects</Title>
      <PageDescription>
        Our favorite newsletter{' '}
        <a href="https://javascriptweekly.com/issues/500">JavaScript Weekly</a>{' '}
        has just released its 500th issue.
        <br />
        Let's celebrate this milestone by picking 20 significant projects, from
        2006 to 2020.
        <br />A short story of the web platform from <i>jQuery</i> to{' '}
        <i>Rome</i>.<br />
        Click on the links to see the project details and the trends on{' '}
        <i>Best of JS</i>.
      </PageDescription>
      <Timeline />
      <Disclaimer>
        <h3>About this timeline / Disclaimer</h3>
        <p>We could have mentioned a lot of other projects:</p>
        <ul>
          <li>
            <Link to="/projects/threejs">Three.js</Link> (2010)
          </li>
          <li>
            <Link to="/projects/backbone">Backbone</Link> (2010)
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
            <Link to="/projects/rollup">Rollup</Link> (2015)
          </li>
          <li>
            <Link to="/projects/gatsby">Gatsby</Link> (2015)
          </li>
          <li>
            <Link to="/projects/storybook">Storybook</Link> (2016)
          </li>
          <li>
            <Link to="/projects/parcel">Parcel</Link> (2017)
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
        <p>
          The date displayed for each project is the date of the creation of the
          repository on GitHub, except for the following projects: jQuery,
          Node.js, and TypeScript.
        </p>
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
