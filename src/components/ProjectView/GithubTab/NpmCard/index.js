import React from 'react'
import PropTypes from 'prop-types'
import Card from '../../../common/Card'
import Dependencies from './Dependencies'
import BundleSize from './BundleSize'
import PackageSize from './PackageSize'

const NpmCard = ({ project }) => {
  return (
    <Card style={{ marginTop: '2rem' }}>
      <Card.Header>
        <span className="octicon octicon-package" />
        <span> PACKAGE</span>
      </Card.Header>
      <Card.Body>
        <Card.Section>
          <span style={{ marginRight: '.25rem' }}>{project.npm}</span>
          <span className="version">{project.version}</span>
          <a
            href={`https://www.npmjs.com/package/${project.npm}`}
            style={{ marginLeft: '.25rem' }}
            target="_blank"
          >
            View on NPM
          </a>
        </Card.Section>
        <Card.Section>
          <Dependencies project={project} />
        </Card.Section>
        <Card.Section>
          <BundleSize project={project} />
        </Card.Section>
        <Card.Section>
          <PackageSize project={project} />
        </Card.Section>
      </Card.Body>
    </Card>
  )
}

NpmCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default NpmCard
