import React from 'react'
import Select from 'react-select'

import {
  getStarTotal,
  getStarsAddedYesterday,
  getStarsAddedThisWeek,
  getStarsAddedThisMonth,
  getStarsAddedThisYear
  // getLastCommitDate,
  // getRelativeGrowthRate
} from './project-selectors'

// TODO find a better way to include/exclude the sort option related to the bookmarks
export const getSortOrderOptions = ({ showBookmark = false } = {}) => {
  const bookmarkDateOption = {
    id: 'bookmark',
    label: 'By date of the bookmark',
    selector: project => project.bookmarked_at,
    direction: -1
  }

  const options = [
    showBookmark && bookmarkDateOption,
    {
      id: 'total',
      label: 'By total number of stars',
      selector: getStarTotal,
      direction: -1
    },
    {
      id: 'daily',
      label: 'By stars added yesterday',
      selector: getStarsAddedYesterday,
      direction: -1
    },
    {
      id: 'weekly',
      label: 'By stars added the last 7 days',
      selector: getStarsAddedThisWeek,
      direction: -1
    },
    {
      id: 'monthly',
      label: 'By stars added the last 30 months',
      selector: getStarsAddedThisMonth,
      direction: -1
    },
    {
      id: 'yearly',
      label: 'By stars added the last 12 months',
      selector: getStarsAddedThisYear,
      direction: -1
    }
  ]

  return options.filter(item => !!item)
}

export const SortOrderPicker = ({ value, onChange, showBookmark }) => {
  const sortOrderOptions = getSortOrderOptions({ showBookmark })
  const options = sortOrderOptions.map(({ id, label }) => ({
    value: id,
    label
  }))

  return (
    <div>
      <Select
        options={options}
        isSearchable={false}
        style={{ width: 200 }}
        value={options.find(item => item.value === value)}
        onChange={({ value }) => onChange(value)}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#9c0042',
            primary75: '#f76d42',
            primary50: '#ffae63',
            primary25: '#f6fad7'
          }
        })}
      />
    </div>
  )
}
