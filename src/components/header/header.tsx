import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { Button } from '../core'
import UserDropdownMenu from './UserDropdownMenu'
import { MarkGitHubIcon } from '../core/icons'
import { useStaticContent } from '../../static-content'

const sidebarBreakpoint = 700
const topbarHeight = 60

const HeaderContainer = styled.header`
  background-color: #fff;
  height: ${topbarHeight}px;
  z-index: 10;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  .container {
    height: ${topbarHeight}px;
    display: flex;
    align-items: center;
  }
  @media screen and (min-width: ${sidebarBreakpoint}px) {
    padding: 0;
  }
`

export const Header = props => {
  const { repo } = useStaticContent()

  return (
    <HeaderContainer>
      <div className="container">
        <Row className="header-row">
          <Col>
            <LinkLogo to={'/'}>
              <img src="/svg/bestofjs.svg" width="130" alt="bestofjs.org" />
            </LinkLogo>
          </Col>
          <Col style={{ flexGrow: 1 }} />
          <Col>
            <NavigationMenu>
              <NavigationMenuItem>
                <Link to="/projects">Projects</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/tags">Tags</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/hall-of-fame">Hall of Fame</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href={repo} target="_blank" rel="noopener noreferrer">
                  <MarkGitHubIcon size={32} />
                </a>
              </NavigationMenuItem>
            </NavigationMenu>
          </Col>
          <Col>
            {/* <NavigationDropdownMenu {...props} /> */}
            <LoginSection {...props} />
          </Col>
        </Row>
      </div>
    </HeaderContainer>
  )
}

const Row = styled.div`
  display: flex;
  width: 100%;
`

const Col = styled.div`
  display: flex;
  align-items: center;
`

const LinkLogo = styled(Link)`
  display: block;
  img {
    display: block;
  }
`

const NavigationMenu = styled.div`
  display: flex;
  align-items: center;
`
const NavigationMenuItem = styled.div`
  margin-right: 1rem;
  @media screen and (max-width: ${sidebarBreakpoint - 1}px) {
    display: none;
  }
  a {
    color: var(--textSecondaryColor);
    font-size: 1rem;
    &:hover {
      color: var(--textPrimaryColor);
    }
  }
`

const LoginSection = ({ dependencies: { authApi } }) => {
  const auth = useSelector(state => state.auth)

  if (auth.pending)
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>Loading...</div>
    )

  if (!auth.username) {
    return <Button onClick={() => authApi.login()}>Sign in</Button>
  }

  return <UserDropdownMenu authApi={authApi} />
}
