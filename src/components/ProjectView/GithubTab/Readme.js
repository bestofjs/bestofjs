import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from '../../common/form/Button'

// import '../../../stylesheets/github-readme.css'
import '../../../stylesheets/markdown-body.css'

const GithubLink = Button.withComponent('a')

const readmePadding = '1rem'

const Div = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  .header {
    padding: 0.5em ${readmePadding};
    border-bottom: 1px solid #ccc;
  }
  .body {
    padding: ${readmePadding};
  }
  .footer {
    padding: ${readmePadding};
    border-top: 1px solid #ccc;
  }
`

const Readme = ({ project }) => {
  return (
    <div>
      <Div className="readme">
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
            <GithubLink href={project.repository}>View on GitHub</GithubLink>
          </div>
        </div>
      </Div>
    </div>
  )
}

Readme.propTypes = {
  project: PropTypes.object
}

export default Readme
