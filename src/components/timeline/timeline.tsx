import React from 'react'
import { Link } from 'react-router-dom'
import {
  VerticalTimeline,
  VerticalTimelineElement
} from 'react-vertical-timeline-component'
import './vertical-timeline.css'
import './vertical-timeline-element.css'
import tinytime from 'tinytime'
import styled from '@emotion/styled'

import featuredProjects from './featured-projects.json'

import { findProjectsByIds } from 'selectors'
import { useSelector } from 'containers/project-data-container'
import { Avatar } from 'components/core/project'
import { ProjectTagGroup } from 'components/tags/project-tag'

type Project = BestOfJS.Project & { date: Date; comments: string[] }

const template = tinytime('{MMMM} {YYYY}')

function useTimelineProjects() {
  const projects: BestOfJS.Project[] = useSelector(
    findProjectsByIds(featuredProjects.map(({ slug }) => slug))
  )
  return featuredProjects.map(({ slug, date, comments }) => {
    const project: BestOfJS.Project | undefined = projects.find(
      (project) => project.slug === slug
    )
    if (!project) return null
    return {
      comments: comments || [],
      date: date || new Date(project.created_at),
      ...project
    }
  })
}

export const Timeline = () => {
  const projects = useTimelineProjects()

  return (
    <Wrapper>
      <VerticalTimeline>
        {(projects as Project[]).map((project, index) => (
          <VerticalTimelineElement
            key={project.slug}
            date={template.render(new Date(project.date!))}
            iconStyle={{
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5
            }}
            icon={<Avatar project={project} size={50} />}
          >
            <h4
              style={{
                fontSize: '1.5rem',
                fontWeight: 'normal',
                display: 'flex'
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Link to={`/projects/${project.slug}`}>{project.name}</Link>
              </div>
              <div style={{ color: '#bb967c' }}>#{index + 1}</div>
            </h4>
            {project.comments.map((comment, index) => (
              <p key={index}>{comment}</p>
            ))}
            <div style={{ paddingTop: '1rem' }}>
              <span>Trend this month: </span>+{project.trends.monthly}☆ on
              GitHub
            </div>
            <div style={{ paddingTop: '1rem' }}>
              <ProjectTagGroup tags={project.tags.slice(0, 3)} />
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border: 3px solid white;
  border-radius: 5px;
  overflow-x: hidden;
`
