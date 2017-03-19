import React from 'react'

const NpmSection = ({ project, packagequality = true, npms = true }) => (
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

    {packagequality && (
      <a
        className="inner card-block quality-link"
        data-balloon="View on packagequality.com"
        target="_blank"
        href={`http://packagequality.com/#?package=${project.npm}`}
      >
        <img
          className="quality-logo"
          width="16" height="16"
          src="http://packagequality.com/favicon.ico"
        />
        {project.quality}<span className="text-secondary">%</span>
      </a>
    )}

    {npms && (
      <a
        className="inner card-block quality-link"
        data-balloon="View on npms.io"
        target="_blank"
        href={`https://npms.io/search?q=${project.npm}`}
      >
        <img
          className="quality-logo"
          width="46" height="18"
          src="/images/npms.png"
        />
        {project.score}<span className="text-secondary">%</span>
      </a>
    )}

  </section>
)

export default NpmSection
