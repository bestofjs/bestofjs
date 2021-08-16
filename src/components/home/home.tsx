import React from 'react'
import styled from '@emotion/styled'
import numeral from 'numeral'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Box, Link, Heading, Center } from '@chakra-ui/react'
import { GoTag, GoHeart, GoPlus } from 'react-icons/go'

import { useSelector } from 'containers/project-data-container'
import { StaticContentContainer } from 'containers/static-content-container'
import { getTotalNumberOfStars } from 'selectors'
import log from 'helpers/log'
import { addProjectURL } from 'components/user-requests/add-project/create-issue-link'
import { ProjectTagGroup } from 'components/tags/project-tag'
import { StarIcon } from 'components/core/icons'
import { ExternalLink, MainContent, Section } from 'components/core'
import { CompactTagList } from 'components/tags/tag-list'
import { HotProjects, NewestProjects } from './home-projects'
import { RandomFeaturedProject } from './featured-projects'
import { Row, MainColumn, RightSideBar } from './layout'
import { HomeMonthlyRankings } from './home-monthly-rankings'

export const Home = props => {
  log('Render the <Home> component')
  const { pending, popularTags } = props

  return (
    <MainContent>
      <Heading as="h1" mb={4} fontWeight="normal">
        The best of JavaScript, HTML and CSS
      </Heading>
      <Section>
        <Row>
          <MainColumn>
            <HotProjects {...props} />
            {!pending && <NewestProjects {...props} />}
          </MainColumn>
          {!pending && (
            <RightSideBar>
              <RandomFeaturedProject />
              <Section.Header icon={<GoTag fontSize={32} />}>
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
      {!pending && <HomeMonthlyRankings />}
      <StarOnGitHub />
      <MoreProjects />
    </MainContent>
  )
}

const Tags = ({ popularTags, isPending }) => {
  return (
    <SectionMobileOnly>
      <Section.Header icon={<GoTag fontSize={32} />}>
        <Section.Title>Popular tags</Section.Title>
      </Section.Header>
      {!isPending ? <ProjectTagGroup tags={popularTags} /> : <>Loading...</>}
      <Box pt={4} textAlign="center">
        <Link as={RouterLink} to={`/tags/`}>
          View all tags »
        </Link>
      </Box>
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
  const {
    repoURL,
    projectName,
    sponsorURL
  } = StaticContentContainer.useContainer()

  return (
    <Section>
      <ResponsiveRow>
        <div style={{ flexGrow: 1 }}>
          <Section.Header icon={<GoHeart fontSize={32} />}>
            <Section.Title>Do you find {projectName} useful?</Section.Title>
          </Section.Header>
          <p>
            Show your appreciation by starring the project on{' '}
            <ExternalLink url={repoURL}>GitHub</ExternalLink>, or becoming a{' '}
            <ExternalLink url={sponsorURL}>sponsor</ExternalLink>.
          </p>
          <p>Thank you for your support!</p>
        </div>
        <div>
          <StarOnGitHubButton />
          <br />
          <SponsorButton />
        </div>
      </ResponsiveRow>
    </Section>
  )
}

const StarOnGitHubButton = () => {
  const { repoURL } = StaticContentContainer.useContainer()
  const project = useSelector(
    state => state.entities.projects['best-of-javascript']
  )
  if (!project) return null
  const stars = getTotalNumberOfStars(project)
  return (
    <BigButtonLink
      href={repoURL}
      target="_blank"
      addOn={
        <Center>
          {formatNumber(stars)} <StarIcon size={24} />
        </Center>
      }
    >
      Star on GitHub
    </BigButtonLink>
  )
}

const SponsorButton = () => {
  const { sponsorURL } = StaticContentContainer.useContainer()

  return (
    <BigButtonLink
      href={sponsorURL}
      target="_blank"
      addOn={<GoHeart size={20} />}
    >
      Sponsor
    </BigButtonLink>
  )
}

const BigButtonLink = ({ addOn, children, ...props }: { addOn: React.JSX }) => (
  <Button
    as="a"
    display="flex"
    fontSize="1.2rem"
    variant="outline"
    className="button-link"
    {...props}
  >
    {children}
    <Box
      ml={2}
      sx={{
        '.button-link:hover &': {
          color: 'var(--bestofjsOrange)'
        }
      }}
    >
      {addOn}
    </Box>
  </Button>
)

const formatNumber = number => numeral(number).format('')

const MoreProjects = () => {
  const { projectName } = StaticContentContainer.useContainer()

  return (
    <Section>
      <Section.Header icon={<GoPlus fontSize={32} />}>
        <Section.Title>Do you want more projects?</Section.Title>
      </Section.Header>
      <p>
        <i>{projectName}</i> is a curated list of about 1500 open-source
        projects related to the web platform and Node.js.
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
