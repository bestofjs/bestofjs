import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Animate } from 'react-simple-animate'
import { GoStar } from 'react-icons/go'

import { shuffle } from 'helpers/shuffle'
import { useUpdateEffect } from 'helpers/lifecycle-hooks'
import { useViewportSpy } from 'helpers/use-viewport-spy'
import { useIsDocumentVisible } from 'helpers/use-page-events'
import { useInterval } from 'react-use'
import { useSelector } from 'containers/project-data-container'
import { getFeaturedProjects, getDeltaByDay } from 'selectors'
import { Avatar, StarDelta, getProjectAvatarUrl } from 'components/core/project'
import { Section } from 'components/core'
import { TagLabel } from 'components/tags/tag-label'
import { ProgressBar } from './progress-bar'

export const RandomFeaturedProject = () => {
  const featuredProjects = useSelector(getFeaturedProjects('total'))
  if (!featuredProjects.length) return null

  const projects = shuffle<BestOfJS.Project>(featuredProjects).slice(0, 200)

  return <Slider projects={projects} duration={7000} limit={5} />
}

export const Slider = ({
  projects,
  duration,
  limit
}: {
  projects: BestOfJS.Project[]
  duration: number
  limit: number
}) => {
  const ref = useRef()
  const [pageNumber, setPageNumber] = useState(0)
  const isVisible = useViewportSpy(ref)
  const [isHover, setIsHover] = useState(false)
  const isDocumentVisible = useIsDocumentVisible()
  const maxPageNumber = Math.floor(projects.length / limit) - 1

  const isPaused = !isVisible || isHover || !isDocumentVisible

  useInterval(
    () => {
      setPageNumber(page => (page >= maxPageNumber ? 0 : page + 1))
    },
    isPaused ? null : duration
  )

  return (
    <Section>
      <Section.Header icon={<GoStar fontSize={32} />}>
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
      <Footer>
        <Link to="/featured">View more »</Link>
      </Footer>
    </Section>
  )
}

const SliderContainer = styled.div`
  background-color: white;
`

const Footer = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px dashed var(--boxBorderColor);
  text-align: center;
  a {
    display: block;
  }
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
        duration={isPaused ? null : duration}
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
  border-bottom: 1px dashed var(--boxBorderColor);
`

export const FeaturedProject = ({ project }) => {
  const sortOptionId = 'daily'
  return (
    <Box>
      <Avatar project={project} size={80} />
      <FeaturedProjectName>
        <Link className="title" to={`/projects/${project.slug}`}>
          {project.name}
        </Link>
        <div className="stars">
          <StarDelta
            value={getDeltaByDay(sortOptionId)(project)}
            average={sortOptionId !== 'daily'}
          />
        </div>
        <TagLabel tag={project.tags[0]} />
      </FeaturedProjectName>
    </Box>
  )
}

const Box = styled.div`
  background-color: white;
  margin-bottom: 0rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  .title {
    margin-bottom: 0.5rem;
    display: block;
    width: 100%;
  }
  .stars {
    margin-bottom: 0.5rem;
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

  useUpdateEffect(() => {
    setProgress(initialProgress)
  }, [pageNumber, duration])

  return <ProgressBar progress={progress} />
}
