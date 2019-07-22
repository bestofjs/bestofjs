import React from 'react'
import CreateIssueLink from '../user-requests/add-project/CreateIssueLink'

const MoreHeroes = () => {
  return (
    <div className="no-card-container" style={{ marginTop: '2rem' }}>
      <h3>Do you want more members ?</h3>
      <CreateIssueLink
        type="ADD_HALL_OF_FAME_MEMBER"
        showAsButton
        className={`button-outline block`}
      >
        {' '}
        Create an issue to recommend a new member
      </CreateIssueLink>
    </div>
  )
}
export default MoreHeroes
