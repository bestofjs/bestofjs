import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'

import prettyBytes from '../../../../helpers/pretty-bytes'

const BundleSize = ({ project, ...rest }) => {
  const { bundle } = project
  const url = `https://bundlephobia.com/result?p=${project.npm}`
  if (!bundle) return <div>Loading bundle size...</div>
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div {...rest}>
          <a className="toggler" {...getTogglerProps()}>
            <span
              className={`octicon octicon-triangle-${
                on ? 'down' : 'right'
              } icon`}
            />{' '}
            Bundle size
          </a>
          {on && (
            <div style={{ margin: '.5rem 0 1rem', paddingLeft: '.5rem' }}>
              <p>
                <FileSize value={bundle.gzip} /> (Minified + Gzipped )
              </p>
              <p>
                <FileSize value={bundle.size} /> (Minified)
              </p>
              <p>
                Data from{' '}
                <a className="link" href={url}>
                  Bundlephobia.com
                </a>
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

BundleSize.propTypes = {
  project: PropTypes.object.isRequired
}

export default BundleSize
