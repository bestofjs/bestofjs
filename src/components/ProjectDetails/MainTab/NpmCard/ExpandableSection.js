import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import classNames from 'classnames'

const TogglerLink = styled.a`
  :focus {
    outline-style: none;
  }
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  :hover {
    color: #cc4700;
  }
  .icon {
    margin-right: 0.25rem;
  }
`

const ExpandableSection = ({ on, getTogglerProps, children }) => {
  return (
    <TogglerLink
      {...getTogglerProps()}
      className={classNames(on ? 'on' : 'off')}
    >
      <span
        className={`octicon octicon-triangle-${on ? 'down' : 'right'} icon`}
      />{' '}
      {children}
    </TogglerLink>
  )
}

ExpandableSection.propTypes = {
  on: PropTypes.bool.isRequired
}

export default ExpandableSection
