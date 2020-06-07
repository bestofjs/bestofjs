import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { Section, Spinner, DropdownMenu } from 'components/core'
import { ProjectTable } from 'components/project-list/project-table'
import { getProjectsSortedBy } from 'selectors'

const ranges = {
  daily: 'yesterday',
  weekly: 'the last 7 days',
  monthly: 'the last 30 days',
  yearly: 'the last 12 months'
}

const hotProjectsExcludedTags = ['meta', 'learning']

const isIncludedInHotProjects = project => {
  const hasExcludedTag = hotProjectsExcludedTags.some(tag =>
    project.tags.includes(tag)
  )
  return !hasExcludedTag
}

export const HotProjects = ({ hotFilter, pending }) => {
  const [sortOptionId, setSortOptionId] = useState('daily')

  const projects = useSelector(
    getProjectsSortedBy({
      filterFn: isIncludedInHotProjects,
      criteria: sortOptionId,
      limit: 5
    })
  )

  return (
    <>
      <Row>
        <MainCol>
          <Section.Header icon="flame">
            <Section.Title>Hot Projects</Section.Title>
            <Section.SubTitle>
              by number of stars added <b>{ranges[sortOptionId]}</b>
            </Section.SubTitle>
          </Section.Header>
        </MainCol>
        <Col>
          <HotProjectsPicker value={sortOptionId} onChange={setSortOptionId} />
        </Col>
      </Row>
      {pending ? (
        <Spinner />
      ) : (
        <ProjectTable
          projects={projects}
          showDelta
          deltaFilter={sortOptionId}
          showStars={false}
          showMetrics={false}
          sortOption={{ id: sortOptionId }}
          showDetails={false}
          showRankingNumber={false}
          showActions={false}
          footer={
            <Link to={`/projects?sort=${sortOptionId}`}>
              View full rankings »
            </Link>
          }
          style={{ marginBottom: '2rem' }}
        />
      )}
    </>
  )
}

const Row = styled.div`
  display: flex;
  align-items: center;
`
const MainCol = styled.div`
  flex-grow: 1;
`
const Col = styled.div``

const HotProjectsPicker = ({ onChange, value }) => {
  const sortOrderOptions = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This week' },
    { id: 'monthly', label: 'This month' },
    { id: 'yearly', label: 'This year' }
  ]
  const items = sortOrderOptions.map(option => ({
    ...option,
    onClick: () => {
      onChange(option.id)
    }
  }))
  const currentOption = sortOrderOptions.find(({ id }) => id === value)

  return (
    <DropdownMenu value={value} items={items} alignment="right">
      {currentOption.label}
    </DropdownMenu>
  )
}

export const NewestProjects = ({ newestProjects, hotFilter }) => {
  return (
    <>
      <Section.Header icon="gift">
        <Section.Title>Recently Added Projects</Section.Title>
        <Section.SubTitle>
          Latest additions to <i>Best of JavaScript</i>
        </Section.SubTitle>
      </Section.Header>
      <ProjectTable
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
            View more recently added projects »
          </Link>
        }
      />
    </>
  )
}
