import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  display: flex;
  margin-top: 0rem;
  background-color: #fff;
  > a {
    flex: 1;
    color: #ffae63;
    padding: 0.25rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #fa9e59;
    border-left-width: 0;
    border-top-width: 0;
  }
  > a.on {
    background-color: #9c0042;
    color: #fff;
  }
  > a:first-child {
    border-left-width: 1px;
  }
`

const TabLevel2 = ({ children }) => <Div>{children}</Div>

export default TabLevel2
