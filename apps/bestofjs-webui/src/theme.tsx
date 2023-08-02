import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  useSystemColorMode: false,
};

export const customTheme = extendTheme({
  colors: {
    gray: {
      "50": "#F2F2F0",
      "100": "#ececec",
      "200": "#e1e1e1",
      "250": "#cccccc", // token added to handle button border color when hovering
      "300": "#ADADAD",
      "400": "#969696",
      "500": "#808080",
      "600": "#666666",
      "700": "#4D4D4D",
      "800": "#333333",
      "900": "#1A1A1A",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        fontFamily: "Open Sans",
      },
      defaultProps: {
        variant: "outline",
      },
      variants: {
        outline: (props) =>
          props.colorScheme === "gray" && {
            color: "var(--textSecondaryColor)",
            bg: "var(--cardBackgroundColor)",
            _hover: {
              borderColor: mode(`gray.250`, `whiteAlpha.300`)(props),
              bg: mode(`white`, `whiteAlpha.300`)(props),
              color: "var(--textPrimaryColor)",
            },
          },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "normal",
      },
    },
    Link: {
      baseStyle: {
        color: "var(--linkColor)",
      },
    },
    Menu: {
      baseStyle: {
        groupTitle: {
          fontFamily: "Open Sans",
          fontSize: "1rem",
          fontWeight: "normal",
          color: "var(--textMutedColor)",
          mx: "0.8rem",
        },
        item: {
          fontFamily: "Open Sans",
        },
      },
    },
    Tag: {
      baseStyle: {
        label: {
          fontFamily: "Open Sans",
        },
      },
    },
  },
  config,
  fonts: {
    heading: "Roboto Slab",
    body: "Roboto Slab",
    button: "Open Sans",
  },
  shadows: {
    outline: "0 0 0 3px rgba(250, 158, 59, 0.6)",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: "var(--backgroundColor)",
        color: mode("var(--textPrimaryColor)", "gray.200")(props),
        lineHeight: 1.3333,
      },
    }),
  },
});
