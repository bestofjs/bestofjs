import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Animate } from 'react-simple-animate'

import { Avatar, StarDelta, getProjectAvatarUrl } from '../core/project'
import { Section } from '../core'
import { getFeaturedProjects } from '../../selectors'
import { getDeltaByDay } from '../../selectors/project'
import { useInterval } from '../../helpers/use-interval'
import { shuffle } from '../../helpers/shuffle'
import { useUpdateEffect } from '../../helpers/lifecycle-hooks'
import { useViewportSpy } from '../../helpers/use-viewport-spy'
import { useIsAway } from '../../helpers/use-page-events'

import './featured-projects.css'

export const RandomFeaturedProject = () => {
  const featuredProjects = useSelector(getFeaturedProjects)
  if (!featuredProjects.length) return null

  const projects = shuffle(featuredProjects).slice(0, 200)

  return <Slider projects={projects} duration={7000} limit={5} />
}

export const Slider = ({ projects, duration, limit }) => {
  const ref = useRef()
  const [pageNumber, setPageNumber] = useState(0)
  const isVisible = useViewportSpy(ref, { threshold: 0.75 })
  const [isHover, setIsHover] = useState(false)
  const isAway = useIsAway()
  const maxPageNumber = parseInt(projects.length / limit, 10) - 1

  const isPaused = !isVisible || isHover || isAway

  useInterval(
    () => {
      setPageNumber(page => (page >= maxPageNumber ? 0 : page + 1))
    },
    isPaused ? 0 : duration
  )

  return (
    <Section>
      <Section.Header icon="star">
        <Section.Title>Featured Projects</Section.Title>
        <Section.SubTitle>
          Random order <i>{isPaused ? '(Paused)' : '(Running...)'}</i>
        </Section.SubTitle>
      </Section.Header>
      <SliderContainer
        ref={ref}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        <FeaturedProjectGroup
          projects={projects}
          pageNumber={pageNumber}
          limit={limit}
          duration={duration}
          isPaused={isPaused}
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
  isPaused,
  ...otherProps
}) => {
  const start = pageNumber * limit
  const visibleProjects = projects.slice(start, start + limit)
  const isLastPage = (pageNumber + 1) * limit >= projects.length
  const nextProjects = isLastPage
    ? projects.slice(0, limit)
    : projects.slice(start + limit, start + 2 * limit)

  return (
    <ProjectSlider
      visibleProjects={visibleProjects}
      nextProjects={nextProjects}
      pageNumber={pageNumber}
      duration={duration}
      isPaused={isPaused}
    />
  )
}

const ProjectSlider = ({
  pageNumber,
  visibleProjects,
  nextProjects,
  duration,
  isPaused
}) => {
  const slots = Array.from(new Array(visibleProjects.length))

  return (
    <Container>
      <CountDown
        pageNumber={pageNumber}
        duration={isPaused ? 0 : duration}
        interval={1000}
      />
      <VisibleGroup>
        {slots
          .map((_, i) => visibleProjects[i])
          .map((project, i) => (
            <Animate
              key={project.slug}
              play
              delay={0.1 + i * 0.05}
              start={{ opacity: 0 }}
              end={{ opacity: 1 }}
            >
              <Project key={`visible-${i}`} project={project} />
            </Animate>
          ))}
      </VisibleGroup>
      <HiddenGroup>
        {slots
          .map((_, i) => nextProjects[i])
          .map((project, i) => (
            <img
              key={`next-${i}`}
              src={getProjectAvatarUrl(project)}
              alt="preload"
            />
          ))}
      </HiddenGroup>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const VisibleGroup = styled.div``

const HiddenGroup = styled.div`
  visibility: hidden;
  position: absolute;
  z-index: -1;
`

const Project = ({ project }) => (
  <ProjectContainer>
    <FeaturedProject project={project} />
  </ProjectContainer>
)

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
      <Avatar project={project} size={80} />
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

const CountDown = ({ pageNumber, duration, interval }) => {
  const steps = duration / interval
  const initialProgress = 100 / steps
  const [progress, setProgress] = useState(initialProgress)

  useInterval(
    () => {
      if (progress < 100) {
        setProgress(val => val + initialProgress)
      }
    },
    duration ? interval : 0
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
