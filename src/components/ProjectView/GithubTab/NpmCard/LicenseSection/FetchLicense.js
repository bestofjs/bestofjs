import React from 'react'
import { Fetch } from 'react-request'

import Spinner from '../../../../common/Spinner'
import LicenseReport from './LicenseReport'

const sortByCount = (a, b) => (a.count > b.count ? -1 : 1)

const FetchLicense = ({ project }) => {
  const { packageName } = project
  const url = `https://fetch-license.now.sh/${packageName}`
  // const url = `http://localhost:3001/${packageName}`
  return (
    <Fetch url={url}>
      {({ fetching, failed, data }) => {
        if (fetching) {
          return (
            <div style={{ marginTop: '1rem' }}>
              <div>
                Please wait while we are checking all the dependencies. It may
                take a while...
              </div>
              <Spinner />
            </div>
          )
        }
        if (failed) {
          return <div>The request did not succeed.</div>
        }
        if (data) {
          const packagesByLicense = data.licenses
          const licenses = Object.keys(packagesByLicense)
            .map(key => ({
              name: key,
              ...packagesByLicense[key]
            }))
            .sort(sortByCount)
          return (
            <div>
              <LicenseReport licenses={licenses} />
            </div>
          )
        }

        return null
      }}
    </Fetch>
  )
}

export default FetchLicense
