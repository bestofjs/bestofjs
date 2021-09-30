import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { GoMarkGithub } from 'react-icons/go'
import tinytime from 'tinytime'

import { useSelector } from 'containers/project-data-container'
import { fromNow } from 'helpers/from-now'
import { StaticContentContainer } from 'containers/static-content-container'
import { ExternalLinkIcon } from 'components/core/icons'
import { Box, Flex } from 'components/core'

const template = tinytime('{H}:{mm}', { padHours: true })

export const Footer = () => {
  const lastUpdate = useSelector((state) => state.meta.lastUpdate)
  const { repoURL, projectName, risingStarsURL, stateOfJSURL, version } =
    StaticContentContainer.useContainer()

  return (
    <StyledFooter id="footer">
      <div className="container">
        <Section>
          <div className="grid">
            <div>
              <Link to="/">
                <img
                  src="/images/logo.png"
                  alt="Best of JS logo"
                  width="100"
                  height="56"
                />
              </Link>
              <Flex mt={8} alignItems="center">
                <a href={repoURL} aria-label="GitHub">
                  <GoMarkGithub fontSize="32px" />
                </a>
                <Box ml={2}>v{version}</Box>
              </Flex>
            </div>
            <div>
              <LinkGroup title="DIRECT LINKS">
                <List>
                  <ListItem>
                    <DirectLink to="/projects">Projects</DirectLink>
                    All projects tracked by <i>{projectName}</i>
                  </ListItem>
                  <ListItem>
                    <DirectLink to="/tags">Tags</DirectLink>
                    The +180 tags manually picked to classify all projects
                  </ListItem>
                  <ListItem>
                    <DirectLink to="/hall-of-fame">Hall of Fame</DirectLink>
                    Some of the most influent members of the community
                  </ListItem>
                  <ListItem>
                    <DirectLink to="/timeline">Timeline</DirectLink>
                    2006 - 2020 in 20 projects, a short story from jQuery to
                    Rome
                  </ListItem>
                  <ListItem>
                    <DirectLink to="/about">About</DirectLink>
                    Why do we track the best of JavaScript since 2015
                  </ListItem>
                </List>
              </LinkGroup>
            </div>
            <div>
              <LinkGroup title="RELATED PROJECTS">
                <List>
                  <ListItem>
                    <ListItemLink href={risingStarsURL}>
                      JavaScript Rising Stars
                      <ExternalLinkIcon />
                    </ListItemLink>
                    <p>Our annual round-up about the JavaScript landscape</p>
                    <a href={risingStarsURL}>
                      <img
                        src="https://risingstars.js.org/img/2020/en/rising-stars.png"
                        width="70%"
                        alt="Rising Stars"
                      />
                    </a>
                  </ListItem>
                  <ListItem>
                    <ListItemLink href={stateOfJSURL}>
                      State of JS
                      <ExternalLinkIcon />
                    </ListItemLink>
                    <p>The biggest annual JavaScript-specific survey</p>
                  </ListItem>
                </List>
              </LinkGroup>
            </div>
          </div>
        </Section>
        <Separator />
        <Section className="footer-bottom">
          {lastUpdate && (
            <p>
              Data is updated from GitHub everyday, the last update was{' '}
              {fromNow(lastUpdate)} (at {template.render(lastUpdate)}).
            </p>
          )}
          <p>
            <i>{projectName}</i> is a project by{' '}
            <a href="https://michaelrambeau.com">Michael Rambeau</a>, made in
            Osaka, Japan.
          </p>
          <Partner>
            <span>Powered by</span>
            <a href="https://vercel.com?utm_source=bestofjs">
              <img width="80" src="/svg/vercel.svg" alt="Vercel" />
            </a>
          </Partner>
        </Section>
      </div>
    </StyledFooter>
  )
}

const breakPointColumns = 800

const StyledFooter = styled.footer`
  margin-top: 4rem;
  background-color: var(--chakra-colors-orange-900);
  color: hsla(0, 0%, 100%, 0.7);
  .container {
    max-width: 1100px;
    padding-top: 3rem;
    padding-bottom: 2rem;
  }
  a {
    color: #fbf3ef;
    font-family: var(--buttonFontFamily);
  }
  a:hover {
    text-decoration: underline;
  }
  .footer-bottom {
    text-align: center;
  }
  .grid {
    display: grid;
    grid-template-columns: 100px 1fr 1fr;
    grid-gap: 3rem;
    @media (max-width: ${breakPointColumns - 1}px) {
      grid-template-columns: none;
      grid-gap: 2rem;
      img {
        max-width: 300px;
      }
    }
  }
  &::after {
    content: '';
    display: block;
    height: 8px;
    width: 100%;
    background-image: linear-gradient(
      135deg,
      #ffe38c 20%,
      #ffae63 20% 40%,
      #f76d42 40% 60%,
      #d63c4a 60% 80%,
      #9c0042 80%
    );
  }
`

const Section = styled.section`
  p {
    margin-bottom: 1rem;
  }
`

const Separator = styled.hr`
  margin: 2rem 0;
  border-color: rgba(255, 255, 255, 0.3);
`

const Partner = styled.p`
  display: flex;
  justify-content: center;
  span {
    margin-right: 4px;
  }
`

const LinkGroup = ({ title, children }) => {
  return (
    <Box>
      <Box mb={4}>{title}</Box>
      <Box>{children}</Box>
    </Box>
  )
}

const List = styled.ul`
  padding: 0;
  list-style: none;
`

const ListItem = styled.li`
  margin-bottom: 1rem;
  a {
    margin-bottom: 0.5rem;
  }
`

const ListItemLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 16px;
`

const DirectLink = ListItemLink.withComponent(Link)
