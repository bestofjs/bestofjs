import React, { useState, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { Animate } from 'react-simple-animate'
import { useInterval } from 'react-use'
import { GoStar } from 'react-icons/go'

import { Box, Button, Link } from 'components/core'
import { shuffle } from 'helpers/shuffle'
import { useUpdateEffect } from 'helpers/lifecycle-hooks'
import { useViewportSpy } from 'helpers/use-viewport-spy'
import { useIsDocumentVisible } from 'helpers/use-page-events'
import { useSelector } from 'containers/project-data-container'
import { getFeaturedProjects, getDeltaByDay } from 'selectors'
import { Avatar, StarDelta, getProjectAvatarUrl } from 'components/core/project'
import { Section, useColorMode } from 'components/core'
import { ProjectTag } from 'components/tags/project-tag'
import { ProgressBar } from './progress-bar'

export const RandomFeaturedProject = () => {
  const featuredProjects = useSelector(getFeaturedProjects('total'))

  // don't shuffle projects when the component updates after color mode switch
  const projects = React.useMemo(
    () => shuffle<BestOfJS.Project>(featuredProjects).slice(0, 200),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

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
      setPageNumber((page) => (page >= maxPageNumber ? 0 : page + 1))
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
      <div
        ref={ref as any}
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
      </div>
      <Footer>
        <Button as={RouterLink} to="/featured" variant="link">
          View more »
        </Button>
      </Footer>
    </Section>
  )
}

const Footer = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--cardBackgroundColor);
  border-bottom: 1px dashed var(--boxBorderColor);
  text-align: center;
  a {
    display: block;
    font-family: var(--buttonFontFamily);
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
  const { colorMode } = useColorMode()

  return (
    <Box position="relative">
      <CountDown
        pageNumber={pageNumber}
        duration={duration}
        interval={1000}
        isPaused={isPaused}
      />
      <Box>
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
      </Box>
      <HiddenGroup>
        {slots
          .map((_, i) => nextProjects[i])
          .map((project, i) => (
            <img
              key={`next-${i}`}
              src={getProjectAvatarUrl(project, 80, colorMode)}
              alt="preload"
            />
          ))}
      </HiddenGroup>
    </Box>
  )
}

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
    <ProjectBox>
      <Avatar project={project} size={80} />
      <FeaturedProjectName>
        <Link
          as={RouterLink}
          className="title"
          to={`/projects/${project.slug}`}
        >
          {project.name}
        </Link>
        <div className="stars">
          <StarDelta
            value={getDeltaByDay(sortOptionId)(project)}
            average={sortOptionId !== 'daily'}
          />
        </div>
        <ProjectTag tag={project.tags[0]} />
      </FeaturedProjectName>
    </ProjectBox>
  )
}

const ProjectBox = styled.div`
  background-color: var(--cardBackgroundColor);
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
  a {
    font-family: var(--buttonFontFamily);
  }
`

const CountDown = ({ pageNumber, duration, interval, isPaused }) => {
  const steps = duration / interval
  const initialProgress = 100 / steps
  const [progress, setProgress] = useState(initialProgress)

  useInterval(
    () => {
      if (progress < 100) {
        setProgress((val) => val + initialProgress)
      }
    },
    !isPaused ? interval : null
  )

  useUpdateEffect(() => {
    setProgress(initialProgress)
  }, [pageNumber])

  return <ProgressBar progress={progress} />
}
