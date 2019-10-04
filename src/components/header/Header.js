import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

// import SearchForm from '../../containers/SearchFormContainer'
// import ToggleMenuButton from './ToggleMenuButton'
import { Button } from '../core'
import UserDropdownMenu from './UserDropdownMenu'
import NavigationDropdownMenu from './NavigationDropdownMenu'

const sidebarBreakpoint = 900
const topbarHeight = 60
const sidebarWidth = 280

const Div = styled.div`
  /*position: fixed;
  top: 0;
  left: 0;
  right: 0;*/
  background-color: #fff;
  height: ${topbarHeight}px;
  z-index: 10;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  /*@media screen and (min-width: ${sidebarBreakpoint}px) {
    left: ${sidebarWidth}px;
  }*/
  @media screen and (max-width: ${sidebarBreakpoint - 1}px) {
    padding-left: 60px;
  }
  .container {
    height: ${topbarHeight}px;
    display: flex;
    align-items: center;
  }
  @media screen and (min-width: ${sidebarBreakpoint}px) {
    padding: 0;
  }
`

const Row = styled.div`
  display: flex;
  width: 100%;
  .col-1 {
    width: 200px;
    display: flex;
    align-items: center;
  }
  .col-2 {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
  }
`

const LinkLogo = styled(Link)`
  display: block;
  img {
    display: block;
  }
`

const Header = props => {
  return (
    <Div>
      {/* <ToggleMenuButton actions={actions} /> */}
      <div className="container">
        <Row className="header-row">
          <NavigationMenu>
            <LinkLogo to={'/'}>
              <img src="/svg/bestofjs.svg" width="160" alt="bestofjs.org" />
            </LinkLogo>
            <NavigationMenuItem>
              <Link to="/projects">All projects</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/hall-of-fame">Hall of Fame</Link>
            </NavigationMenuItem>
          </NavigationMenu>
          <div className="col-2">
            {/* <NavigationDropdownMenu {...props} /> */}
            <LoginSection {...props} />
          </div>
        </Row>
      </div>
    </Div>
  )
}

const NavigationMenu = styled.div`
  display: flex;
  align-items: center;
`
const NavigationMenuItem = styled.div`
  font-size: 16px;
  margin-left: 1rem;
  @media screen and (max-width: ${sidebarBreakpoint - 1}px) {
    display: none;
  }
`

const LoginSection = ({ dependencies: { authApi } }) => {
  const auth = useSelector(state => state.auth)

  if (auth.pending)
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>Loading...</div>
    )

  if (!auth.username) {
    return (
      <Button className="button-outlineX" onClick={() => authApi.login()}>
        Sign in with GitHub
      </Button>
    )
  }

  return <UserDropdownMenu authApi={authApi} />
}

export default Header
