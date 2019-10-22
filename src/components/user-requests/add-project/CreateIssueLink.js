import React from 'react'
import styled from 'styled-components'

import { ExternalLink } from '../../core/typography'
import getApi from '../../../api/config'

const templates = {
  ADD_PROJECT: 'add-a-project-to-best-of-javascript.md',
  ADD_HALL_OF_FAME_MEMBER: 'add-a-member-to-the-hall-of-fame.md'
}

const getCreateIssueURL = template => {
  const repo = getApi('ISSUES_REPO')

  return `https://github.com/${repo}/issues/new?template=${template}`
}

export const addProjectURL = getCreateIssueURL(templates.ADD_PROJECT)

export const CreateIssueLink = ({
  className,
  style,
  children,
  showAsButton,
  type
}) => {
  const Component = showAsButton ? ExternalLink : styled.a``
  const template = templates[type]
  const url = getCreateIssueURL(template)

  return (
    <Component target="_blank" className={className} style={style} href={url}>
      {children}
    </Component>
  )
}
