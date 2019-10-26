import React from 'react'

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
        <ExternalLink url="https://weekly.bestofjs.org/">
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
  const { repo } = useStaticContent()
  return (
    <Section>
      <Section.Header icon="heart">
        <Section.Title>Do you find Best of JavaScript useful?</Section.Title>
      </Section.Header>
      <p>
        Show your appreciation by starring the project on{' '}
        <ExternalLink url={repo}>GitHub</ExternalLink>, thank you!
      </p>
    </Section>
  )
}

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
