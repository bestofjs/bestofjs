import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../common/form/Button'
import Card from '../../common/Card'
import '../../../stylesheets/markdown-body.css'

const GithubLink = Button.withComponent('a')

const ReadmeCard = ({ project }) => {
  return (
    <Card className="readme">
      <Card.Header>
        <span className="octicon octicon-book" /> README
      </Card.Header>
      <Card.Body>
        <Card.Section>
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
        </Card.Section>
      </Card.Body>
      <Card.Footer>
        <GithubLink href={project.repository}>View on GitHub</GithubLink>
      </Card.Footer>
    </Card>
  )
}

ReadmeCard.propTypes = {
  project: PropTypes.object
}

export default ReadmeCard
