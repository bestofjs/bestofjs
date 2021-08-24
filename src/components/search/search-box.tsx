import React, { useState, useEffect, useRef } from 'react'
import Select, { components } from 'react-select'
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback'
import styled from '@emotion/styled'
import {
  CloseButton,
  IconButton,
  Tag,
  TagCloseButton,
  TagLabel
} from '@chakra-ui/react'

import { useSelector } from 'containers/project-data-container'
import { getAllTags } from 'selectors'
import { ChevronDownIcon } from 'components/core/icons'
import { SearchContainer } from './search-container'

// see https://github.com/JedWatson/react-select/issues/3692 for theming and dark theme

export const SearchBox = () => {
  const tags = useSelector(getAllTags)
  const { query, selectedTags, onChange } = SearchContainer.useContainer()
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

  useEffect(() => {
    setInputValue(query)
  }, [query])

  const selectRef = useRef<any>()

  return (
    <Container>
      <div className="container">
        <Select
          ref={selectRef}
          options={options}
          isMulti
          isClearable
          noOptionsMessage={() => null}
          placeholder={'Pick tags or enter keywords'}
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
          // This `onKeyDown` event handler is used only for 2 specific cases:
          // - Closing the keyboard on mobiles when the user pushes Enter
          // -  When the user enters text, moves the cursor just after the tag and pushes the Backspace key
          onKeyDown={event => {
            const input = selectRef?.current?.select.inputRef
            if (event.key === 'Enter') {
              input.blur()
              return
            }
            if (event.key !== 'Backspace') return
            if (selectedTags.length === 0) return
            if (query === '') return
            const { selectionStart, selectionEnd } = input
            if (!(selectionStart === 0 && selectionEnd === 0)) return
            console.info('Remove the last tag')
            onChange({
              query,
              selectedTags: selectedTags.slice(0, selectedTags.length - 1)
            })
          }}
          inputValue={inputValue}
          value={selectedOptions}
          components={customComponents}
          aria-label="Search by tag or keyword"
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              neutral0: 'var(--cardBackgroundColor)',
              neutral20: 'var(--boxBorderColor)',
              neutral30: 'var(--boxBorderColor)',
              neutral50: 'var(--textSecondaryColor)', // placeholder color
              neutral80: 'var(--textPrimaryColor)', // input color
              primary: 'var(--bestofjsOrange)',
              primary75: 'var(--menuHoverColor)',
              primary50: 'var(--menuHoverColor)',
              primary25: 'var(--menuHoverColor)'
            }
          })}
        />
      </div>
    </Container>
  )
}

const Container = styled.div`
  background: linear-gradient(135deg, #ed8518, #e75f16, #b94100);
  padding: 1rem 0;
  font-family: var(--buttonFontFamily);
`

// Customize the default `Option` component provided by `react-select`
const { Option, IndicatorsContainer } = components

const customComponents = {
  ClearIndicator: props => {
    return <CloseButton size="sm" mx={2} />
  },
  DropdownIndicator: props => {
    return (
      <IconButton
        icon={<ChevronDownIcon fontSize="16px" />}
        aria-label="View tags"
        variant="ghost"
        mx={2}
        size="sm"
        borderRadius="md"
        boxSize="24px"
      />
    )
  },
  Option: props => {
    const { id, name, counter } = props.data
    return (
      <Option {...props}>
        {id ? (
          <>
            {name} <span className="text-secondary">({counter})</span>
          </>
        ) : (
          <>
            Pick a tag...{'  '}
            <span className="text-secondary">({counter} tags available)</span>
          </>
        )}
      </Option>
    )
  },
  IndicatorsContainer: ({ children, ...props }) => {
    const { hasValue } = props // the selected tags
    const { inputValue } = props.selectProps // the query
    return (
      <IndicatorsContainer {...props}>
        {inputValue && !hasValue && (
          <CloseButton onClick={() => props.setValue()} size="sm" mr={2} />
        )}
        {children}
      </IndicatorsContainer>
    )
  },
  MultiValue: props => {
    const {
      data: { label },
      removeProps
    } = props
    return (
      <Tag mr={2}>
        <TagLabel>{label}</TagLabel>
        <TagCloseButton {...removeProps} />
      </Tag>
    )
  }
}
