import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { GoFlame, GoGift } from 'react-icons/go'

import { useSelector } from 'containers/project-data-container'
import { Section, Spinner } from 'components/core'
import { ProjectTable } from 'components/project-list/project-table'
import { getProjectsSortedBy } from 'selectors'
import { StaticContentContainer } from 'containers/static-content-container'
import { ChevronDownIcon } from 'components/core/icons'

const ranges = {
  daily: 'yesterday',
  weekly: 'the last 7 days',
  monthly: 'the last 30 days',
  yearly: 'the last 12 months'
}

const hotProjectsExcludedTags = ['meta', 'learning']

export const isIncludedInHotProjects = project => {
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
      limit: 5,
      start: 0
    })
  )

  return (
    <>
      <Row>
        <MainCol>
          <Section.Header icon={<GoFlame fontSize={32} />}>
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
          sortOption={{ id: sortOptionId }}
          showDetails={false}
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

  const currentOption = sortOrderOptions.find(({ id }) => id === value)
  if (!currentOption) return null

  return (
    <Menu>
      <MenuButton as={Button} variant="outline" rightIcon={<ChevronDownIcon />}>
        {currentOption.label}
      </MenuButton>
      <MenuList>
        {sortOrderOptions.map(item => (
          <MenuItem
            key={item.id}
            onClick={() => {
              onChange(item.id)
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export const NewestProjects = ({ newestProjects, hotFilter }) => {
  const { projectName } = StaticContentContainer.useContainer()
  return (
    <>
      <Section.Header icon={<GoGift fontSize={32} />}>
        <Section.Title>Recently Added Projects</Section.Title>
        <Section.SubTitle>
          Latest additions to <i>{projectName}</i>
        </Section.SubTitle>
      </Section.Header>
      <ProjectTable
        projects={newestProjects}
        sortOption={{ id: 'daily' }}
        showActions={false}
        showDetails={false}
        footer={
          <Link to={`/projects?sort=newest`} style={{ display: 'block' }}>
            View more »
          </Link>
        }
      />
    </>
  )
}
