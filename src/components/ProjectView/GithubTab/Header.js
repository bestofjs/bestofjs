import React from 'react'
import numeral from 'numeral'

import TagLabel from '../../tags/TagLabel'
import Description from '../../common/utils/Description'
import StarIcon from '../../common/utils/StarIcon'
import fromNow from '../../../helpers/fromNow'
import formatUrl from '../../../helpers/formatUrl'
import NpmSection from './NpmSection'

// Some project URLs do not start with `http` ('daneden.github.io/animate.css' for example)
function addMissingHttp(url) {
  if (/^http/.test(url)) return url
  return `http://${url}`
}

const formatNumber = number => numeral(number).format('0,0')

const Header = ({ project }) =>
  <div className="">
    <div className="inner">
      <p>
        <Description text={project.description} showEmojis />
        {project.url &&
          <a href={addMissingHttp(project.url)} style={{ marginLeft: '.5rem' }}>
            {formatUrl(project.url)}
          </a>}
      </p>
    </div>
    <div className="inner tags" style={{ paddingBottom: '.5em' }}>
      {project.tags.map(function(tag) {
        return <TagLabel key={tag.id} tag={tag} />
      })}
    </div>
    {project.npm && <NpmSection project={project} />}
    <div className="inner github" style={{ display: 'flex' }}>
      <div>
        <p>
          <span className="octicon octicon-repo" /> Repo:{' '}
          <a href={project.repository}>{project.full_name}</a>{' '}
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
        <p>
          <span className="octicon octicon-history" />{' '}
          {project.commit_count
            ? `${formatNumber(project.commit_count)} commits`
            : 'Loading'}
        </p>
      </div>
    </div>
  </div>

export default Header
