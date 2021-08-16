import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { GoMarkGithub } from 'react-icons/go'
import { Button, Link as ChakraLink } from '@chakra-ui/react'

import { ReactComponent as Logo } from './bestofjs-logo.svg'
import { AuthContainer } from 'containers/auth-container'
import { StaticContentContainer } from 'containers/static-content-container'
import { DiscordIcon } from 'components/core/icons'
import { UserDropdownMenu } from './user-dropdown-menu'
import { NavigationDropdownMenu } from './navigation-dropdown-menu'

const breakpoint = 700

const HeaderContainer = styled.header`
  background-color: var(--cardBackgroundColor);
  height: var(--topBarHeight);
  z-index: 10;
  .container {
    height: var(--topBarHeight);
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
  button {
    font-size: 1.14286rem;
  }
`

export const Header = props => {
  const { repoURL } = StaticContentContainer.useContainer()

  return (
    <HeaderContainer>
      <div className="container">
        <Row>
          <Col>
            <ChakraLink
              as={Link}
              to={'/'}
              color="var(--bestofjsOrange)"
              display="block"
            >
              <Logo alt="Best of JS" width="130" height="37.15" />
            </ChakraLink>

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
                  className="icon hint--bottom"
                  href="https://discord.com/invite/rdctdFX2qR"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Discord"
                >
                  <DiscordIcon />
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a
                  className="icon hint--bottom"
                  href={repoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
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

const NavigationMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`
const NavigationMenuItem = styled.div`
  > * {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  > a {
    display: flex;
    align-items: center;
    height: var(--topBarHeight);
    color: var(--textSecondaryColor);
    &:hover {
      color: var(--textPrimaryColor);
    }
    border: 4px solid transparent;
    font-family: var(--headingFontFamily);
  }
  a.active {
    color: var(--bestofjsOrange);
    border-bottom-color: var(--bestofjsOrange);
  }
  a.icon {
    color: var(--textSecondaryColor);
    &:hover {
      color: var(--textSecondaryColor);
    }
  }
  > a,
  button {
    font-size: 1.14286rem;
  }
`

const LoginSection = () => {
  const auth = AuthContainer.useContainer()

  if (auth.isPending) return <div className="v-center">Loading...</div>

  if (!auth.isLoggedIn) {
    return (
      <Button
        variant="ghost"
        color="var(--textSecondaryColor)"
        onClick={() => auth.login()}
      >
        Sign in
      </Button>
    )
  }

  return <UserDropdownMenu />
}
