import React from 'react'
import PropTypes from 'prop-types'

import Table from '../DependencyTable'
import allLicenseTypes from './license-types.json'
import TruncatedList from './TruncatedPackageList'
import PackageName from './PackageName'
import Badge from './Badge'
import Credits from './Credits'

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
      <Credits date={date} />
    </div>
  )
}

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
