import React from 'react'
import Select from 'react-select'

import { getProjectSelectorByKey } from '../../selectors/project'

// TODO find a better way to include/exclude the sort option related to the bookmarks
export const getSortOrderOptions = ({ showBookmark = false } = {}) => {
  const bookmarkDateOption = {
    id: 'bookmark',
    label: 'By date of the bookmark'
  }

  const options = [
    showBookmark && bookmarkDateOption,
    {
      id: 'total',
      label: 'By total number of stars'
    },
    {
      id: 'daily',
      label: 'By stars added yesterday'
    },
    {
      id: 'weekly',
      label: 'By stars added the last 7 days'
    },
    {
      id: 'monthly',
      label: 'By stars added the last 30 months'
    },
    {
      id: 'yearly',
      label: 'By stars added the last 12 months'
    },
    {
      id: 'last-commit',
      label: 'By date of the latest commit'
    }
  ]

  return options
    .filter(option => !!option)
    .map(option => ({
      ...option,
      selector: getProjectSelectorByKey(option.id)
    }))
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
