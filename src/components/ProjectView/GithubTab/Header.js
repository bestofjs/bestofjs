import React from 'react'

import TagLabel from '../../tags/TagLabel'
import Description from '../../common/utils/Description'
import DeltaBar from '../../common/utils/DeltaBar'
import fromNow from '../../../helpers/fromNow'
import formatUrl from '../../../helpers/formatUrl'
import NpmSection from '../../projects/NpmSection'

// Some project URLs do not start with `http` ('daneden.github.io/animate.css' for example)
function addMissingHttp(url) {
  if (/^http/.test(url)) return url
  return `http://${url}`
}

const Header = ({ project }) =>
  <div className="">
    <div className="inner">
      <p>
        <Description text={project.description} showEmojis />
      </p>
      {project.url &&
        <p>
          <span className="octicon octicon-globe" />
          Website:&nbsp;<a href={addMissingHttp(project.url)}>
            {formatUrl(project.url)}
          </a>
        </p>}
    </div>
    <div className="inner tags" style={{ paddingBottom: '.5em' }}>
      {project.tags.map(function(tag) {
        return <TagLabel key={tag.id} tag={tag} />
      })}
    </div>
    {project.npm && <NpmSection project={project} />}
    <div className="inner github" style={{ paddingBottom: 0 }}>
      <p>
        <span className="octicon octicon-repo" /> GitHub repository:{' '}
        <a href={project.repository}>{formatUrl(project.repository)}</a>{' '}
        {project.stars} <span className="octicon octicon-star" />
      </p>
      <div className="last-commit" style={{ marginBottom: '1rem' }}>
        <span className="octicon octicon-git-commit" /> Last update:{' '}
        {fromNow(project.pushed_at)}
      </div>
      <div>
        {project.deltas.length > 0 &&
          <DeltaBar data={project.deltas.slice(0, 7)} />}
      </div>
    </div>
  </div>

export default Header
