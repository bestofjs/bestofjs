import React from 'react'
import Link from 'react-router/lib/Link'

export default ({ projects }) => {
  const validProjects = projects.filter(p => !!p)
  if (validProjects.length === 0) return null
  return (
    <div className="inner">
      <div className="card-label-container">
        {validProjects.map(p => (
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
}
