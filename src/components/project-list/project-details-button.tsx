import React from 'react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton
} from '@chakra-ui/react'
import {
  GoBookmark,
  GoHome,
  GoKebabVertical,
  GoMarkGithub
} from 'react-icons/go'
import { MenuItemLink } from 'components/core'

type Props = {
  Project: BestOfJS.Project
  isLoggedIn: boolean
}
export const ProjectDetailsButton = ({ project, isLoggedIn }: Props) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<GoKebabVertical fontSize="20px" />}
        variant="outline"
        isRound
      />
      <MenuList>
        <MenuItem icon={<GoMarkGithub fontSize="16px" />}>
          <MenuItemLink href={project.repository} isExternal>
            Go to GitHub repository
          </MenuItemLink>
        </MenuItem>
        {project.url && (
          <MenuItem icon={<GoHome fontSize="16px" />}>
            <MenuItemLink href={project.url} isExternal>
              Go to homepage
            </MenuItemLink>
          </MenuItem>
        )}
        <MenuDivider />
        <MenuItem
          icon={<GoBookmark fontSize="16px" />}
          isDisabled={!isLoggedIn}
          onClick={() => {
            project.isBookmark ? removeBookmark(project) : addBookmark(project)
          }}
        >
          {project.isBookmark ? 'Remove bookmark' : 'Add bookmark'}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
