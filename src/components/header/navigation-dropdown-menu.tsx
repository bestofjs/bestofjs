import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Box
} from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'

import { StaticContentContainer } from 'containers/static-content-container'
import { ChevronDownIcon, ExternalLinkIcon } from 'components/core/icons'

export const NavigationDropdownMenu = () => {
  const { risingStarsURL, stateOfJSURL } = StaticContentContainer.useContainer()

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" color="var(--textPrimaryColor)">
        <Box className="desktop-only" color="var(--textSecondaryColor)">
          More <ChevronDownIcon />
        </Box>
        <Box className="mobile-only" py={2}>
          <FiMenu fontSize="24px" />
        </Box>
      </MenuButton>
      <MenuList>
        <MenuItem as={RouterLink} to="/projects" className="mobile-only">
          All projects
        </MenuItem>
        <MenuItem as={RouterLink} to="/tags" className="mobile-only">
          Tags
        </MenuItem>
        <MenuItem as={RouterLink} to="/rankings/monthly">
          Monthly rankings
        </MenuItem>

        <MenuItem as={RouterLink} to="/hall-of-fame">
          Hall of Fame
        </MenuItem>
        <MenuItem as={RouterLink} to="/timeline">
          Timeline 2010 ~ 2020
        </MenuItem>
        <MenuItem as={RouterLink} to="/about">
          About Best of JS
        </MenuItem>
        <MenuDivider />
        <MenuGroup title="Related projects">
          <MenuItem as="a" href={risingStarsURL}>
            Rising Stars
            <Icon as={ExternalLinkIcon} />
          </MenuItem>
          <MenuItem as="a" href={stateOfJSURL}>
            State of JS
            <Icon as={ExternalLinkIcon} />
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

// const MenuItemLink = styled(MenuItem)`
//   a {
//     color: inherit;
//     &:hover {
//       text-decoration: none;
//     }
//   }
// `

// const MenuItemLink = styled(Link)`
//   color: inherit;
//   &:hover {
//     text-decoration: none;
//   }
// `
