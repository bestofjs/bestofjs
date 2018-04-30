import React from 'react'
import styled from 'styled-components'

import Button from '../../common/form/Button'

import getApi from '../../../config/api'

const A = Button.withComponent('a')

const CreateIssueLink = ({ className, style, children, showAsButton }) => {
  const repo = getApi('ISSUES_REPO')
  const Component = showAsButton ? A : styled.a``
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
