import React from 'react'

const NpmSection = ({ project }) => (
  <section className="card-section npm-card-section">
    <a
      data-balloon="View on npm"
      className="inner card-block npm-link"
      href={`http://npm.im/${project.npm}`}
    >
      <img
        className="npm-logo"
        width="16" height="16"
        src="https://www.npmjs.com/static/images/touch-icons/favicon-16x16.png"
      />
      {project.npm}
      <span className="version">
        {project.version}
      </span>
    </a>
    <a
      className="inner card-block quality-link"
      data-balloon="View on packagequality.com"
      href={`http://packagequality.com/#?package=${project.npm}`}
    >
      <img
        className="quality-logo"
        width="16" height="16"
        src="http://packagequality.com/favicon.ico"
      />
      score {project.quality}%
    </a>
  </section>
)

export default NpmSection
