import React from 'react'
import { Link } from 'react-router-dom'

import { Tag, TagLabel, Wrap, WrapItem } from 'components/core'

export const CardProjectLabels = ({ projects }) => {
  const validProjects = projects.filter((project) => !!project)
  if (validProjects.length === 0) return null

  return (
    <div className="inner">
      <Wrap>
        {validProjects.map((project) => (
          <WrapItem key={project.slug}>
            <Link to={`/projects/${project.slug}`}>
              <Tag variant="outline" colorScheme="orange" size="lg">
                <TagLabel>{project.name}</TagLabel>
              </Tag>
            </Link>
          </WrapItem>
        ))}
      </Wrap>
    </div>
  )
}
