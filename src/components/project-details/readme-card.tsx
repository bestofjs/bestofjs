import React from 'react'
import styled from '@emotion/styled'
import { GoBook } from 'react-icons/go'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardSection,
  Spinner
} from '../core'
import { useFetchProjectReadMe } from '../../api/hooks'
import '../../stylesheets/markdown-body.css'

const GithubLink = styled.a``

type Props = { project: BestOfJS.Project }
export const ReadmeCard = ({ project }) => {
  return (
    <Card className="readme">
      <CardHeader>
        <GoBook className="icon" size={20} />
        README
      </CardHeader>
      <CardBody>
        <CardSection>
          <ReadmeContent project={project} />
        </CardSection>
      </CardBody>
      <CardFooter>
        <GithubLink href={project.repository}>View on GitHub</GithubLink>
      </CardFooter>
    </Card>
  )
}

const ReadmeContent = ({ project }: Props) => {
  const { data: html, error } = useFetchProjectReadMe(project)

  if (error) return <div>Unable to fetch README.md content from GitHub</div>

  if (!html) return <Spinner />

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
