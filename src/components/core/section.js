import React from 'react'
import styled from 'styled-components'

export const Section = props => <section {...props} />

Section.Header = ({ children, icon }) => {
  return (
    <Row>
      {icon && (
        <IconCell>
          <span
            className={`mega-octicon octicon-${icon}`}
            style={{ color: '#fa9e59' }}
          />
        </IconCell>
      )}
      <MainCell>{children}</MainCell>
    </Row>
  )
}

Section.Title = styled.span`
  font-size: 1.5rem;
`

Section.SubTitle = styled.div`
  font-size: 1rem;
  color: var(--textSecondaryColor);
  text-transform: uppercase;
`

const Row = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`

const IconCell = styled.div`
  padding-right: 0.5rem;
`

const MainCell = styled.div`
  flex-grow: 1;
`
