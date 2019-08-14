import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Card from '../../../common/Card'
import Spinner from '../../../common/Spinner'
import Dependencies from './Dependencies'
import BundleSize from './BundleSize'
import PackageSize from './PackageSize'
import License from './LicenseSection'
import ExternalLink from '../../../common/ExternalLink'

const NpmCard = props => {
  return (
    <Card style={{ marginTop: '2rem' }}>
      <Card.Header>
        <span className="octicon octicon-package" />
        <span> PACKAGE</span>
      </Card.Header>
      <Card.Body>
        <CardBodyContent {...props} />
      </Card.Body>
      {/* <Card.Footer>
        <ExternalLink
          url={`https://www.npmjs.com/package/${props.project.packageName}`}
          style={{ marginLeft: '.25rem' }}
        >
          View on NPM
        </ExternalLink>
      </Card.Footer> */}
    </Card>
  )
}

const CardBodyContent = ({ project, isLoading, error }) => {
  if (isLoading) return <Spinner />
  if (error)
    return (
      <Card.Section>
        <div>Unable to find package details</div>
      </Card.Section>
    )

  const { packageName, npm } = project
  return (
    <Fragment>
      <Card.Section>
        <ExternalLink
          url={`https://www.npmjs.com/package/${packageName}`}
          style={{ marginLeft: '.25rem' }}
        >
          {packageName} {npm.version}
        </ExternalLink>
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
