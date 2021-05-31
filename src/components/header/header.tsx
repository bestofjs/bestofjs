import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { GoMarkGithub } from 'react-icons/go'

import { AuthContainer } from 'containers/auth-container'
import { StaticContentContainer } from 'containers/static-content-container'
import { Button } from 'components/core'
import { UserDropdownMenu } from './user-dropdown-menu'
import { NavigationDropdownMenu } from './navigation-dropdown-menu'

const breakpoint = 700
const topbarHeight = 60

const HeaderContainer = styled.header`
  background-color: #fff;
  height: ${topbarHeight}px;
  z-index: 10;
  .container {
    height: ${topbarHeight}px;
    display: flex;
    align-items: center;
  }
  @media screen and (min-width: ${breakpoint}px) {
    padding: 0;
  }
`

export const Header = props => {
  const { repoURL } = StaticContentContainer.useContainer()

  return (
    <HeaderContainer>
      <div className="container">
        <Row>
          <Col>
            <LinkLogo to={'/'}>
              <img src="/svg/bestofjs.svg" width="130" alt="Best of JS" />
            </LinkLogo>
          </Col>
          <Col>
            <NavigationMenu>
              <NavigationMenuItem className="desktop-only">
                <Link to="/projects">Projects</Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="desktop-only">
                <Link to="/tags">Tags</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationDropdownMenu />
              </NavigationMenuItem>
              <NavigationMenuItem className="desktop-only">
                <LoginSection />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href={repoURL} target="_blank" rel="noopener noreferrer">
                  <GoMarkGithub size={32} />
                </a>
              </NavigationMenuItem>
            </NavigationMenu>
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
  &:first-of-type {
    flex-grow: 1;
  }
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
  a {
    color: var(--textSecondaryColor);
    font-size: 1rem;
    &:hover {
      color: var(--textPrimaryColor);
    }
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &.desktop-only {
    @media screen and (max-width: ${breakpoint - 1}px) {
      display: none;
    }
  }
  .mobile-only {
    @media screen and (min-width: ${breakpoint}px) {
      display: none;
    }
  }
`

const LoginSection = () => {
  const auth = AuthContainer.useContainer()

  if (auth.isPending) return <div className="v-center">Loading...</div>

  if (!auth.isLoggedIn) {
    return <Button onClick={() => auth.login()}>Sign in</Button>
  }

  return <UserDropdownMenu />
}
