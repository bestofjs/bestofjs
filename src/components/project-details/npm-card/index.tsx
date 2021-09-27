import React from 'react'
import { GoPackage } from 'react-icons/go'

import {
  Card,
  CardBody,
  CardHeader,
  CardSection,
  ExternalLink,
  Spinner
} from 'components/core'
import { ExternalLinkIcon } from 'components/core/icons'
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
      <CardHeader>
        <GoPackage className="icon" size={24} />
        NPM PACKAGE
      </CardHeader>
      <CardBody>
        <CardBodyContent {...props} />
      </CardBody>
    </Card>
  )
}

const CardBodyContent = ({ project, isLoading, error }) => {
  if (error)
    return (
      <CardSection>Unable to load package details {error.message}</CardSection>
    )
  if (isLoading) return <Spinner />

  const { packageName, npm } = project
  return (
    <>
      <CardSection>
        <p>
          <ExternalLink url={`https://www.npmjs.com/package/${packageName}`}>
            {packageName} {npm.version}
            <ExternalLinkIcon />
          </ExternalLink>
        </p>
      </CardSection>
      <CardSection>
        <MonthlyDownloadChart project={project} />
      </CardSection>
      <CardSection>
        <Dependencies project={project} />
      </CardSection>
      <CardSection>
        <BundleSize project={project} />
      </CardSection>
      <CardSection>
        <PackageSize project={project} />
      </CardSection>
    </>
  )
}
