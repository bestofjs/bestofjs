import React from 'react'
import Link from 'react-router/lib/Link'

export default ({ projects }) => (
  <div className="inner">
    <div className="card-label-container">
      {projects
        .filter(p => !!p)
        .map(p => (
        <div key={p.id}>
          <Link
            to={`/projects/${p.slug}`}
            className="card-label-project"
          >
            {p.name}
          </Link>
        </div>
      ))}
    </div>
  </div>
)
