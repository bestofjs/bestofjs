import React from 'react'

import Section from './ProjectCardSection'

const NpmCardSection = ({ project }) => (
  <Section className="npm-card-section">
    <div className="inner" data-balloon={'Package name on npm'}>
      <img
        className="npm-logo icon"
        width="18"
        height="7"
        src="/logos/npm.svg"
        alt="npm package"
      />
      {project.npm}
      <span className="version">{project.version}</span>
    </div>
    {(project.dependency_count || project.dependency_count === 0) && (
      <div
        className="inner"
        data-balloon={`${project.dependency_count} dependencies`}
      >
        <span className="octicon octicon-package icon" />
        <span> {project.dependency_count}</span>
      </div>
    )}
  </Section>
)

export default NpmCardSection
