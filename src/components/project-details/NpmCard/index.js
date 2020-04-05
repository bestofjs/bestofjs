import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { Card, ExternalLink, Spinner } from '../../core'

import Dependencies from './Dependencies'
import BundleSize from './BundleSize'
import PackageSize from './PackageSize'
import { MonthlyDownloadChart } from './MonthlyDownloadChart'

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
    </Card>
  )
}

const CardBodyContent = ({ project, isLoading, error }) => {
  if (isLoading) return <Spinner />
  if (error)
    return (
      <Card.Section>
        <div>
          Unable to find package details:
          <br />
          {error.message}
        </div>
      </Card.Section>
    )

  const { packageName, npm } = project
  return (
    <Fragment>
      <Card.Section>
        <p>
          <ExternalLink url={`https://www.npmjs.com/package/${packageName}`}>
            {packageName} {npm.version}
          </ExternalLink>
        </p>
      </Card.Section>
      <Card.Section>
        <MonthlyDownloadChart project={project} />
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
    </Fragment>
  )
}

NpmCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default NpmCard
