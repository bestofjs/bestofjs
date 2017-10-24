import React from 'react'
import PropTypes from 'prop-types'

const Readme = ({ project }) => {
  return (
    <div>
      <div className="readme">
        <div>
          {true && (
            <div className="header">
              <span className="octicon octicon-book" /> README
            </div>
          )}

          <div className="body">
            {project.readme ? (
              <div dangerouslySetInnerHTML={{ __html: project.readme }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#aaa' }}>Loading README from GitHub...</p>
                <span
                  className="mega-octicon octicon-book"
                  style={{ margin: '1em 0', fontSize: 100, color: '#bbb' }}
                />
              </div>
            )}
          </div>

          <div className="footer" style={{ textAlign: 'center' }}>
            <a className="btn" href={project.repository}>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

Readme.propTypes = {
  project: PropTypes.object
}

export default Readme
