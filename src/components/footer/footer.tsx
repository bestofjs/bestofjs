import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import {
  GoMarkGithub
  // GoRss
} from 'react-icons/go'
import tinytime from 'tinytime'

import { useSelector } from 'containers/project-data-container'
import { fromNow } from 'helpers/from-now'
import { StaticContentContainer } from 'containers/static-content-container'

const template = tinytime('{H}:{mm}', { padHours: true })

export const Footer = () => {
  const lastUpdate = useSelector(state => state.meta.lastUpdate)
  const {
    repoURL,
    projectName,
    risingStarsURL,
    // stateOfJSURL,
    version
  } = StaticContentContainer.useContainer()

  return (
    <StyledFooter id="footer">
      <div id="footer-content" className="container">
        <Section>
          <div className="grid">
            <div>
              <LinkGroup title="DIRECT LINKS">
                <List>
                  <ListItem>
                    <DirectLink to="/projects">Projects</DirectLink>
                    All projects tracked by <i>{projectName}</i>
                  </ListItem>
                  <ListItem>
                    <DirectLink to="/tags">Tags</DirectLink>
                    Projects are classified under +160 tags manually picked
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
                    Why do we track the "Best of JS" since 2015
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
                    </ListItemLink>
                    <p style={{ marginBottom: '1rem' }}>
                      Our annual round-up about the JavaScript landscape
                    </p>
                    <img
                      src="https://risingstars.js.org/img/2020/en/rising-stars.png"
                      width="100%"
                      alt="Rising Stars"
                    />
                  </ListItem>
                  {/* <ListItem>
                    <ListItemLink href={stateOfJSURL}>State of JS</ListItemLink>
                    <p>The biggest annual JavaScript-specific survey</p>
                    <img
                      src="https://stateofjs.com/images/stateofjs2020.png"
                      width="100%"
                      alt="State of JS"
                    />
                  </ListItem> */}
                </List>
              </LinkGroup>
              {false && (
                <LinkGroup title="GITHUB">
                  <List>
                    <ListItem>Data update from GitHub last day</ListItem>
                  </List>
                </LinkGroup>
              )}
            </div>
          </div>
        </Section>
        {false && (
          <Section>
            Data is updated from GitHub everyday, the last update was{' '}
            {fromNow(lastUpdate)} (at {template.render(lastUpdate)})
          </Section>
        )}
        {false && (
          <Section>
            <div className="grid">
              <div>
                <img src="/images/logo.png" />
              </div>
              <div>
                <FooterCell>Data updated from GitHub everyday</FooterCell>
                {lastUpdate && (
                  <FooterCell>
                    Last update: {fromNow(lastUpdate)} (
                    {template.render(lastUpdate)})
                  </FooterCell>
                )}
                <FooterCell>
                  <a href={repoURL}>
                    <GoMarkGithub className="icon" size={20} />
                    <div>GitHub</div>
                  </a>
                  <div>v{version}</div>
                </FooterCell>
              </div>
            </div>
          </Section>
        )}
        <Section className="footer-bottom">
          <p style={{ marginBottom: '1rem' }}>
            Data is updated from GitHub everyday, the last update was{' '}
            {fromNow(lastUpdate)} (at {template.render(lastUpdate)}).
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <i>{projectName}</i> is a project by{' '}
            <a href="https://michaelrambeau.com">Michael Rambeau</a>, made in
            Osaka, Japan.
          </p>
          <Partner>
            <span style={{ marginRight: 4 }}>Powered by</span>
            <a href="https://vercel.com?utm_source=bestofjs">
              <img width="80" src="/svg/vercel.svg" alt="Vercel" />
            </a>
          </Partner>
        </Section>
      </div>
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  background-color: #8f3200;
  background-color: #541600;
  color: hsla(0, 0%, 100%, 0.7);
  a {
    color: #fbf3ef;
  }
  a:hover {
    text-decoration: underline;
  }
  margin-top: 4rem;
  padding-top: 2rem;
  .footer-bottom {
    text-align: center;
  }
  .grid {
    display: flex;
  }
  .grid > div {
    flex: 1;
  }
  @media (min-width: 900px) {
    .grid > div:first-of-type {
      border-right: 1px dashed rgba(255, 255, 255, 0.3);
      padding-right: 1rem;
    }
    .grid > div:last-child {
      padding-left: 2rem;
    }
  }
  @media (max-width: 900px) {
    .grid {
      flex-direction: column;
    }
    .grid > div:not(:last-child) {
      margin-bottom: 1rem;
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
  padding: 2rem 0;
  &:not(:last-child) {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  }
`

const Partner = styled.p`
  display: flex;
  justify-content: center;
  span {
    margin-right: 4px;
  }
`

const FooterCell = styled.div`
  // &:not(:last-child) {
  //   margin-bottom: 1rem;
  // }
  display: flex;
  a {
    display: flex;
    margin-right: 0.25rem;
  }
  .icon {
    margin-right: 0.25rem;
  }
`

const LinkGroup = ({ title, children }) => {
  return (
    <div>
      <div>{title}</div>
      <div>{children}</div>
    </div>
  )
}

const List = styled.ul`
  padding-left: 1rem;
`

const ListItem = styled.li`
  margin-bottom: 1rem;
  a {
    margin-bottom: 0.5rem;
  }
`

const ListItemLink = styled.a`
  display: block;
  font-size: 16px;
`

const DirectLink = ListItemLink.withComponent(Link)
