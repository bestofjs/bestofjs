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
        aria-label="Actions"
        variant="outline"
        isRound
      />
      <MenuList>
        <MenuItem
          as="a"
          href={project.repository}
          icon={<GoMarkGithub fontSize="16px" />}
        >
          Go to GitHub repository
        </MenuItem>
        {project.url && (
          <MenuItem as="a" href={project.url} icon={<GoHome fontSize="16px" />}>
            Go to homepage
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
