import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Toggle from 'react-toggled'

import ExpandableSection from '../ExpandableSection'
import PackageName from './PackageName'

const BasicList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const TruncatedList = ({ packages }) => {
  const limit = 10
  const count = packages.length
  if (count <= limit) return <PackageList packages={packages} />
  return (
    <div>
      <PackageList packages={packages.slice(0, limit)} />
      <Toggle>
        {({ on, getTogglerProps }) => (
          <div style={{ marginTop: '1rem' }}>
            <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
              {on ? 'Hide' : 'View all packages'}
            </ExpandableSection>
            {on && (
              <PackageList
                packages={packages.slice(limit)}
                style={{ marginTop: '1rem' }}
              />
            )}
          </div>
        )}
      </Toggle>
    </div>
  )
}

const PackageList = ({ packages, ...rest }) => {
  return (
    <BasicList {...rest}>
      {packages.map(packageName => (
        <li key={packageName}>
          <PackageName name={packageName} />
        </li>
      ))}
    </BasicList>
  )
}

TruncatedList.propTypes = {
  packages: PropTypes.array.isRequired
}

export default TruncatedList
