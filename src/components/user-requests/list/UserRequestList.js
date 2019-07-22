import React from 'react'

import MainContent from '../../common/MainContent'
import fromNow from '../../../helpers/fromNow'
import CreateIssueLink from '../add-project/CreateIssueLink'
import Card from '../../common/Card'
import ExternalLink from '../../common/ExternalLink'

const UserRequestList = ({ requests }) => (
  <MainContent className="small container double-padding">
    <CreateIssueLink
      type="ADD_PROJECT"
      className="btn block button-outline"
      showAsButton
      style={{ marginBottom: '2em' }}
    >
      <span className="octicon octicon-plus" /> ADD A PROJECT
    </CreateIssueLink>
    <Card>
      <Card.Header>
        My requests <span className="counter">({requests.length})</span>
      </Card.Header>
      {requests.length === 0 ? (
        <div className="card-row inner">You have not created any request.</div>
      ) : (
        requests.map(request => <Issue issue={request} key={request.number} />)
      )}
    </Card>
  </MainContent>
)

const Issue = ({ issue }) => (
  <ExternalLink className="card-row link inner" url={issue.html_url}>
    <div>
      <div style={{ float: 'right' }}>
        <StateIcon state={issue.state} />
      </div>
      {issue.title}
    </div>
    <div className="text-secondary">Opened {fromNow(issue.created_at)}</div>
  </ExternalLink>
)

const StateIcon = ({ state }) => {
  const color = state === 'closed' ? '#bd2c00' : '#6cc644'
  const icon = state === 'closed' ? 'closed' : 'opened'
  return <span style={{ color }} className={`octicon octicon-issue-${icon}`} />
}

export default UserRequestList
