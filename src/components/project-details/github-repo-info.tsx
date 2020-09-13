import React from 'react'
import numeral from 'numeral'
import styled from 'styled-components'
import { GoMarkGithub, GoGitCommit } from 'react-icons/go'
import { MdGroup } from 'react-icons/md'

import { fromNow } from 'helpers/from-now'
import { Card, ExternalLink } from 'components/core'
import { StarTotal } from 'components/core/project'

const formatNumber = number => numeral(number).format('0,0')

type Props = { project: BestOfJS.ProjectDetails }
export const GitHubRepoInfo = ({
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
        <GoMarkGithub size={20} className="icon" />
        <span style={{ marginRight: '0.5rem' }}>GITHUB REPOSITORY</span>
        <StarTotal value={stars} />
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
              <Stats>
                <MdGroup size={20} className="icon" />
                {formatNumber(contributor_count)} contributors
              </Stats>
              {commit_count && (
                <Stats>
                  <GoGitCommit size={20} className="icon" />
                  {formatNumber(commit_count)} commits
                </Stats>
              )}
            </div>
          </div>
        </Card.Section>
      </Card.Body>
    </Card>
  )
}

const Stats = styled.p`
  display: flex;
  align-items: center;
  .icon {
    margin-right: 0.5rem;
  }
`
