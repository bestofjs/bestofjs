import React, { useState } from 'react'

import search from '../../selectors/search'
import SearchResults from './SearchResults'
import { SearchBox } from './SearchBox'

export const SearchModule = ({ tags, projects }) => {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([
    // { value: 'cli', label: 'CLI' },
    // { value: 'express', label: 'Express' }
  ])
  const isReadyToSearch =
    projects.length > 0 && (query.length > 2 || selectedTags.length > 0)
  const foundProjects = isReadyToSearch
    ? findProjects(projects, {
        tags: selectedTags,
        query
      })
    : []

  return (
    <div style={{ backgroundColor: '#e65100', padding: '18px' }}>
      <div className="container">
        <SearchBox
          tags={tags}
          query={query}
          setQuery={setQuery}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          placeHolder={'Select tags'}
        />
        <SearchResults projects={foundProjects} />
      </div>
    </div>
  )
}

function findProjects(projects, { tags, query }) {
  const tagIds = tags.map(tag => tag.value)

  const filterByTag = project =>
    tagIds.every(tagId => project.tags.includes(tagId))

  const filteredProjects = projects.filter(project => {
    if (tags.length > 0) {
      if (!filterByTag(project)) return false
    }
    return true
  })

  const foundProjects = query
    ? search(filteredProjects, query)
    : filteredProjects

  return foundProjects.slice(0, 10)
}
