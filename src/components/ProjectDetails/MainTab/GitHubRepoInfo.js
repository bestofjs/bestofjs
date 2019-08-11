import React from 'react'
import numeral from 'numeral'

import StarIcon from '../../common/utils/StarIcon'
import fromNow from '../../../helpers/fromNow'
import ExternalLink from '../../common/ExternalLink'
import Card from '../../common/Card'

const formatNumber = number => numeral(number).format('0,0')

const GitHubCard = ({ project }) => {
  return (
    <Card>
      <Card.Header>
        <span className="octicon octicon-mark-github" />
        <span> GITHUB REPOSITORY</span>
      </Card.Header>
      <Card.Body>
        <Card.Section>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1 1 0%' }}>
              <p>
                <ExternalLink url={project.repository}>
                  {project.full_name}
                </ExternalLink>{' '}
                {formatNumber(project.stars)}
                <StarIcon />
              </p>
              <p>
                Created {fromNow(project.created_at)}, last commit{' '}
                {fromNow(project.pushed_at)}
              </p>
            </div>
            <div>
              <p>
                <span className="octicon octicon-organization" />{' '}
                {formatNumber(project.contributor_count)} contributors
              </p>
              {project.commit_count && (
                <p>
                  <span className="octicon octicon-history" />
                  {` ${formatNumber(project.commit_count)} commits`}
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
