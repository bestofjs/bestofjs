import React from 'react'
import styled from 'styled-components'

import Table from '../DependencyTable'
import allLicenseTypes from './license-types.json'
import TruncatedList from './TruncatedPackageList'

const LicenseReport = ({ licenses }) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <td width="50%">Type</td>
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
                <p>{license.count} packages</p>
                <TruncatedList packages={license.packages} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Credits>
        <p>
          Data is provided by{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://npm.im/legally"
          >
            <i>legally</i>
          </a>{' '}
          package.
        </p>
        <p>
          Find more information about licenses on{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://tldrlegal.com/"
          >
            TL;DR Legal
          </a>.
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

LicenseReport.propTypes = {}

export default LicenseReport
