import React from 'react'
import PropTypes from 'prop-types'
import Card from '../../../common/Card'
import Dependencies from './Dependencies'
import BundleSize from './BundleSize'
import PackageSize from './PackageSize'

const NpmCard = ({ project }) => {
  return (
    <Card style={{ marginTop: '2rem' }}>
      <div className="header">
        <span className="octicon octicon-package" />
        {/* <img
          src="/logos/npm.svg"
          alt="NPM"
          className="npm"
          height="7"
          width="18"
          style={{ marginRight: '.25rem' }}
        /> */}
        <span> PACKAGE</span>
      </div>
      <div className="body">
        <div className="inner">
          <span style={{ marginRight: '.25rem' }}>{project.npm}</span>
          <span className="version">{project.version}</span>
          <a
            href={`https://www.npmjs.com/package/${project.npm}`}
            style={{ marginLeft: '.25rem' }}
          >
            View on NPM
          </a>
        </div>
        <Card.Section>
          <Dependencies project={project} />
        </Card.Section>
        <Card.Section>
          <BundleSize project={project} />
        </Card.Section>
        <Card.Section>
          <PackageSize project={project} />
        </Card.Section>
      </div>
    </Card>
  )
}

NpmCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default NpmCard
