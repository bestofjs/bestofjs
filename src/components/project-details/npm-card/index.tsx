import React from 'react'
import { GoPackage } from 'react-icons/go'

import { Card, ExternalLink, Spinner } from '../../core'

import { Dependencies } from './dependencies'
import { BundleSize } from './bundle-size'
import { PackageSize } from './package-size'
import { MonthlyDownloadChart } from './monthly-download-chart'

const showStats = false // TODO restore when we have data

type Props = {
  project: BestOfJS.ProjectDetails
  isLoading: boolean
  error: Error
}
export const NpmCard = (props: Props) => {
  return (
    <Card style={{ marginTop: '2rem' }}>
      <Card.Header>
        <GoPackage className="icon" size={24} />
        PACKAGE
      </Card.Header>
      <Card.Body>
        <CardBodyContent {...props} />
      </Card.Body>
    </Card>
  )
}

const CardBodyContent = ({ project, isLoading, error }) => {
  if (error)
    return (
      <Card.Section>
        Unable to load package details {error.message}
      </Card.Section>
    )
  if (isLoading) return <Spinner />

  const { packageName, npm } = project
  return (
    <>
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
      {showStats && (
        <>
          <Card.Section>
            <Dependencies project={project} />
          </Card.Section>
          <Card.Section>
            <BundleSize project={project} />
          </Card.Section>
          <Card.Section>
            <PackageSize project={project} />
          </Card.Section>
        </>
      )}
    </>
  )
}
