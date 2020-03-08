import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Avatar, StarDelta } from '../core/project'
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

  return <Slider projects={projects} limit={5} />
}

export const Slider = ({ projects, limit }) => {
  const [pageNumber, setPageNumber] = useState(0)
  const defaultDuration = 5000
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
          Random order <i>{duration === 0 ? 'Paused' : '(Running...)'}</i>
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

  return (
    <>
      <CountDown pageNumber={pageNumber} duration={duration} />
      <TransitionGroup className="item-list">
        {visibleProjects.map(project => (
          <CSSTransition timeout={1000} classNames="item" key={project.slug}>
            <FeaturedProject
              key={project.slug}
              project={project}
              {...otherProps}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </>
  )
}

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
        <StarDelta
          value={getDeltaByDay(sortOptionId)(project)}
          average={sortOptionId !== 'daily'}
        />
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
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #cecece;
  .title {
    margin-bottom: 0.5rem;
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
