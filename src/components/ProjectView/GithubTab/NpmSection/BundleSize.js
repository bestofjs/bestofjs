import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'

import ExpandableSection from './ExpandableSection'
import FileSize from './FileSize'
import List from './SizeDetailsList'

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
      <FileSize value={bundle.gzip} />
    </span>
  )
}

const BundleSizeDetails = ({ project, bundle, packageSize }) => {
  const url = `https://bundlephobia.com/result?p=${project.npm}`
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
        <a href={url}>
          <i>Bundle Phobia</i>
        </a>
      </List.Link>
      {/* <p>
        Install size: <FileSize value={packageSize.installSize} />
      </p> */}
    </List>
  )
}

const BundleSizeDetails0 = ({ project, bundle, packageSize }) => {
  const url = `https://bundlephobia.com/result?p=${project.npm}`
  return (
    <div style={{ margin: '.5rem 0 1rem', paddingLeft: '.5rem' }}>
      <List style={{ marginBottom: '1rem' }}>
        <thead>
          <tr>
            <td colSpan="2">
              <i>
                Data from{' '}
                <a className="link" href={url}>
                  Bundlephobia.com
                </a>
              </i>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minified + Gzipped</td>
            <td>
              <FileSize value={bundle.gzip} />
            </td>
          </tr>
          <tr>
            <td>Minified</td>
            <td>
              <FileSize value={bundle.size} />
            </td>
          </tr>
        </tbody>
      </List>
      <List>
        <thead>
          <tr>
            <td colSpan="2">
              <i>
                Data from{' '}
                <a className="link" href={url}>
                  View on Package Phobia.com
                </a>
              </i>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Installation size</td>
            <td>
              <FileSize value={packageSize.installSize} />
            </td>
          </tr>
        </tbody>
      </List>
    </div>
  )
}

BundleSize.propTypes = {
  project: PropTypes.object.isRequired
}

export default BundleSize
