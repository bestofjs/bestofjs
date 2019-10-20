import React from 'react'
import styled from 'styled-components'
import fromNow from '../../helpers/fromNow'

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

const Footer = ({
  staticContent,
  lastUpdate,
  showRefreshButton,
  fetchProjects
}) => {
  const { repo, projectName, version } = staticContent
  return (
    <StyledFooter id="footer">
      <div id="footer-content" className="container">
        <section className="no-card-container">
          <div className="grid">
            <div>
              <p>Data updated from GitHub everyday</p>
              <p>Last update: {fromNow(lastUpdate)}</p>
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
        </section>
      </div>
    </StyledFooter>
  )
}

export default Footer
