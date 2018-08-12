import React from 'react'
import Dependencies from './Dependencies'
import BundleSize from './BundleSize'

const NpmSection = ({ project }) => (
  <section className="inner npm-section">
    <a
      href={`https://www.npmjs.com/package/${project.npm}`}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}
      target="_blank"
    >
      <img
        src="/logos/npm.svg"
        alt="NPM"
        className="npm"
        height="7"
        width="18"
        style={{ marginRight: '.25rem' }}
      />
      <span className="link" style={{ marginRight: '.25rem' }}>
        {project.npm}
      </span>
      <span className="version">{project.version}</span>
    </a>
    <BundleSize project={project} style={{ marginBottom: '.5rem' }} />
    <Dependencies project={project} />
  </section>
)

export default NpmSection
