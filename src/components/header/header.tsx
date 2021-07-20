import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { GoMarkGithub } from 'react-icons/go'

import { AuthContainer } from 'containers/auth-container'
import { StaticContentContainer } from 'containers/static-content-container'
import { Button } from 'components/core'
import { DiscordIcon } from 'components/core/icons'
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
  .desktop-only {
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

            <NavigationMenu className="desktop-only">
              <NavigationMenuItem>
                <NavLink to="/" exact>
                  Home
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/projects">Projects</NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/tags">Tags</NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationDropdownMenu />
              </NavigationMenuItem>
            </NavigationMenu>
          </Col>
          <Col>
            <NavigationMenu>
              <NavigationMenuItem className="desktop-only">
                <LoginSection />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a
                  className="icon"
                  href="https://discord.gg/8RBMtuuJmn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DiscordIcon />
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a
                  className="icon"
                  href={repoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoMarkGithub size={28} />
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem className="mobile-only">
                <NavigationDropdownMenu />
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
  justify-content: space-between;
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
  margin-left: 1rem;
  font-family: Poppins, Helvetica, sans-serif;
`
const NavigationMenuItem = styled.div`
  > * {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  > a {
    display: flex;
    align-items: center;
    height: 60px;
    color: var(--textSecondaryColor);
    font-size: 16px;
    &:hover {
      color: var(--textPrimaryColor);
    }
    border: 4px solid transparent;
  }
  a.active {
    color: #bb4201;
    border-bottom-color: #bb4201;
  }
  a.icon {
    color: var(--textMutedColor);
    &:hover {
      color: var(--textSecondaryColor);
    }
  }
`

const LoginSection = () => {
  const auth = AuthContainer.useContainer()

  if (auth.isPending) return <div className="v-center">Loading...</div>

  if (!auth.isLoggedIn) {
    return <LoginButton onClick={() => auth.login()}>Sign in</LoginButton>
  }

  return <UserDropdownMenu />
}

const LoginButton = styled(Button)`
  border-width: 0;
  // text-transform: uppercase;
  margin-right: 0rem;
  font-size: 16px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`
