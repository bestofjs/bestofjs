import React from 'react'
export default ({ projects }) => (
  <div className="inner">
    <div className="card-label-container">
      {projects.map(p => (
        <div key={p.id}>
          <a
            href={`#/projects/${p.id}`}
            className="card-label-project"
          >
            {p.name}
          </a>
        </div>
      ))}
    </div>
  </div>
)
