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

export const sortOrderOptions = [
  {
    id: 'total',
    label: 'Total number of stars',
    selector: getStarTotal,
    direction: -1
  },
  {
    id: 'daily',
    label: 'Stars added yesterday',
    selector: getStarsAddedYesterday,
    direction: -1
  },
  {
    id: 'weekly',
    label: 'Stars added the last 7 days',
    selector: getStarsAddedThisWeek,
    direction: -1
  },
  {
    id: 'monthly',
    label: 'Stars added the last 30 months',
    selector: getStarsAddedThisMonth,
    direction: -1
  },
  {
    id: 'yearly',
    label: 'Stars added the last 12 months',
    selector: getStarsAddedThisYear,
    direction: -1
  }
]

export const SortOrderPicker = ({ value, onChange }) => {
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
