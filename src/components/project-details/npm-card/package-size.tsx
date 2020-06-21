import React from 'react'
import Toggle from 'react-toggled'

import { ExpandableSection } from './expandable-section'
import { FileSize } from './file-size'
import { SizeDetailsList } from './size-details-list'
import { ExternalLink } from '../../core/typography'

export const PackageSize = ({ project, ...rest }) => {
  const { packageSize } = project
  if (!packageSize) return <div {...rest}>Loading package size...</div>
  if (packageSize.errorMessage)
    return (
      <div {...rest} className="version text-secondary">
        Package size data not available
      </div>
    )
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div {...rest}>
          <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
            Package Size data
          </ExpandableSection>
          {!on && <PackageSizePreview packageSize={packageSize} />}
          {on && (
            <BundleSizeDetails project={project} packageSize={packageSize} />
          )}
        </div>
      )}
    </Toggle>
  )
}

const PackageSizePreview = ({ packageSize }) => {
  return (
    <span className="text-secondary" style={{ marginLeft: '.5rem' }}>
      <FileSize value={packageSize.installSize} /> on the disk
    </span>
  )
}

const BundleSizeDetails = ({ project, packageSize }) => {
  const url = `https://packagephobia.now.sh/result?p=${project.packageName}`
  return (
    <SizeDetailsList>
      <SizeDetailsList.Item>
        Install size: <FileSize value={packageSize.installSize} />
        <SizeDetailsList.Explanation>
          Size of the package on the disk, with all its dependencies
        </SizeDetailsList.Explanation>
      </SizeDetailsList.Item>
      <SizeDetailsList.Item>
        Publish size: <FileSize value={packageSize.publishSize} />
        <SizeDetailsList.Explanation>
          Size of the package source code
        </SizeDetailsList.Explanation>
      </SizeDetailsList.Item>
      <SizeDetailsList.Link>
        View details on{' '}
        <ExternalLink url={url}>
          <i>Package Phobia</i>
        </ExternalLink>
      </SizeDetailsList.Link>
    </SizeDetailsList>
  )
}
