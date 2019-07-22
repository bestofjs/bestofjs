import React from 'react'
import { Link } from 'react-router-dom'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
import HomeProjects from './HomeProjects'
import CreateIssueLink from '../user-requests/add-project/CreateIssueLink'
import Intro from './Intro'
import TagList from './TagList'
import Spinner from '../common/Spinner'
import Subscribe from './Subscribe'
import SectionTitle from './SectionTitle'
import SectionHeader from '../common/SectionHeader'

const Home = props => {
  log('Render the <Home> component')
  const { isLoggedin, pending, authActions, popularTags } = props
  return (
    <MainContent>
      <section className="no-card-container">
        <Intro />
      </section>
      <section>
        <SectionHeader icon="flame">
          <SectionHeader.Title>Today Hot Projects</SectionHeader.Title>
          <SectionHeader.SubTitle>
            by number of stars added yesterday
          </SectionHeader.SubTitle>
        </SectionHeader>
        {!pending ? <HomeProjects {...props} /> : <Spinner />}
      </section>
      <section>
        <SectionTitle className="no-card-container">
          Weekly Newsletter
        </SectionTitle>
        <Subscribe />
      </section>
      <section>
        <div className="no-card-container">
          <SectionTitle>
            Find the <i className="special">best</i> components to build amazing
            web applications!
          </SectionTitle>
          <p>
            View <Link to="/projects">ALL PROJECTS</Link> or check one of the
            popular tags:
          </p>
          {!pending > 0 ? <TagList tags={popularTags} /> : <Spinner />}
        </div>
      </section>
      <section>
        <MoreProjects
          handleClick={authActions.login}
          isLoggedin={isLoggedin}
          pending={pending}
        />
      </section>
    </MainContent>
  )
}

const MoreProjects = () => {
  return (
    <div className="no-card-container">
      <SectionTitle>Do you want more projects ?</SectionTitle>
      <CreateIssueLink
        type="ADD_PROJECT"
        showAsButton
        className={`button-outline block`}
      >
        <span className="octicon octicon-mark-github" /> Recommend a project on
        GitHub
      </CreateIssueLink>
    </div>
  )
}

export default Home
