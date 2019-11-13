import React from 'react'
// import Select from 'react-select'

import { DropdownMenu } from '../core'
import { useSearch } from './SearchProvider'

export const getSortOrderOptions = () => {
  const options = [
    {
      id: 'total',
      label: 'By total number of stars'
    },
    { type: 'divider' },
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
      label: 'By stars added the last 30 days'
    },
    {
      id: 'yearly',
      label: 'By stars added the last 12 months'
    },
    { type: 'divider' },
    {
      id: 'monthly-downloads',
      label: 'By downloads the last 30 days'
    },
    { type: 'divider' },
    {
      id: 'last-commit',
      label: 'By date of the latest commit'
    },
    {
      id: 'contributors',
      label: 'By number of contributors'
    },
    { type: 'divider' },
    {
      id: 'match',
      label: 'Best matching',
      disabled: ({ query }) => query === ''
    },
    { type: 'divider' },
    {
      id: 'bookmark',
      label: 'By date of the bookmark',
      disabled: ({ location }) => location.pathname !== '/bookmarks'
    }
  ]

  return options.filter(option => !!option)
  // .map(option => ({
  //   ...option,
  //   selector: getProjectSelectorByKey(option.id)
  // }))
}

export const SortOrderPicker = ({ value, onChange }) => {
  const searchContext = useSearch()
  const sortOrderOptions = getSortOrderOptions()
  // const options = sortOrderOptions.map(({ id, label }) => ({
  //   value: id,
  //   label
  // }))
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

  // return (
  //   <div>
  //     <Select
  //       options={options}
  //       isSearchable={false}
  //       style={{ width: 200 }}
  //       value={options.find(item => item.value === value)}
  //       onChange={({ value }) => onChange(value)}
  //       theme={theme => ({
  //         ...theme,
  //         colors: {
  //           ...theme.colors,
  //           primary: '#9c0042',
  //           primary75: '#f76d42',
  //           primary50: '#ffae63',
  //           primary25: '#f6fad7'
  //         }
  //       })}
  //       components={{
  //         ValueContainer: () => null
  //         // ValueContainer: ({ children, props }) => (
  //         //   <Button {...props}>={children}</Button>
  //         // ),
  //         // IndicatorsContainer: () => null
  //       }}
  //     />
  //   </div>
  // )
}
