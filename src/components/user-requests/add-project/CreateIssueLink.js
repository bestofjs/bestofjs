import React from 'react'

import getApi from '../../../../config/api'

const CreateIssueLink = ({ className, style, children }) => {
  const repo = getApi('ISSUES_REPO')
  return (
    <a
      target="_blank"
      className={className}
      style={style}
      href={`https://github.com/${repo}/issues/new`}
    >
      {children}
    </a>
  )
}

export default CreateIssueLink
