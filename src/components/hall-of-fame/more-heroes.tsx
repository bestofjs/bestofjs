import React from 'react'

import { CreateIssueLink } from 'components/user-requests/add-project/create-issue-link'

export const MoreHeroes = () => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Do you want more members ?</h3>
      <CreateIssueLink
        type="ADD_HALL_OF_FAME_MEMBER"
        className={`button-outline block`}
      >
        {' '}
        Create an issue to recommend a new member
      </CreateIssueLink>
    </div>
  )
}
