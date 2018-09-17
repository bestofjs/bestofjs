import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Card from '../../../common/Card'
import Spinner from '../../../common/Spinner'
import Dependencies from './Dependencies'
import BundleSize from './BundleSize'
import PackageSize from './PackageSize'
import License from './LicenseSection'

const NpmCard = ({ project }) => {
  const { packageName, npm } = project
  return (
    <Card style={{ marginTop: '2rem' }}>
      <Card.Header>
        <span className="octicon octicon-package" />
        <span> PACKAGE</span>
      </Card.Header>
      <Card.Body>
        <CardBodyContent
          project={project}
          npm={npm}
          packageName={packageName}
        />
      </Card.Body>
      <Card.Footer>
        <a
          href={`https://www.npmjs.com/package/${project.packageName}`}
          style={{ marginLeft: '.25rem' }}
          target="_blank"
        >
          View on NPM
        </a>
      </Card.Footer>
    </Card>
  )
}

const CardBodyContent = ({ project, npm, packageName }) => {
  if (!npm) return <Spinner />
  if (npm.errorMessage)
    return (
      <Card.Section>
        <div>{npm.errorMessage}</div>
      </Card.Section>
    )
  return (
    <Fragment>
      <Card.Section>
        <span style={{ marginRight: '.25rem' }}>{packageName}</span>
        <span className="version text-secondary">{npm.version}</span>
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
      <Card.Section>
        <License project={project} />
      </Card.Section>
    </Fragment>
  )
}

NpmCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default NpmCard
