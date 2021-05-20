import React from 'react'
import styled from '@emotion/styled'
import { GoMarkGithub, GoRss } from 'react-icons/go'

import { useSelector } from 'containers/project-data-container'
import { fromNow } from 'helpers/from-now'
import { StaticContentContainer } from 'containers/static-content-container'

export const Footer = () => {
  const lastUpdate = useSelector(state => state.meta.lastUpdate)
  const {
    repoURL,
    projectName,
    version
  } = StaticContentContainer.useContainer()

  return (
    <StyledFooter id="footer">
      <div id="footer-content" className="container">
        <section>
          <div className="grid">
            <div>
              <FooterCell>Data updated from GitHub everyday</FooterCell>
              {lastUpdate && (
                <FooterCell>Last update: {fromNow(lastUpdate)}</FooterCell>
              )}
            </div>
            <div>
              <FooterCell>
                <a href={repoURL}>
                  <GoMarkGithub className="icon" size={20} />
                  <div>GitHub</div>
                </a>
                <div>v{version}</div>
              </FooterCell>{' '}
              <FooterCell>
                <a href="https://weekly.bestofjs.org/rss/trends.xml">
                  <GoRss className="icon" size={20} />
                  Weekly feed
                </a>
              </FooterCell>
            </div>
          </div>
        </section>
        <section className="footer-bottom">
          <p style={{ marginBottom: '1rem' }}>
            <i>{projectName}</i> is a project by{' '}
            <a href="https://michaelrambeau.com">Michael Rambeau</a>, made in
            Osaka, Japan.
          </p>
          <Partner>
            <span style={{ marginRight: 4 }}>Powered by</span>
            <a href="https://vercel.com?utm_source=bestofjs ">
              <img width="80" src="/svg/vercel.svg" alt="Vercel" />
            </a>
          </Partner>
        </section>
      </div>
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  margin: 2rem 0;
  .footer-bottom {
    margin-top: 2rem;
    padding-top: 2rem;
    text-align: center;
  }
  .grid {
    padding-top: 2rem;
    display: flex;
  }
  .grid > div {
    flex: 1;
  }
  @media (max-width: 900px) {
    .grid {
      flex-direction: column;
    }
    .grid > div:not(:last-child) {
      margin-bottom: 1rem;
    }
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
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  display: flex;
  align-items: center;
  a {
    display: flex;
    margin-right: 0.25rem;
  }
  .icon {
    margin-right: 0.25rem;
  }
`
