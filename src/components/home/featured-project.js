import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Animate, useAnimate } from 'react-simple-animate'

import { Avatar, StarDelta, getProjectAvatarUrl } from '../core/project'
import { Section } from '../core'
import { getFeaturedProjects } from '../../selectors'
import { getDeltaByDay } from '../../selectors/project'
import { useInterval } from '../../helpers/use-interval'
import { shuffle } from '../../helpers/shuffle'
import { useUpdateEffect } from '../../helpers/lifecycle-hooks'

import './featured-projects.css'

export const RandomFeaturedProject = () => {
  const featuredProjects = useSelector(getFeaturedProjects)
  if (!featuredProjects.length) return null

  const projects = shuffle(featuredProjects)

  return <Slider projects={projects} duration={5000} limit={5} />
}

export const Slider = ({ projects, duration: defaultDuration, limit }) => {
  const [pageNumber, setPageNumber] = useState(0)
  const [duration, setDuration] = useState(defaultDuration)
  const maxPageNumber = parseInt(projects.length / limit, 10) - 1

  useInterval(() => {
    setPageNumber(page => (page >= maxPageNumber ? 0 : page + 1))
  }, duration)

  return (
    <Section>
      <Section.Header icon="star">
        <Section.Title>Featured Projects</Section.Title>
        <Section.SubTitle>
          Random order <i>{duration === 0 ? '(Paused)' : '(Running...)'}</i>
        </Section.SubTitle>
      </Section.Header>
      <SliderContainer
        onMouseEnter={() => {
          setDuration(0)
        }}
        onMouseLeave={() => {
          setDuration(defaultDuration)
        }}
      >
        <FeaturedProjectGroup
          projects={projects}
          pageNumber={pageNumber}
          limit={limit}
          duration={duration}
        />
      </SliderContainer>
    </Section>
  )
}

const SliderContainer = styled.div`
  margin-bottom: 2rem;
  background-color: white;
`

export const FeaturedProjectGroup = ({
  projects,
  pageNumber,
  limit,
  duration,
  ...otherProps
}) => {
  const start = pageNumber * limit
  const visibleProjects = projects.slice(start, start + limit)

  const { play, style } = useAnimate({
    start: { opacity: 0 },
    end: { opacity: 1 }
  })

  useEffect(
    () => {
      const nextProjects = projects.slice(start + limit, start + 2 * limit)
      preloadLogos(nextProjects)
    },
    [pageNumber] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useUpdateEffect(
    () => {
      play(true)
    },
    [pageNumber]
  )

  return (
    <>
      <CountDown pageNumber={pageNumber} duration={duration} />
      {visibleProjects.map((project, index) => (
        <ProjectContainer key={project.slug}>
          <Animate
            play
            delay={0.1 + index * 0.05}
            start={{ opacity: 0 }}
            end={{ opacity: 1 }}
          >
            <FeaturedProject
              style={style}
              key={project.slug}
              project={project}
              {...otherProps}
            />
          </Animate>
        </ProjectContainer>
      ))}
    </>
  )
}

const ProjectContainer = styled.div`
  border-bottom: 1px dashed #cecece;
`

export const FeaturedProject = ({
  project,
  onMouseEnter,
  onMouseLeave,
  sortOptionId = 'daily'
}) => {
  const history = useHistory()
  return (
    <Box onClick={() => history.push(`/projects/${project.slug}`)}>
      <Avatar project={project} size={100} />
      <FeaturedProjectName>
        <div className="title">{project.name}</div>
        <div className="stars">
          <StarDelta
            value={getDeltaByDay(sortOptionId)(project)}
            average={sortOptionId !== 'daily'}
          />
        </div>
      </FeaturedProjectName>
    </Box>
  )
}

const Box = styled.div`
  background-color: white;
  margin-bottom: 0rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  :hover {
    background-color: #f9f5f2;
  }
  .title {
    margin-bottom: 0.5rem;
  }
  .stars {
    font-size: 1.25rem;
  }
`

const FeaturedProjectName = styled.div`
  flex-grow: 1;
  text-align: center;
`

const CountDown = ({ pageNumber, duration = 5000, steps = 5 }) => {
  const initialProgress = 100 / steps
  const [progress, setProgress] = useState(initialProgress)
  const delay = duration / steps

  useInterval(
    () => {
      if (progress < 100) {
        setProgress(val => val + initialProgress)
      }
    },
    duration ? delay : 0
  )

  useUpdateEffect(
    () => {
      setProgress(initialProgress)
    },
    [pageNumber, duration]
  )
  return <ProgressBar progress={progress} />
}

const ProgressBar = ({ progress }) => (
  <div className="progress-bar">
    <div className="progress" style={{ width: progress + `%` }} />
  </div>
)

function preloadLogos(projects) {
  projects.forEach(loadProjectImage)
}

function loadProjectImage(project) {
  const url = getProjectAvatarUrl(project)
  const image = new Image()
  image.src = url
}
