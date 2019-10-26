import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import numeral from 'numeral'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
import HomeProjects from './HomeProjects'
import { addProjectURL } from '../user-requests/add-project/CreateIssueLink'
import Intro from './Intro'
import Spinner from '../common/Spinner'
import TagLabelGroup from '../tags/TagLabelGroup'
import { ExternalLink } from '../core/typography'
import { Section } from '../core/section'
import fromNow from '../../helpers/fromNow'
import { useStaticContent } from '../../static-content'
import { getTotalNumberOfStars } from '../../selectors/project'
import { StarIcon } from '../core/icons'
import { Button } from '../core'

const Home = props => {
  log('Render the <Home> component')
  const { pending, authActions, popularTags } = props
  return (
    <MainContent>
      <Intro />
      <Section>
        <Section.Header icon="flame">
          <Section.Title>Today Hot Projects</Section.Title>
          <Section.SubTitle>
            by number of stars added yesterday
          </Section.SubTitle>
        </Section.Header>
        {!pending ? <HomeProjects {...props} /> : <Spinner />}
      </Section>
      <Section>
        <Section.Header icon="tag">
          <Section.Title>Popular tags</Section.Title>
        </Section.Header>
        {!pending ? <TagLabelGroup tags={popularTags} /> : <>Loading...</>}
      </Section>
      <News
        date={new Date('2019-10-20T13:00:00.000Z')}
        title={'Best of JavaScript is changing!'}
      >
        Check our latest post from{' '}
        <ExternalLink url="https://weekly.bestofjs.org/issues/73">
          Weekly Best of JavaScript
        </ExternalLink>{' '}
        to know more about the new search engine.
      </News>
      <StarOnGitHub />
      <MoreProjects handleClick={authActions.login} pending={pending} />
    </MainContent>
  )
}

const News = ({ children, title, date, ...props }) => {
  return (
    <Section {...props}>
      <Section.Header icon="megaphone">
        <Section.Title>{title}</Section.Title>
        <Section.SubTitle>PUBLISHED {fromNow(date)}</Section.SubTitle>
      </Section.Header>
      {children}
    </Section>
  )
}

const StarOnGitHub = () => {
  const { repo, projectName } = useStaticContent()
  const Row = styled.div`
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

  return (
    <Section>
      <Row>
        <div style={{ flexGrow: 1 }}>
          <Section.Header icon="heart">
            <Section.Title>Do you find {projectName} useful?</Section.Title>
          </Section.Header>
          <p>
            Show your appreciation by starring the project on{' '}
            <ExternalLink url={repo}>GitHub</ExternalLink>, thank you!
          </p>
        </div>
        <div style={{}}>
          <StarOnGitHubButton />
        </div>
      </Row>
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

export default Home
