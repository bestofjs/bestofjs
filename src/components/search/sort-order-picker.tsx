import React from 'react'
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react'
import { GoChevronDown } from 'react-icons/go'

import { useSearch } from './search-container'
import { sortOrderOptions } from './sort-order-options'

export const SortOrderPicker = ({ value, onChange }) => {
  const searchContext = useSearch()
  const currentOption = sortOrderOptions.find(({ id }) => id === value)

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<GoChevronDown />}>
        {currentOption ? (
          <>
            <Box as="span" mr={2}>
              Sort:
            </Box>
            <span>{currentOption.label}</span>
          </>
        ) : (
          'Sort...'
        )}
      </MenuButton>
      <MenuList>
        {sortOrderOptions.map((item, index) => {
          if (item.type === 'divider') return <MenuDivider key={index} />
          return (
            <MenuItem
              key={item.id}
              onClick={() => onChange(item.id)}
              isDisabled={item.disabled ? item.disabled(searchContext) : false}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </MenuList>
    </Menu>
  )
}
