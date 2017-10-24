import React from 'react'
import fromNow from '../../helpers/fromNow'

const Footer = ({ staticContent, lastUpdate }) => {
  const { repo, projectName, version } = staticContent
  return (
    <footer id="footer">
      <div id="footer-content" className="container">
        <section className="no-card-container">
          <div className="grid">
            <div>
              {false && (
                <p>
                  <i>{projectName}</i>, a project by{' '}
                  <a href="https://michaelrambeau.com">Michael Rambeau</a>
                </p>
              )}
              <p>Data updated from GitHub everyday</p>
              <p>Last update: {fromNow(lastUpdate)}</p>
            </div>
            <div>
              {false && <p>Made in Osaka, Japan</p>}
              <p>
                <a href={repo}>
                  <span className="octicon octicon-mark-github" />{' '}
                  <span>GitHub</span>
                </a>{' '}
                (v{version})
              </p>
              <p>
                <a href="/rss/weekly-trends.xml" target="_blank">
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
          <a
            href="https://js.org"
            target="_blank"
            rel="noopener noreferrer"
            title="JS.ORG | JavaScript Community"
          >
            <img
              src="/images/dark_horz.png"
              width="102"
              alt="JS.ORG Logo"
              style={{ marginTop: '1rem' }}
            />
          </a>
        </section>
      </div>
    </footer>
  )
}

export default Footer
