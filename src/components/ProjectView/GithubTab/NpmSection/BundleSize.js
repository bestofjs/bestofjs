import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'

import ExpandableSection from './ExpandableSection'
import prettyBytes from '../../../../helpers/pretty-bytes'

const BundleSize = ({ project, ...rest }) => {
  const { bundle } = project
  const url = `https://bundlephobia.com/result?p=${project.npm}`
  if (!bundle) return <div>Loading bundle size...</div>
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div {...rest}>
          <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
            Bundle size
          </ExpandableSection>
          {!on && <BundleSizePreview bundle={bundle} />}
          {on && (
            <div style={{ margin: '.5rem 0 1rem', paddingLeft: '.5rem' }}>
              <p>
                • <FileSize value={bundle.gzip} /> (Minified + Gzipped)
              </p>
              <p>
                • <FileSize value={bundle.size} /> (Minified)
              </p>
              <p style={{ fontSize: 14, marginLeft: '.5rem' }}>
                <i>
                  Data from{' '}
                  <a className="link" href={url}>
                    Bundlephobia.com
                  </a>
                </i>
              </p>
            </div>
          )}
        </div>
      )}
    </Toggle>
  )
}

const FileSize = ({ value }) => {
  if (isNaN(value)) return null
  return prettyBytes(value)
}

const BundleSizePreview = ({ bundle }) => {
  return (
    <span className="text-secondary" style={{ marginLeft: '.5rem' }}>
      <FileSize value={bundle.gzip} />
    </span>
  )
}

BundleSize.propTypes = {
  project: PropTypes.object.isRequired
}

export default BundleSize
