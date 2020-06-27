import React from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import { Link } from 'react-router-dom'

import { useSelector } from 'containers/project-data-container'
import { getTotalNumberOfStars } from 'selectors'
import log from 'helpers/log'
import { HotProjects, NewestProjects } from './home-projects'
import { addProjectURL } from '../user-requests/add-project/CreateIssueLink'
import { TagLabelGroup } from '../tags/tag-label'
import { useStaticContent } from '../../static-content'
import { StarIcon } from '../core/icons'
import { ExternalLink, Button, MainContent, Section } from '../core'
import Intro from './Intro'
import { CompactTagList } from 'components/tags/tag-list'
import { RandomFeaturedProject } from './featured-projects'
import { Weekly } from './weekly-newsletter'
import { Row, MainColumn, RightSideBar } from './layout'

export const Home = props => {
  log('Render the <Home> component')
  const { pending, error, popularTags } = props

  if (error) {
    return (
      <MainContent>
        <p>
          Sorry, we are unable to fetch <i>Best of JavaScript</i> data.
        </p>
        <p>Please reach us on GitHub as soon as possible!</p>
      </MainContent>
    )
  }

  return (
    <MainContent>
      <Intro />
      <Section>
        <Row>
          <MainColumn>
            <HotProjects {...props} />
            {!pending && <NewestProjects {...props} />}
          </MainColumn>
          {!pending && (
            <RightSideBar>
              <RandomFeaturedProject />
              <Section.Header icon="tag">
                <Section.Title>Popular Tags</Section.Title>
              </Section.Header>
              <CompactTagList
                tags={popularTags}
                footer={
                  <Link to={`/tags/`} style={{ display: 'block' }}>
                    View all tags »
                  </Link>
                }
              />
            </RightSideBar>
          )}
        </Row>
      </Section>
      <Tags popularTags={popularTags} isPending={pending} />
      {!pending && <Weekly />}
      <StarOnGitHub />
      <MoreProjects />
    </MainContent>
  )
}

const Tags = ({ popularTags, isPending }) => {
  return (
    <SectionMobileOnly>
      <Section.Header icon="tag">
        <Section.Title>Popular tags</Section.Title>
      </Section.Header>
      {!isPending ? <TagLabelGroup tags={popularTags} /> : <>Loading...</>}
      <div style={{ paddingTop: '1rem', textAlign: 'center' }}>
        <Link to={`/tags/`}>View all tags »</Link>
      </div>
    </SectionMobileOnly>
  )
}

const SectionMobileOnly = styled(Section)`
  @media (min-width: 1000px) {
    display: none;
  }
`

const ResponsiveRow = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 700px) {
    align-items: center;
    flex-direction: row;
  }
  > *:last-child {
    padding-top: 1rem;
  }
`

const StarOnGitHub = () => {
  const { repo, projectName } = useStaticContent()

  return (
    <Section>
      <ResponsiveRow>
        <div style={{ flexGrow: 1 }}>
          <Section.Header icon="heart">
            <Section.Title>Do you find {projectName} useful?</Section.Title>
          </Section.Header>
          <p>
            Show your appreciation by starring the project on{' '}
            <ExternalLink url={repo}>GitHub</ExternalLink>, thank you!
          </p>
        </div>
        <div>
          <StarOnGitHubButton />
        </div>
      </ResponsiveRow>
    </Section>
  )
}

const StarOnGitHubButton = () => {
  const { repo } = useStaticContent()
  const project = useSelector(
    state => state.entities.projects['best-of-javascript']
  )
  if (!project) return null
  const stars = getTotalNumberOfStars(project)
  return (
    <Button
      as={'a'}
      style={{ fontSize: '1.2rem', display: 'flex' }}
      href={repo}
      target="_blank"
    >
      <span>Star on GitHub </span>
      <div
        style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}
        className="text-secondary"
      >
        {' '}
        {formatNumber(stars)}
        <StarIcon size={16} />
      </div>
    </Button>
  )
}

const formatNumber = number => numeral(number).format('')

const MoreProjects = () => {
  return (
    <Section>
      <Section.Header icon="plus">
        <Section.Title>Do you want more projects?</Section.Title>
      </Section.Header>
      <p>
        <i>Best of JavaScript</i> is a curated list of 1500 open-source projects
        related to the web platform and Node.js.
      </p>
      <p>
        If you want to suggest a new project, please click on the following
        link:{' '}
        <ExternalLink url={addProjectURL}>recommend a new project</ExternalLink>
        .
      </p>
    </Section>
  )
}
