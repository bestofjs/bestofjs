import React from 'react'
import numeral from 'numeral'

import fromNow from '../../../helpers/fromNow'
import { Card, ExternalLink } from '../../core'
import { StarTotal } from '../../core/project'

const formatNumber = number => numeral(number).format('0,0')

const GitHubCard = ({
  project: {
    full_name,
    repository,
    stars,
    created_at,
    pushed_at,
    contributor_count,
    commit_count
  }
}) => {
  return (
    <Card>
      <Card.Header>
        <span className="octicon octicon-mark-github" />
        <span>
          {' '}
          GITHUB REPOSITORY <StarTotal value={stars} />
        </span>
      </Card.Header>
      <Card.Body>
        <Card.Section>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1 1 0%' }}>
              <p>
                <ExternalLink url={repository}>{full_name}</ExternalLink>{' '}
              </p>
              {created_at && (
                <p>
                  Created {fromNow(created_at)}, last commit{' '}
                  {fromNow(pushed_at)}
                </p>
              )}
            </div>
            <div>
              <p>
                <span className="octicon octicon-organization" />{' '}
                {formatNumber(contributor_count)} contributors
              </p>
              {commit_count && (
                <p>
                  <span className="octicon octicon-history" />
                  {` ${formatNumber(commit_count)} commits`}
                </p>
              )}
            </div>
          </div>
        </Card.Section>
      </Card.Body>
    </Card>
  )
}

export default GitHubCard
