import React from 'react'

const NpmCardSection = ({ project }) =>
  <section className="card-section npm-card-section">
    <a
      data-balloon="View on npm"
      className="inner card-block npm-link"
      href={`https://www.npmjs.com/package/${project.npm}`}
    >
      <img
        className="npm-logo icon"
        width="16"
        height="16"
        src="https://www.npmjs.com/static/images/touch-icons/favicon-16x16.png"
      />
      {project.npm}
      <span className="version">
        {project.version}
      </span>
    </a>
    {(project.dependency_count || project.dependency_count === 0) &&
      <div className="inner" data-balloon="Number of dependencies">
        <span className="octicon octicon-package icon" />
        <span>
          {' '}{project.dependency_count}
        </span>
      </div>}
  </section>

export default NpmCardSection
