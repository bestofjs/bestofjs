import React from 'react'
import { Box, Button } from '@chakra-ui/react'

import { DropdownMenu, Menu, MenuGroup, MenuItem } from 'components/core/menu'
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

  const menu = (
    <Menu>
      <MenuGroup>
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
      </MenuGroup>
    </Menu>
  )

  return (
    <DropdownMenu menu={menu}>
      <Button rightIcon={<ChevronDownIcon />}>
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
      </Button>
    </DropdownMenu>
  )
}
