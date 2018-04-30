import React from 'react'
import styled from 'styled-components'

const bestofjsOrange = '#e65100'

const Div = styled.div`
  display: flex;
  background-color: #fff;
  > div {
    flex: 1;
  }
  > div.on {
    background-color: ${bestofjsOrange};
  }
  > div.on a {
    color: #fff;
  }
  > div.on .icon {
    color: rgba(255, 255, 255, 0.5);
  }
  a {
    padding: 0.2rem 1rem;
    color: #ffae63;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #fa9e59;
    border-right-width: 0;
  }
  .icon {
    margin-right: 0.5rem;
  }
  > div:last-child a {
    border-right-width: 1px;
  }
`

const TabLevel1 = ({ children }) => <Div>{children}</Div>

export default TabLevel1
