import React from 'react'

import { useSelector } from 'containers/project-data-container'
import { StaticContentContainer } from 'containers/static-content-container'
import { CreateIssueLink } from 'components/user-requests/add-project/create-issue-link'
import { Card, MainContent } from 'components/core'
import 'stylesheets/markdown-body.css'
import { defaultHelmetProps } from 'constants/constants'
import { Helmet } from 'react-helmet'

const AboutPage = () => {
  const count = useSelector(
    state => Object.keys(state.entities.projects).length
  )
  const {
    repoURL,
    projectName,
    sponsorURL
  } = StaticContentContainer.useContainer()
  const title = 'About'

  return (
    <MainContent style={{ paddingTop: '2rem' }}>
      <Helmet {...defaultHelmetProps}>
        <title>{title}</title>
      </Helmet>
      <Card className="card markdown-body" style={{ padding: '2rem' }}>
        <h1>{title}</h1>
        <h2>Why {projectName}?</h2>
        <p>
          Javascript, HTML and CSS are advancing faster than ever, we are going
          full speed on innovation.
          <br />
          Amazing open-source projects are released almost everyday.
        </p>
        <ul>
          <li>How to stay up-to-date about the latest tendencies?</li>
          <li>
            How to check quickly the projects that really matter,{' '}
            <i className="special">now</i> and not 6 months ago?
          </li>
        </ul>
        <p>{projectName} was created in 2015 to address these questions.</p>

        <h2>Concept</h2>
        <p>
          Checking the number of stars on GitHub is a good way to check project
          popularity but it does not tell you when the stars have been added.{' '}
        </p>
        <p>
          {projectName} takes &quot;snapshot&quot; of GitHub stars every day,
          for a curated list of {count} projects, to detect the trends over the
          last months.
        </p>

        <h2>How it works</h2>
        <p>
          First, a list of projects related to the web platform and
          Node.js(JavaScript, Typescript, but also HTML and CSS) is stored in
          our database.
        </p>
        <p>
          Every time we find a new interesting project, we add it to the
          database.
        </p>
        <p>
          Then everyday, an automatic task checks project data from GitHub, for
          every project stored and generates data consumed by the web
          application.
        </p>
        <p>
          The web application displays the total number of stars and their
          variation over the last days.
        </p>

        <h2>Do you want more projects?</h2>
        <p>
          Rather than scanning all existing projects on GitHub, we focus on a
          curated list of projects we find &quot;interesting&quot;, based on our
          experience and on things we read on the internet.
        </p>
        <p>As a result, some great projects must be missing!</p>
        <p>
          Create a GitHub issue{' '}
          <CreateIssueLink type="ADD_PROJECT">here</CreateIssueLink> to suggest
          a new project to add.
        </p>
        <h2>Show your support!</h2>
        <p>
          If you find the application useful, you can star the project's
          repository on <a href={repoURL}>GitHub</a> or{' '}
          <a href={sponsorURL}>become a sponsor</a>.
        </p>
        <p>
          We are all made of stars{' '}
          <img src="images/star.png" width="16" height="16" alt="star" /> !
        </p>
        <p>Thank you for your support!</p>
      </Card>
    </MainContent>
  )
}

export default AboutPage
