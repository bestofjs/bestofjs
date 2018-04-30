import React from 'react'
import styled from 'styled-components'

import Button from '../../common/form/Button'

import getApi from '../../../config/api'

const CreateIssueLink = ({ className, style, children, showAsButton }) => {
  const repo = getApi('ISSUES_REPO')
  const Component = showAsButton ? Button : styled.a``
  return (
    <Component
      target="_blank"
      className={className}
      style={style}
      href={`https://github.com/${repo}/issues/new`}
    >
      {children}
    </Component>
  )
}

export default CreateIssueLink
