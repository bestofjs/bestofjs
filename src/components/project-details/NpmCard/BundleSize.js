import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'

import ExpandableSection from './ExpandableSection'
import FileSize from './FileSize'
import List from './SizeDetailsList'
import { ExternalLink } from '../../core/typography'

const BundleSize = ({ project, ...rest }) => {
  const { bundle, packageSize } = project
  if (!bundle) return <div {...rest}>Loading bundle size...</div>
  if (bundle.errorMessage)
    return (
      <div {...rest} className="version text-secondary">
        Bundle size data not available
      </div>
    )
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div {...rest}>
          <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
            Bundle Size data
          </ExpandableSection>
          {!on && <BundleSizePreview bundle={bundle} />}
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

const BundleSizePreview = ({ bundle }) => {
  return (
    <span className="text-secondary" style={{ marginLeft: '.5rem' }}>
      <FileSize value={bundle.gzip} /> (Minified + Gzipped)
    </span>
  )
}

const BundleSizeDetails = ({ project, bundle }) => {
  const url = `https://bundlephobia.com/result?p=${project.packageName}`
  return (
    <List>
      <List.Item>
        <FileSize value={bundle.gzip} /> (Minified + Gzipped)
      </List.Item>
      <List.Item>
        <FileSize value={bundle.size} /> (Minified)
      </List.Item>
      <List.Link>
        View details on{' '}
        <ExternalLink url={url}>
          <i>Bundle Phobia</i>
        </ExternalLink>
      </List.Link>
    </List>
  )
}

BundleSize.propTypes = {
  project: PropTypes.object.isRequired
}

export default BundleSize
