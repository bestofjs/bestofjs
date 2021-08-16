import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Flex,
  MenuItem,
  Link,
  Menu,
  MenuButton,
  MenuList
} from '@chakra-ui/react'
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
      <Flex alignItems="center">
        <Box flexGrow={1}>
          <Section.Header icon={<GoFlame fontSize={32} />}>
            <Section.Title>Hot Projects</Section.Title>
            <Section.SubTitle>
              by number of stars added <b>{ranges[sortOptionId]}</b>
            </Section.SubTitle>
          </Section.Header>
        </Box>
        <Box>
          <HotProjectsPicker value={sortOptionId} onChange={setSortOptionId} />
        </Box>
      </Flex>
      {pending ? (
        <Spinner bg="var(--cardBackgroundColor)" borderWidth="1px" mb={4} />
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
    <Menu placement="bottom-end">
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
          <Link
            as={RouterLink}
            to={`/projects?sort=newest`}
            style={{ display: 'block' }}
          >
            View more »
          </Link>
        }
      />
    </>
  )
}
