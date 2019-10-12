import React, { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Select, { components } from 'react-select'
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback'
import styled from 'styled-components/macro' // eslint-disable-line no-unused-vars

import { SearchContext } from './SearchProvider'
import { getAllTags } from '../../selectors'

export const SearchBox = () => {
  const tags = useSelector(getAllTags)
  const { query, selectedTags, onChange } = useContext(SearchContext)
  const [inputValue, setInputValue] = useState(query)
  const [debouncedOnChange, cancel] = useDebouncedCallback(onChange, 300)

  const options = [{ id: '', counter: tags.length }, ...tags].map(item => ({
    ...item,
    value: item.id,
    label: item.name
  }))

  const selectedOptions = selectedTags.map(tagId =>
    options.find(({ id }) => id === tagId)
  )

  console.log('Render search box', selectedTags)

  useEffect(
    () => {
      setInputValue(query)
    },
    [query]
  )

  return (
    <div css={{ backgroundColor: 'var(--bestofjsOrange)', padding: '1rem 0' }}>
      <div className="container">
        <Select
          options={options}
          isMulti
          noOptionsMessage={() => null}
          placeholder={'Pick tags or enter keywords...'}
          onChange={(options, { action, option }) => {
            // console.log('> onChange', options, action, option)
            const tagIds = (options || []).map(({ id }) => id)
            if (action === 'select-option') {
              if (option.id === '') return
            }
            setInputValue('')
            cancel()
            onChange({ query: '', selectedTags: tagIds })
          }}
          onInputChange={(value, { action }) => {
            // console.log('onInputChange', value, action)
            if (action === 'input-change') {
              setInputValue(value)
              debouncedOnChange({ query: value })
            }
          }}
          inputValue={inputValue}
          value={selectedOptions}
          components={customComponents}
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
    </div>
  )
}

// Customize the default `Option` component provided by `react-select`
const Option = components.Option

const CustomOption = props => {
  const { id, name, counter } = props.data
  return (
    <Option {...props}>
      {id ? (
        <>
          {name} <span className="text-secondary">{counter}</span>
        </>
      ) : (
        <>
          Pick a tag...{' '}
          <span className="text-secondary">({counter} tags available)</span>
        </>
      )}
    </Option>
  )
}

const customComponents = {
  Option: CustomOption
}
