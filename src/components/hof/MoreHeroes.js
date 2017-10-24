import React from 'react'
import CreateIssueLink from '../user-requests/add-project/CreateIssueLink'

const MoreHeroes = () => {
  return (
    <div className="no-card-container" style={{ marginTop: '2rem' }}>
      <h3 className="with-comment">Do you want more members ?</h3>
      <CreateIssueLink className="btn block button-outline">
        {' '}
        Create an issue to recommend a new member
      </CreateIssueLink>
    </div>
  )
}
export default MoreHeroes
