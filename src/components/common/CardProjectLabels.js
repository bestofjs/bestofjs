import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  margin: -0.5em 0 0 -0.5em;
  > div {
    padding: 0.5em 0 0 0.5em;
    display: inline-block;
  }
`
const bestofjsOrange = '#e65100'
const bestofjsPurple = '#9E0142'

const ProjectLink = styled(Link)`
  display: inline-block;
  border: ${bestofjsOrange} solid 1px;
  padding: 0.5em;
  border-radius: 4px;
  font-size: 14px;
  &:hover {
    text-decoration: none;
    border-color: ${bestofjsPurple};
  }
`

const CardProjectLabels = ({ projects }) => {
  const validProjects = projects.filter(p => !!p)
  if (validProjects.length === 0) return null
  return (
    <div className="inner">
      <Container>
        {validProjects.map(p => (
          <div key={p.slug}>
            <ProjectLink to={`/projects/${p.slug}`}>{p.name}</ProjectLink>
          </div>
        ))}
      </Container>
    </div>
  )
}

export default CardProjectLabels
