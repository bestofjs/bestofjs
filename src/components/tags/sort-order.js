import React from 'react'

import { DropdownMenu } from '../core'

export const getSortOrderOptions = () => {
  const options = [
    {
      id: 'project-count',
      label: 'by number of project'
    },
    {
      id: 'alpha',
      label: 'alphabetical order'
    }
  ]

  return options.filter(option => !!option)
}

export const SortOrderPicker = ({ value, onChange }) => {
  const sortOrderOptions = getSortOrderOptions()

  const items = sortOrderOptions.map(option => ({
    ...option,
    onClick: () => {
      onChange(option.id)
    }
  }))
  const currentOption = sortOrderOptions.find(({ id }) => id === value)

  return (
    <DropdownMenu value={value} items={items} alignment="left">
      {currentOption ? (
        <>
          <span style={{ marginRight: '0.5rem' }}>Sort:</span>
          <span>{currentOption.label}</span>
        </>
      ) : (
        'Sort...'
      )}
    </DropdownMenu>
  )
}
