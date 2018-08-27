import React from 'react'

import Section from './ProjectCardSection'
import prettyBytes from '../../helpers/pretty-bytes'

const NpmCardSection = ({ project }) => {
  const bundleSize = project.gzip ? prettyBytes(project.gzip) : 0
  return (
    <Section className="npm-card-section">
      <div className="inner" data-balloon={'Package name on npm'}>
        <img
          className="npm-logo icon"
          width="18"
          height="7"
          src="/logos/npm.svg"
          alt="npm package"
        />
        {project.packageName}
        <span className="version">{project.version}</span>
      </div>
      {project.gzip > 0 && (
        <div
          className="inner"
          data-balloon={`${project.dependency_count} dependencies`}
        >
          <span className="octicon octicon-package icon" />
          {/* <span> {project.dependency_count}</span> */}
          <span> {bundleSize}</span>
        </div>
      )}
    </Section>
  )
}

export default NpmCardSection
