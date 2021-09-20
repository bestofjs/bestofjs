import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, IconButton, useMediaQuery } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
// import { GoChevronDown } from 'react-icons/go'

import { StaticContentContainer } from 'containers/static-content-container'
import { ChevronDownIcon, ExternalLinkIcon } from 'components/core/icons'
import { DropdownMenu, Menu, MenuGroup, MenuItem } from 'components/core/menu'

export const NavigationDropdownMenu = () => {
  const { risingStarsURL, stateOfJSURL } = StaticContentContainer.useContainer()
  const [isDesktop] = useMediaQuery(['(min-width: 700px)'])

  const menu = (
    <Menu>
      <MenuGroup>
        {!isDesktop && (
          <MenuItem as={RouterLink} to="/projects">
            Projects
          </MenuItem>
        )}
        {!isDesktop && (
          <MenuItem as={RouterLink} to="/tags">
            Tags
          </MenuItem>
        )}
        <MenuItem as={RouterLink} to="/monthly-rankings">
          Monthly rankings
        </MenuItem>
        <MenuItem as={RouterLink} to="/hall-of-fame">
          Hall of fame
        </MenuItem>
        <MenuItem as={RouterLink} to="/timeline">
          Timeline
        </MenuItem>
        <MenuItem as={RouterLink} to="/about">
          About
        </MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuItem as="a" href={risingStarsURL} target="_blank">
          Rising Stars
          <ExternalLinkIcon />
        </MenuItem>
        <MenuItem as="a" href={stateOfJSURL} target="_blank">
          State of JS
          <ExternalLinkIcon />
        </MenuItem>
      </MenuGroup>
    </Menu>
  )

  return (
    <DropdownMenu menu={menu}>
      {isDesktop ? (
        <Button variant="ghost" rightIcon={<ChevronDownIcon />}>
          More
        </Button>
      ) : (
        <IconButton
          icon={<FiMenu fontSize="28px" />}
          variant="ghost"
          aria-label="Menu"
        />
      )}
    </DropdownMenu>
  )
}
