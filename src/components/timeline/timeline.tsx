import React from 'react'
import { Link } from 'react-router-dom'
// import d3KitTimeline from 'd3kit-timeline'
import {
  VerticalTimeline,
  VerticalTimelineElement
} from 'react-vertical-timeline-component'
import './vertical-timeline.css'
import './vertical-timeline-element.css'
import tinytime from 'tinytime'
import styled from 'styled-components'

import featuredProjects from './featured-projects.json'

import { allProjects } from 'selectors'
// import { useSearch } from 'components/search'
import { useSelector } from 'containers/project-data-container'
import { Avatar } from 'components/core/project'

type Project = BestOfJS.Project & { date: Date; comments: string[] }

const template = tinytime('{MMMM} {YYYY}')

function useFeaturedProjects() {
  const projects: BestOfJS.Project[] = useSelector(
    allProjects
    // findProjectsByIds(featuredProjectIds)
  )
  return featuredProjects.map(({ slug, date, comments }) => {
    const project: BestOfJS.Project | undefined = projects.find(
      project => project.slug === slug
    )
    if (!project) return null
    return {
      slug,
      comments: comments || [],
      date: date || new Date(project.created_at),
      ...project
    }
  })
}

export const Timeline = () => {
  // const ref = useRef<HTMLDivElement | null>(null)
  const projects = useFeaturedProjects()
  // const data = projects.slice(0, 20).map(project => ({
  //   time: new Date(project.created_at),
  //   name: project.name
  // }))
  // useEffect(() => {
  //   if (!data.length) return
  //   console.log('> init', ref.current, data)
  //   var chart = new d3KitTimeline(
  //     ref.current,
  //     {
  //       direction: 'right',
  //       initialWidth: 400,
  //       initialHeight: 250,
  //       textFn: function(d) {
  //         return d.time.getFullYear() + ' - ' + d.name
  //       }
  //     },
  //     [data]
  //   )

  //   chart.data(data).resizeToFit()
  // })

  return (
    <Wrapper>
      <VerticalTimeline>
        {(projects as Project[]).map(project => (
          <VerticalTimelineElement
            key={project}
            date={<b>{template.render(new Date(project.date!))}</b>}
            iconStyle={{
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
            icon={<Avatar project={project} size={50} />}
          >
            <h4>
              <Link to={`/projects/${project.slug}`}>{project.name}</Link>
            </h4>
            {project.comments.map((comment, index) => (
              <p key={index}>{comment}</p>
            ))}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border: 1px dashed var(--iconColor);
`
