import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Table from '../DependencyTable'
import allLicenseTypes from './license-types.json'
import TruncatedList from './TruncatedPackageList'
import PackageName from './PackageName'
import Badge from './Badge'
import fromNow from '../../../../../helpers/fromNow'

const isUnlicensed = name => /unlicense/i.test(name)

const LicenseReport = ({ licenses, packageCount, date }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <Intro licenses={licenses} packageCount={packageCount} />
      <Table>
        <thead>
          <tr>
            <td width="50%">License Type</td>
            <td>Packages</td>
          </tr>
        </thead>
        <tbody>
          {licenses.map(({ name, packages }) => (
            <tr key={name}>
              <td>
                <p>
                  <i>{name}</i>
                  {isUnlicensed(name) && (
                    <Badge danger>
                      <b>!</b>
                    </Badge>
                  )}
                </p>
                <LicenseType licenseName={name} />
              </td>
              <td>
                {packages.length > 1 && <p>{packages.length} packages</p>}
                <TruncatedList packages={packages} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Div>
        <p>
          The package and its dependencies have been scanned using{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://npm.im/legally"
          >
            <i>legally</i>
          </a>{' '}
          {fromNow(date)}.
        </p>
        <p>
          Find more information about licenses on{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://tldrlegal.com/"
          >
            <i>TL;DR Legal</i>
          </a>{' '}
          site.
        </p>
        <Feedback />
      </Div>
    </div>
  )
}

const Div = styled.div`
  margin: 1rem 0px 0px;
  padding-left: 1rem;
  border-left: 1px dashed #cbcbcb;
`

const Credits = styled.div`
  margin-top: 1rem;
`

const LicenseType = ({ licenseName }) => {
  const explanation = allLicenseTypes[licenseName]
  if (!explanation) return null
  const { description, link } = explanation
  return (
    <div>
      <p className="text-secondary">
        <span class="octicon octicon-quote" /> {description}..
      </p>
      <a className="text-secondary?" href={link} target="_blank">
        More details
      </a>
    </div>
  )
}

const Intro = ({ licenses, packageCount }) => {
  const licenseCount = licenses.length
  const licenseNames = licenses.map(license => license.name)
  const intro = count => {
    if (count === 1)
      return (
        <p>
          The {packageCount} packages we analyzed are all{' '}
          <em>{licenseNames[0]}</em> licensed.
        </p>
      )
    return (
      <p>
        We found {licenseCount} different licenses ({licenseNames.join(', ')})
        in the {packageCount} packages we analyzed.
      </p>
    )
  }
  if (packageCount === 1)
    return (
      <SinglePackageIntro
        packageName={licenses[0].packages[0]}
        licenseNames={licenseNames}
      />
    )
  return <div>{intro(licenseCount)}</div>
}

const Feedback = () => (
  <div style={{ marginTop: '.5rem' }}>
    <p>
      <Badge style={{ marginLeft: 0, marginRight: '.5rem' }}>
        <span class="octicon octicon-megaphone" /> New Feature!
      </Badge>
    </p>
    <p>
      What do you think of this <i>Licenses</i> new feature...{' '}
      <span role="img" aria-label="good">
        👍{' '}
      </span>useful?{' '}
      <span role="img" aria-label="good">
        👎
      </span>{' '}
      useless?{' '}
    </p>
    <p>
      Give us feedback on{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/bestofjs/bestofjs-webui/issues/53"
      >
        GitHub
      </a>, thank you!
    </p>
  </div>
)

const SinglePackageIntro = ({ packageName, licenseNames }) => {
  return licenseNames.length === 1 ? (
    <div>
      <PackageName name={packageName} />
      {` package is ${licenseNames[0]} licensed.`}
    </div>
  ) : (
    <div>
      We found {licenseNames.length} different licenses ({licenseNames.join(
        ', '
      )}) in <PackageName name={packageName} /> package.
    </div>
  )
}

LicenseReport.propTypes = {
  licenses: PropTypes.array.isRequired,
  packageCount: PropTypes.number.isRequired
}

export default LicenseReport
