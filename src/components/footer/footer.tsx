import React from 'react'
import styled from 'styled-components'

import { useSelector } from 'containers/project-data-container'
import fromNow from 'helpers/fromNow'
import { StaticContentContainer } from 'containers/static-content-container'

const StyledFooter = styled.footer`
  margin: 2rem 0;
  .footer-bottom {
    margin-top: 2rem;
    padding-top: 2rem;
    text-align: center;
  }
  p:not(:last-child) {
    margin-bottom: 1rem;
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

export const Footer = () => {
  const lastUpdate = useSelector(state => state.meta.lastUpdate)
  const { repo, projectName, version } = StaticContentContainer.useContainer()

  return (
    <StyledFooter id="footer">
      <div id="footer-content" className="container">
        <section>
          <div className="grid">
            <div>
              <p>Data updated from GitHub everyday</p>
              {lastUpdate && <p>Last update: {fromNow(lastUpdate)}</p>}
            </div>
            <div>
              <p>
                <a href={repo}>
                  <span className="octicon octicon-mark-github" />{' '}
                  <span>GitHub</span>
                </a>{' '}
                (v{version})
              </p>
              <p>
                <a href="https://weekly.bestofjs.org/rss/trends.xml">
                  <span className="octicon octicon-rss" />{' '}
                  <span>Weekly feed</span>
                </a>
              </p>
            </div>
          </div>
        </section>
        <section className="footer-bottom">
          <p>
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

const Partner = styled.p`
  display: flex;
  justify-content: center;
  span {
    margin-right: 4px;
  }
`
