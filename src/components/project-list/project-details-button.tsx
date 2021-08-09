import React from 'react'
import styled from '@emotion/styled'
import {
  GoBookmark,
  GoHome,
  GoKebabVertical,
  GoMarkGithub
} from 'react-icons/go'

import { Button, Menu, Popover } from 'components/core'

type Props = {
  Project: BestOfJS.Project
  isLoggedIn: boolean
}
export const ProjectDetailsButton = ({ project, isLoggedIn }: Props) => {
  const getBookmarkMenuItem = () => {
    if (!isLoggedIn) {
      return { label: 'Add bookmark', icon: <GoBookmark />, disabled: true }
    }
    if (project.isBookmark) {
      return {
        label: 'Remove bookmark',
        icon: <GoBookmark />,
        onClick: () => removeBookmark(project)
      }
    }
    return {
      label: 'Add bookmark',
      icon: <GoBookmark />,
      onClick: () => addBookmark(project)
    }
  }

  const getHomepageMenuItem = () =>
    project.url && {
      icon: <GoHome />,
      label: 'Go to homepage',
      url: project.url,
      onClick: () => ({})
    }

  const items = [
    // { type: 'label', label: 'Links' },
    {
      icon: <GoMarkGithub />,
      label: 'Go to GitHub repository',
      url: project.repository,
      onClick: () => ({})
    },
    getHomepageMenuItem(),
    { type: 'divider' },
    getBookmarkMenuItem()
  ]

  return (
    <Popover
      alignment="right"
      content={({ close }) => {
        return <Menu items={items} />
      }}
    >
      {({ open }) => {
        return (
          <RoundedButton onClick={open}>
            <GoKebabVertical fontSize="20px" />
          </RoundedButton>
        )
      }}
    </Popover>
  )
}

const RoundedButton = styled(Button)`
  padding: 0;
  border-radius: 99px;
  width: 36px;
  height: 36px;
`
