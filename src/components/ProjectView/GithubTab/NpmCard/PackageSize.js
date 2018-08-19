import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'

import ExpandableSection from './ExpandableSection'
import FileSize from './FileSize'
import List from './SizeDetailsList'

const PackageSize = ({ project, ...rest }) => {
  const { bundle, packageSize } = project
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
            <BundleSizeDetails
              project={project}
              bundle={bundle}
              packageSize={packageSize}
            />
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
  const url = `https://packagephobia.now.sh/result?p=${project.npm}`
  return (
    <List>
      <List.Item>
        Install size: <FileSize value={packageSize.installSize} />
        <List.Explanation>
          Size of the package on the disk, with all its dependencies
        </List.Explanation>
      </List.Item>
      <List.Item>
        Publish size: <FileSize value={packageSize.publishSize} />
        <List.Explanation>Size of the package source code</List.Explanation>
      </List.Item>
      <List.Link>
        View details on{' '}
        <a href={url} target="_blank">
          <i>Package Phobia</i>
        </a>
      </List.Link>
    </List>
  )
}

PackageSize.propTypes = {
  project: PropTypes.object.isRequired
}

export default PackageSize
