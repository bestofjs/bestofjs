import { NavLink, Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  IconButton,
  useColorMode,
} from "components/core";
import { DiscordIcon } from "components/core/icons";
import { APP_REPO_URL } from "config";
import { AuthContainer } from "containers/auth-container";
import { GoMarkGithub } from "react-icons/go";

import logoDark from "./bestofjs-logo-dark.svg";
import logoLight from "./bestofjs-logo-light.svg";
import { ColorModePicker } from "./color-mode-picker";
import { NavigationDropdownMenu } from "./navigation-dropdown-menu";
import { UserDropdownMenu } from "./user-dropdown-menu";

const breakpoint = 750;

const HeaderContainer = styled.header`
  background-color: var(--headerBackgroundColor);
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
`;

export const Header = () => {
  const { colorMode } = useColorMode();

  return (
    <HeaderContainer>
      <div className="container">
        <Flex w="100%" justifyContent="space-between">
          <Center>
            <Box
              as={RouterLink}
              to={"/"}
              color="var(--bestofjsOrange)"
              display="block"
              aria-label="Home"
            >
              <img
                src={colorMode === "light" ? logoLight : logoDark}
                alt="Best of JS"
                width="130"
                height="37.15"
              />
            </Box>

            <NavigationMenu className="desktop-only">
              <NavigationMenuItem>
                <NavLink to="/" exact data-testid="menu-home">
                  Home
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/projects" data-testid="menu-projects">
                  Projects
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/tags" data-testid="menu-tags">
                  Tags
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationDropdownMenu />
              </NavigationMenuItem>
            </NavigationMenu>
          </Center>
          <Center>
            <NavigationMenu>
              <NavigationMenuItem className="desktop-only">
                <LoginSection />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <ColorModePicker ml={2} />
              </NavigationMenuItem>
              <Box px={3}>
                <Divider
                  orientation="vertical"
                  height="30px"
                  borderColor="var(--boxBorderColor)"
                />
              </Box>
              <HStack>
                <IconButton
                  as="a"
                  href="https://discord.com/invite/rdctdFX2qR"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Discord"
                  icon={<DiscordIcon />}
                  variant="ghost"
                  color="var(--textSecondaryColor)"
                />

                <IconButton
                  as="a"
                  href={APP_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  icon={<GoMarkGithub size={28} />}
                  variant="ghost"
                  color="var(--textSecondaryColor)"
                />
                <Box className="mobile-only">
                  <NavigationDropdownMenu />
                </Box>
              </HStack>
            </NavigationMenu>
          </Center>
        </Flex>
      </div>
    </HeaderContainer>
  );
};

const NavigationMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;
const NavigationMenuItem = styled.div`
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
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  a.active {
    color: var(--bestofjsOrange);
    border-bottom-color: var(--bestofjsOrange);
  }
`;

const LoginSection = () => {
  const auth = AuthContainer.useContainer();

  if (auth.isPending) return <Center>Loading...</Center>;

  if (!auth.isLoggedIn) {
    return (
      <Button
        onClick={() => auth.login()}
        variant="ghost"
        color="var(--textSecondaryColor)"
        size="md"
      >
        Sign in
      </Button>
    );
  }

  return <UserDropdownMenu />;
};
