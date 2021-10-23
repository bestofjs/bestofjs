import React from "react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import styled from "@emotion/styled";

import { Box, useColorModeValue } from "components/core";

export const DropdownMenu = ({ children, menu, ...props }) => {
  return (
    <HeadlessMenu
      as="div"
      style={{ position: "relative", display: "inline-block" }}
    >
      <HeadlessMenu.Button as={React.Fragment}>{children}</HeadlessMenu.Button>
      <Box
        as={HeadlessMenu.Items}
        position="absolute"
        right={0}
        marginTop={2}
        zIndex={2}
        w={200}
        borderRadius="md"
        borderWidth="1px"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={useColorModeValue("md", "dark-lg")}
        fontFamily="var(--buttonFontFamily)"
        _focusVisible={{
          outline: "none",
        }}
        {...props}
      >
        {menu}
      </Box>
    </HeadlessMenu>
  );
};

export const Menu = styled(Box)`
  > :not([hidden]) ~ :not([hidden]) {
    border-top-width: 1px;
  }
`;

export const MenuGroup = ({ children }) => {
  return (
    <Box py={2}>
      {React.Children.map(children, (child) => {
        if (!child) return null; // filter empty elements caused by media queries
        return (
          <HeadlessMenu.Item disabled={child.props.disabled}>
            {({ active }) => React.cloneElement(child, { active })}
          </HeadlessMenu.Item>
        );
      })}
    </Box>
  );
};

export const MenuItem = ({ active, ...props }: any) => {
  const activeBg = useColorModeValue("orange.100", "whiteAlpha.200");
  return (
    <Box
      w="100%"
      py="0.4rem"
      px="0.8rem"
      display="block"
      textAlign="left"
      _active={{
        bg: activeBg,
      }}
      _focus={{
        bg: activeBg,
        outline: "none",
      }}
      sx={{
        "&[disabled]": {
          opacity: 0.5,
        },
      }}
      bg={active ? activeBg : undefined}
      {...props}
    />
  );
};
