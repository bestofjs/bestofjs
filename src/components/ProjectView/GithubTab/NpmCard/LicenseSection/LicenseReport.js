import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Table from '../DependencyTable'
import allLicenseTypes from './license-types.json'
import TruncatedList from './TruncatedPackageList'
import PackageName from './PackageName'
import fromNow from '../../../../../helpers/fromNow'

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
          {licenses.map(license => (
            <tr key={license.name}>
              <td>
                <p>
                  <i>{license.name}</i>
                </p>
                <LicenseType licenseName={license.name} />
              </td>
              <td>
                {license.packages.length > 1 && (
                  <p>{license.packages.length} packages</p>
                )}
                <TruncatedList packages={license.packages} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Credits>
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
      </Credits>
    </div>
  )
}

const Credits = styled.div`
  margin-top: 1rem;
`

const LicenseType = ({ licenseName }) => {
  const explanation = allLicenseTypes[licenseName]
  if (!explanation) return null
  const { description, link } = explanation
  return (
    <div>
      <p className="text-secondary">{description}</p>
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
        <span>
          The {packageCount} packages we analyzed are all{' '}
          <em>{licenseNames[0]}</em> licensed.
        </span>
      )
    return (
      <span>
        We found {licenseCount} different licenses ({licenseNames.join(', ')})
        in the {packageCount} packages we analyzed.
      </span>
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
