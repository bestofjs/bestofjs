import React, { Fragment } from 'react'
import numeral from 'numeral'

import TagLabelGroup from '../../tags/TagLabelGroup'
import Description from '../../common/utils/Description'
import StarIcon from '../../common/utils/StarIcon'
import fromNow from '../../../helpers/fromNow'
import formatUrl from '../../../helpers/formatUrl'
import ExternalLink from '../../common/ExternalLink'

// Some project URLs do not start with `http` ('daneden.github.io/animate.css' for example)
function addMissingHttp(url) {
  if (/^http/.test(url)) return url
  return `http://${url}`
}

const formatNumber = number => numeral(number).format('0,0')

const Header = ({ project }) => (
  <Fragment>
    <div className="inner">
      <p>
        <Description text={project.description} showEmojis={true} />
        {project.url && (
          <ExternalLink
            url={addMissingHttp(project.url)}
            style={{ marginLeft: '.5rem' }}
          >
            {formatUrl(project.url)}
          </ExternalLink>
        )}
      </p>
    </div>
    <div className="inner tags">
      <TagLabelGroup tags={project.tags} />
    </div>
    <div className="inner github" style={{ display: 'flex' }}>
      <div>
        <p>
          <span className="octicon octicon-repo" /> Repo:{' '}
          <ExternalLink url={project.repository} className="link">
            {project.full_name}
          </ExternalLink>{' '}
          {formatNumber(project.stars)}
          <StarIcon />
        </p>
        <p className="last-commit">
          <span className="octicon octicon-git-commit" /> Updated:{' '}
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
  </Fragment>
)

export default Header
