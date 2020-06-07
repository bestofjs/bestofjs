import React, { Fragment } from 'react'

import { Card, ExternalLink, Spinner } from '../../core'

import { Dependencies } from './dependencies'
import { BundleSize } from './bundle-size'
import { PackageSize } from './package-size'
import { MonthlyDownloadChart } from './monthly-download-chart'

type Props = {
  project: BestOfJS.ProjectDetails
  isLoading: boolean
  error: Error
}
export const NpmCard = (props: Props) => {
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
