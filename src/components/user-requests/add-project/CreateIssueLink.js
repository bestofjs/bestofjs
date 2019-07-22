import React from 'react'
import styled from 'styled-components'

import ExternalLink from '../../common/form/Button/ExternalLink'

import getApi from '../../../config/api'

const templates = {
  ADD_PROJECT: 'add-a-project-to-best-of-javascript.md',
  ADD_HALL_OF_FAME_MEMBER: 'add-a-member-to-the-hall-of-fame.md'
}

const CreateIssueLink = ({
  className,
  style,
  children,
  showAsButton,
  type
}) => {
  const repo = getApi('ISSUES_REPO')
  const Component = showAsButton ? ExternalLink : styled.a``
  const template = templates[type]

  return (
    <Component
      target="_blank"
      className={className}
      style={style}
      href={`https://github.com/${repo}/issues/new?template=${template}`}
    >
      {children}
    </Component>
  )
}

export default CreateIssueLink
