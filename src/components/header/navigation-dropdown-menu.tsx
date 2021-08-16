import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Box
} from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import { GoChevronDown } from 'react-icons/go'

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
        <MenuItem className="mobile-only">
          <Link as={RouterLink} to="/projects">
            All projects
          </Link>
        </MenuItem>
        <MenuItem className="mobile-only">
          <Link as={RouterLink} to="/tags">
            Tags
          </Link>
        </MenuItem>
        <MenuItem>
          <Link as={RouterLink} to="/rankings/monthly">
            Monthly rankings
          </Link>
        </MenuItem>

        <MenuItem>
          <Link as={RouterLink} to="/hall-of-fame">
            Hall of Fame
          </Link>
        </MenuItem>
        <MenuItem>
          <Link as={RouterLink} to="/timeline">
            Timeline 2010 ~ 2020
          </Link>
        </MenuItem>
        <MenuItem>
          <Link as={RouterLink} to="/about">
            About Best of JS
          </Link>
        </MenuItem>
        <MenuDivider />
        <MenuGroup title="Related projects">
          <MenuItem>
            <Link href={risingStarsURL} isExternal>
              Rising Stars
              <Icon as={ExternalLinkIcon} />
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={stateOfJSURL} isExternal>
              State of JS
              <Icon as={ExternalLinkIcon} />
            </Link>
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}
