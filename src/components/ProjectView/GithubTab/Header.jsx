import React, { PropTypes } from 'react'

import TagLabel from '../../tags/TagLabel'
import Description from '../../common/utils/Description'
import DeltaBar from '../../common/utils/DeltaBar'
import fromNow from '../../../helpers/fromNow'
import formatUrl from '../../../helpers/formatUrl'

const Header = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render() {
    const { project } = this.props
    return (
      <div className="">
        <div className="inner">
          <p>
            <Description text={ project.description } />
          </p>
          { project.url && (
            <p>
              <span className="octicon octicon-globe"></span>
              Website: <a href={ project.url }>{ formatUrl(project.url) }</a>
            </p>
          )}
        </div>
        <div className="inner tags" style={{ borderTop: '1px solid #ddd', paddingBottom: '0.5em' }}>
          { project.tags.map(function (tag) {
            return (
              <TagLabel key={ tag.id } tag={ tag } />
            )
          }) }
        </div>
        <div className="inner github" style={{ borderTop: '1px solid #ddd', paddingBottom: 0 }}>
          <p>
            <span className="octicon octicon-repo"></span>
            {' '}
            Github repository: <a href={ project.repository }>{ formatUrl(project.repository) }</a>
            {' '}
            { project.stars } <span className="octicon octicon-star"></span>
          </p>
          <div className="last-commit" style={{ marginBottom: '0.5em' }}>
            <span className="octicon octicon-git-commit"></span>
            {' '}
            Last update: { fromNow(project.pushed_at) }
          </div>
          <div>
            { project.deltas.length > 0 && <DeltaBar data={ project.deltas.slice(0, 7) } />}
          </div>
        </div>
      </div>
    )
  }
})
export default Header
