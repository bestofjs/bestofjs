import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  margin: 0.5rem 0px 0px;
  padding-left: 1rem;
  border-left: 1px dashed #cbcbcb;
`

const SizeDetailsList = ({ children }) => {
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

SizeDetailsList.propTypes = {}

export default SizeDetailsList
