import React, { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
// import PropTypes from 'prop-types'
import Select from 'react-select'
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback'

import { SearchContext } from './SearchProvider'
import { getAllTags } from '../../selectors'

// export const useSyncUrl = ({ history, selectedTags, query }) => {
//   useEffect(
//     () => {
//       const queryString = stateToQueryString({ query, selectedTags })
//       const path = `/projects?${queryString}`
//       console.log('Push!')
//       history.push(path)
//     },
//     [selectedTags, query, history]
//   )
// }

export const SearchBox = () => {
  const tags = useSelector(getAllTags)
  const { query, selectedTags, onChange } = useContext(SearchContext)
  const [inputValue, setInputValue] = useState(query)
  // const [query, setQuery] = useState(initialQuery)
  // const [selectedTags, setSelectedTags] = useState(initialTags)
  // const initialState = {
  //   query: initialQuery,
  //   selectedTags: initialTags,
  //   updated: false
  // }
  // const [{ query, selectedTags, updated }] = useReducer(reducer, initialState)
  const options = tags.map(({ name, code }) => ({ value: code, label: name }))
  // const selectedOptions = options.filter(({ value }) =>
  //   selectedTags.includes(value)
  // )
  const selectedOptions = selectedTags.map(tagId =>
    options.find(({ value }) => value === tagId)
  )
  // .map(({ name, code }) => ({ value: code, label: name }))

  console.log('Render search box', selectedTags)

  const [debouncedOnChange, cancel] = useDebouncedCallback(onChange, 300)

  useEffect(
    () => {
      setInputValue(query)
    },
    [query]
  )

  return (
    <div style={{ backgroundColor: '#e65100', padding: '18px' }}>
      <div className="container">
        <Select
          options={options}
          isMulti
          noOptionsMessage={() => null}
          placeholder={'Pick several tags or enter keywords...'}
          onChange={(options, b) => {
            console.log('onChange', options, b)
            const tagIds = (options || []).map(({ value }) => value)
            // setSelectedTags(tagIds) // when removing tags using backspace key, the option is `null`
            setInputValue('')
            cancel()
            onChange({ query: '', selectedTags: tagIds })
          }}
          onInputChange={(value, { action }) => {
            console.log('onInputChange', value, action)
            if (action === 'input-change') {
              setInputValue(value)
              debouncedOnChange({ query: value })
            }
          }}
          inputValue={inputValue}
          value={selectedOptions}
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
