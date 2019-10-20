import React from 'react'
import { Fetch } from 'react-request'

import Spinner from '../../../../common/Spinner'
import LicenseReport from './LicenseReport'
import getApi from '../../../../../api/config'

const sortByCount = (a, b) => (a.count > b.count ? -1 : 1)

const FetchLicense = ({ project }) => {
  const { packageName } = project
  const root = getApi('FETCH_LICENSE')
  const url = `${root}/package?name=${packageName}`
  return (
    <Fetch url={url}>
      {({ fetching, failed, data }) => {
        if (fetching) {
          return (
            <div>
              <p>Please wait while we are checking all the dependencies.</p>
              <p>
                It may take a while, depending on the number of the dependencies
                but the results will be cached.
              </p>
              <Spinner />
            </div>
          )
        }
        if (failed) {
          return (
            <div>
              Sorry, the request about "{packageName}" package did not succeed.
            </div>
          )
        }
        if (data && data.meta) {
          const {
            licenses,
            meta: { count, date }
          } = data
          const licenseList = Object.keys(licenses)
            .map(key => ({
              name: key,
              ...licenses[key]
            }))
            .sort(sortByCount)
          return licenseList.length > 0 ? (
            <LicenseReport
              licenses={licenseList}
              packageCount={count}
              date={new Date(date)}
            />
          ) : (
            <div>No license found.</div>
          )
        }
        return null
      }}
    </Fetch>
  )
}

export default FetchLicense
