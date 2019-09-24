import React from 'react'
import styled from 'styled-components'

const Heading = styled.h3`
  display: flex;
  align-items: center;
`

const Icon = styled.div`
  margin-right: 0.5rem;
  color: #fa9e59;
`

export const PageTitle = ({ icon, children }) => {
  return (
    <Heading>
      {icon && <Icon>{icon}</Icon>}
      {children}
    </Heading>
  )
}
