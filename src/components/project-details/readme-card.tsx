import React from 'react'
import styled from 'styled-components'

import { Card, Spinner } from '../core'
import { useFetchProjectReadMe } from '../../api/hooks'
import '../../stylesheets/markdown-body.css'

const GithubLink = styled.a``

type Props = { project: BestOfJS.Project }
export const ReadmeCard = ({ project }) => {
  return (
    <Card className="readme">
      <Card.Header>
        <span className="octicon octicon-book" /> README
      </Card.Header>
      <Card.Body>
        <Card.Section>
          <ReadmeContent project={project} />
        </Card.Section>
      </Card.Body>
      <Card.Footer>
        <GithubLink href={project.repository}>View on GitHub</GithubLink>
      </Card.Footer>
    </Card>
  )
}

const ReadmeContent = ({ project }: Props) => {
  const { data: html, error } = useFetchProjectReadMe(project)

  if (error) return <div>Unable to fetch README.md content from GitHub</div>

  if (!html) return <Spinner />

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
