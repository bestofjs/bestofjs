import React from 'react'
import styled from 'styled-components'

const A = styled.a`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  font-size: 32px;
  z-index: 10;
  width: var(--topbarHeight);
  line-height: var(--topbarHeight);
  text-align: center;
  height: auto;
  padding: 0;
  color: #fff;
  background-color: #e65100;
  cursor: pointer;
  :hover,
  :focus {
    color: #fff;
  }
  @media screen and (min-width: 900px) {
    display: none;
  }
`

const ToggleMenuButton = () => {
  return (
    <A className="menu-link">
      {/* The `menu-link` class name is used target this button, see `helpers/menu.js` */}
      <span className="mega-octicon octicon-three-bars" />
    </A>
  )
}

export default ToggleMenuButton
