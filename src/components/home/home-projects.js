import React from 'react'
import { Link } from 'react-router-dom'

import { Section, Spinner } from '../core'
import ProjectList from '../project-list/ProjectTable'

export const HotProjects = ({ hotProjects, hotFilter, pending }) => {
  return (
    <>
      <Section.Header icon="flame">
        <Section.Title>Today Hot Projects</Section.Title>
        <Section.SubTitle>by number of stars added yesterday</Section.SubTitle>
      </Section.Header>
      {pending ? (
        <Spinner />
      ) : (
        <ProjectList
          projects={hotProjects}
          showDelta
          deltaFilter={hotFilter}
          showStars={false}
          showMetrics={false}
          sortOption={{ id: 'daily' }}
          showDetails={false}
          showRankingNumber={false}
          showActions={false}
          footer={
            <Link to={`/projects?sort=daily`} style={{ display: 'block' }}>
              View full rankings »
            </Link>
          }
          style={{ marginBottom: '2rem' }}
        />
      )}
    </>
  )
}

export const NewestProjects = ({ newestProjects, hotFilter }) => {
  return (
    <>
      <Section.Header icon="gift">
        <Section.Title>Newest Projects</Section.Title>
        <Section.SubTitle>
          Latest additions to <i>Best of JavaScript</i>
        </Section.SubTitle>
      </Section.Header>
      <ProjectList
        projects={newestProjects}
        showDelta
        deltaFilter={hotFilter}
        showStars={false}
        showMetrics={false}
        sortOption={{ id: 'daily' }}
        showDetails={false}
        showRankingNumber={false}
        showActions={false}
        footer={
          <Link to={`/projects?sort=newest`} style={{ display: 'block' }}>
            View all newest projects »
          </Link>
        }
      />
    </>
  )
}
