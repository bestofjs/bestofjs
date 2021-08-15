import {
  Box,
  Heading,
  Image,
  ListItem,
  Text,
  UnorderedList
} from '@chakra-ui/react'
import React from 'react'

import { useSelector } from 'containers/project-data-container'
import { StaticContentContainer } from 'containers/static-content-container'
import { CreateIssueLink } from 'components/user-requests/add-project/create-issue-link'
import { MainContent, PageHeader } from 'components/core'
import 'stylesheets/markdown-body.css'

const AboutPage = () => {
  const count = useSelector(
    state => Object.keys(state.entities.projects).length
  )
  const {
    repoURL,
    projectName,
    sponsorURL
  } = StaticContentContainer.useContainer()

  return (
    <MainContent>
      <PageHeader title="About" />
      <Box p={8} bg="var(--cardBackgroundColor)">
        <Heading size="md">Why {projectName}?</Heading>
        <Text mt={2}>
          Javascript, HTML and CSS are advancing faster than ever, we are going
          full speed on innovation.
          <br />
          Amazing open-source projects are released almost everyday.
        </Text>
        <UnorderedList mt={2}>
          <ListItem>
            How to stay up-to-date about the latest tendencies?
          </ListItem>
          <ListItem>
            How to check quickly the projects that really matter,{' '}
            <strong>now</strong> and not 6 months ago?
          </ListItem>
        </UnorderedList>
        <Text mt={2}>
          {projectName} was created in 2015 to address these questions.
        </Text>

        <Heading size="md" mt={4}>
          Concept
        </Heading>
        <Text mt={2}>
          Checking the number of stars on GitHub is a good way to check project
          popularity but it does not tell you when the stars have been added.{' '}
        </Text>
        <Text mt={2}>
          {projectName} takes &quot;snapshot&quot; of GitHub stars every day,
          for a curated list of {count} projects, to detect the trends over the
          last months.
        </Text>

        <Heading size="md" mt={4}>
          How it works
        </Heading>
        <Text mt={2}>
          First, a list of projects related to the web platform and
          Node.js(JavaScript, Typescript, but also HTML and CSS) is stored in
          our database.
        </Text>
        <Text mt={2}>
          Every time we find a new interesting project, we add it to the
          database.
        </Text>
        <Text mt={2}>
          Then everyday, an automatic task checks project data from GitHub, for
          every project stored and generates data consumed by the web
          application.
        </Text>
        <Text mt={2}>
          The web application displays the total number of stars and their
          variation over the last days.
        </Text>

        <Heading size="md" mt={4}>
          Do you want more projects?
        </Heading>
        <Text mt={2}>
          Rather than scanning all existing projects on GitHub, we focus on a
          curated list of projects we find &quot;interesting&quot;, based on our
          experience and on things we read on the internet.
        </Text>
        <Text mt={2}>As a result, some great projects must be missing!</Text>
        <Text mt={2}>
          Create a GitHub issue{' '}
          <CreateIssueLink type="ADD_PROJECT">here</CreateIssueLink> to suggest
          a new project to add.
        </Text>
        <Heading size="md" mt={4}>
          Show your support!
        </Heading>
        <Text mt={2}>
          If you find the application useful, you can star the project's
          repository on <a href={repoURL}>GitHub</a> or{' '}
          <a href={sponsorURL}>become a sponsor</a>.
        </Text>
        <Text mt={2}>
          Thank you for your support, We are all made of stars{' '}
          <Image
            display="inline"
            src="images/star.png"
            width="16px"
            height="16px"
            alt="star"
          />{' '}
          !
        </Text>
      </Box>
    </MainContent>
  )
}

export default AboutPage
