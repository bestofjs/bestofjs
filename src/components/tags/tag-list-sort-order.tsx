import React from 'react'
import { Box, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

import { ChevronDownIcon } from 'components/core/icons'

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

export const TagListSortOrderPicker = ({ value, onChange }) => {
  const sortOrderOptions = getSortOrderOptions()
  const currentOption = sortOrderOptions.find(({ id }) => id === value)

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
        {sortOrderOptions.map(item => (
          <MenuItem
            key={item.id}
            onClick={() => {
              onChange(item.id)
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
