import React from 'react'
import styled from '@emotion/styled'

const Div = styled.div`
  margin: 1rem 0px 0px;
  padding-left: 1rem;
  border-left: 1px dashed var(--boxBorderColor);
`

export const SizeDetailsList = ({ children }) => {
  return <Div>{children}</Div>
}

SizeDetailsList.Item = ({ children }) => {
  return <p>{children}</p>
}

SizeDetailsList.Link = ({ children }) => {
  return <p>{children}</p>
}

SizeDetailsList.Explanation = ({ children }) => {
  return <span className="text-secondary"> ({children})</span>
}
