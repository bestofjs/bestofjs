import React from 'react'

import MainContent from '../common/MainContent'
import log from '../../helpers/log'
import CreateIssueLink from '../user-requests/add-project/CreateIssueLink'
import Card from '../common/Card'

import '../../stylesheets/markdown-body.css'

const About = ({ staticContent, count }) => {
  log('Render the <About> component')
  const { repo, projectName } = staticContent
  return (
    <MainContent style={{ paddingTop: '2rem' }}>
      <Card className="card markdown-body" style={{ padding: '2rem' }}>
        <h1>About</h1>
        <h2>Why {projectName} ?</h2>
        <p>
          Javascript, HTML and CSS are advancing faster than ever, we are going
          fullspeed on innovation.<br />
          Amazing open-source projects are released almost everyday.
        </p>
        <ul>
          <li>How to stay up-to-date about the latest tendencies ?</li>
          <li>
            How to check quickly the projects that really matter,{' '}
            <i className="special">now</i> and not 6 months ago ?
          </li>
        </ul>
        <p>{projectName} was creaded to address these questions.</p>

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
          First, a list of projects related to the web platform (JavaScript of
          course but also HTML and CSS) is stored in a database.
        </p>
        <p>Everytime we find a new project, we add it to the database.</p>
        <p>
          Then everyday, an automatic task checks project data from GitHub, for
          every project stored and generates data consumed by the web
          application.
        </p>
        <p>
          The web application displays the total number of stars and their
          variation over the last days.
        </p>

        <h2>Do you want more projects ?</h2>
        <p>
          Rather than scanning all existing projects on GitHub, We decided to
          focus on a curated list of projets we find &quot;interesting&quot;,
          based on our experience and on things we read on the internet.
        </p>
        <p>As a result, some great projects must be missing!</p>
        <p>
          Create a GitHub issue <CreateIssueLink>here</CreateIssueLink> to
          suggest a new project to add.
        </p>
        <h2>Show your support!</h2>
        <p>
          If you like the application, please star the project on{' '}
          <a href={repo}>GitHub</a>...
        </p>
        <p>
          ...we are all made of stars{' '}
          <img src="images/star.png" width="16" height="16" alt="star" /> !
        </p>
        <p>Thank you for your support!</p>
      </Card>
    </MainContent>
  )
}

export default About
