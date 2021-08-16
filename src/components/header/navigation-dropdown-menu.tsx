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
import { MenuItemLink } from 'components/core'

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
        <MenuItem className="mobile-only">
          <MenuItemLink as={RouterLink} to="/projects">
            All projects
          </MenuItemLink>
        </MenuItem>
        <MenuItem className="mobile-only">
          <MenuItemLink as={RouterLink} to="/tags">
            Tags
          </MenuItemLink>
        </MenuItem>
        <MenuItem>
          <MenuItemLink as={RouterLink} to="/rankings/monthly">
            Monthly rankings
          </MenuItemLink>
        </MenuItem>

        <MenuItem>
          <MenuItemLink as={RouterLink} to="/hall-of-fame">
            Hall of Fame
          </MenuItemLink>
        </MenuItem>
        <MenuItem>
          <MenuItemLink as={RouterLink} to="/timeline">
            Timeline 2010 ~ 2020
          </MenuItemLink>
        </MenuItem>
        <MenuItem>
          <MenuItemLink as={RouterLink} to="/about">
            About Best of JS
          </MenuItemLink>
        </MenuItem>
        <MenuDivider />
        <MenuGroup title="Related projects">
          <MenuItem>
            <MenuItemLink href={risingStarsURL} isExternal>
              Rising Stars
              <Icon as={ExternalLinkIcon} />
            </MenuItemLink>
          </MenuItem>
          <MenuItem>
            <MenuItemLink href={stateOfJSURL} isExternal>
              State of JS
              <Icon as={ExternalLinkIcon} />
            </MenuItemLink>
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
