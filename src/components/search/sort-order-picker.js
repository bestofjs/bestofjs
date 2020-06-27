import React from 'react'

import { DropdownMenu } from 'components/core'
import { useSearch } from './search-provider'
import { sortOrderOptions } from './sort-order-options'

export const SortOrderPicker = ({ value, onChange }) => {
  const searchContext = useSearch()
  const items = sortOrderOptions.map(option => ({
    ...option,
    onClick: () => {
      onChange(option.id)
    },
    disabled: option.disabled ? option.disabled(searchContext) : false
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
