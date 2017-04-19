import React from 'react'
import { Link } from 'react-router-dom'

const CardProjectLabels = ({ projects }) => {
  const validProjects = projects.filter(p => !!p)
  if (validProjects.length === 0) return null
  return (
    <div className="inner">
      <div className="card-label-container">
        {validProjects.map(p => (
          <div key={p.slug}>
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

export default CardProjectLabels
