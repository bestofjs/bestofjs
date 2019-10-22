import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Card from '../../common/Card'
import Spinner from '../../common/Spinner'
import { useFetchProjectReadMe } from '../../../api/hooks'
import '../../../stylesheets/markdown-body.css'

const GithubLink = styled.a``

const ReadmeCard = ({ project }) => {
  const { data: html, isLoading, error } = useFetchProjectReadMe(project)
  const ReadmeContent = () => {
    if (isLoading) return <Spinner />
    if (error) return <div>Unable to fetch README.md content from GitHub</div>
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <Card className="readme">
      <Card.Header>
        <span className="octicon octicon-book" /> README
      </Card.Header>
      <Card.Body>
        <Card.Section>
          <ReadmeContent />
        </Card.Section>
      </Card.Body>
      <Card.Footer>
        <GithubLink href={project.repository}>View on GitHub</GithubLink>
      </Card.Footer>
    </Card>
  )
}

ReadmeCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default ReadmeCard
