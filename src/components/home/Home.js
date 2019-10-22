import React from 'react'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
import HomeProjects from './HomeProjects'
import { addProjectURL } from '../user-requests/add-project/CreateIssueLink'
import Intro from './Intro'
import Spinner from '../common/Spinner'
import Subscribe from './Subscribe'
import SectionTitle from './SectionTitle'
import SectionHeader from '../common/SectionHeader'
import TagLabelGroup from '../tags/TagLabelGroup'
import News from './News'
import { ExternalLink } from '../core/typography'

const Home = props => {
  log('Render the <Home> component')
  const { pending, authActions, popularTags } = props
  return (
    <MainContent>
      <section>
        <Intro />
        <SectionHeader icon="flame">
          <SectionHeader.Title>Today Hot Projects</SectionHeader.Title>
          <SectionHeader.SubTitle>
            by number of stars added yesterday
          </SectionHeader.SubTitle>
        </SectionHeader>
        {!pending ? <HomeProjects {...props} /> : <Spinner />}
      </section>
      {false && (
        <section>
          <SectionTitle className="no-card-container">
            Weekly Newsletter
          </SectionTitle>
          <Subscribe />
        </section>
      )}
      <section>
        <div className="no-card-container">
          <SectionHeader icon="tag">
            <SectionHeader.Title>Popular tags</SectionHeader.Title>
          </SectionHeader>
          {!pending ? <TagLabelGroup tags={popularTags} /> : <>Loading...</>}
        </div>
      </section>
      <section>
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
      </section>
      <section>
        <MoreProjects handleClick={authActions.login} pending={pending} />
      </section>
    </MainContent>
  )
}

const MoreProjects = () => {
  return (
    <div className="no-card-container">
      <SectionHeader icon="plus">
        <SectionHeader.Title>Do you want more projects?</SectionHeader.Title>
      </SectionHeader>
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
    </div>
  )
}

export default Home
