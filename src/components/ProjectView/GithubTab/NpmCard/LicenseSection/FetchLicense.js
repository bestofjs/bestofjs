import React from 'react'
import { Fetch } from 'react-request'

import Spinner from '../../../../common/Spinner'
import LicenseReport from './LicenseReport'
import getApi from '../../../../../config/api'

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
            <div style={{ marginTop: '1rem' }}>
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
            <div style={{ marginTop: '1rem' }}>
              Sorry, the request about "{packageName}" package did not succeed.
            </div>
          )
        }
        if (data && data.meta) {
          const {
            licenses,
            meta: { count }
          } = data
          const licenseList = Object.keys(licenses)
            .map(key => ({
              name: key,
              ...licenses[key]
            }))
            .sort(sortByCount)
          return (
            <div>
              <LicenseReport licenses={licenseList} packageCount={count} />
            </div>
          )
        }

        return null
      }}
    </Fetch>
  )
}

export default FetchLicense
