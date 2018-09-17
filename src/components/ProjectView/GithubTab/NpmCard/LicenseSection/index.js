import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'

import ExpandableSection from '../ExpandableSection'
import FetchLicense from './FetchLicense'

const License = ({ project }) => {
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div>
          <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
            All Licenses
          </ExpandableSection>
          {on && <FetchLicense project={project} />}
        </div>
      )}
    </Toggle>
  )
}

License.propTypes = {
  project: PropTypes.object.isRequired
}

export default License
