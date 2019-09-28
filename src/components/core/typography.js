import React from 'react'
import styled from 'styled-components'

const Heading = styled.h3`
  display: flex;
  align-items: center;
`

export const PageTitle = ({ icon, children, extra }) => {
  return (
    <Heading>
      {icon && <PageTitleIcon>{icon}</PageTitleIcon>}
      <div>
        {children}
        {extra && <PageTitleExtra>{extra}</PageTitleExtra>}
      </div>
    </Heading>
  )
}

const PageTitleIcon = styled.div`
  margin-right: 0.5rem;
  color: #fa9e59;
`

const PageTitleExtra = styled.span`
  color: #788080;
  font-size: 16px;
  margin-left: 0.25rem;
`
