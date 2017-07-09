import React from 'react'

import getApi from '../../../../config/api'

const CreateIssueLink = ({ className, children }) => {
  const repo = getApi('ISSUES_REPO')
  return (
    <a
      target="_blank"
      className={className}
      href={`https://github.com/${repo}/issues/new`}
    >
      {children}
    </a>
  )
}

export default CreateIssueLink
