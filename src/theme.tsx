import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

export const customTheme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        fontFamily: 'Open Sans'
      },
      defaultProps: {
        variant: 'outline'
      },
      variants: {
        outline: {
          bg: 'var(--cardBackgroundColor)'
        }
      }
    },
    Link: {
      baseStyle: {
        fontFamily: 'Open Sans'
      }
    },
    Menu: {
      baseStyle: {
        groupTitle: {
          fontFamily: 'Open Sans'
        }
      }
    },
    Tag: {
      baseStyle: {
        label: {
          fontFamily: 'Open Sans'
        }
      }
    }
  },
  config,
  fonts: {
    heading: 'Roboto Slab',
    body: 'Roboto Slab',
    button: 'Open Sans'
  },
  shadows: {
    outline: '0 0 0 3px rgba(250, 158, 59, 0.6)'
  },
  styles: {
    global: props => ({
      body: {
        bg: 'var(--backgroundColor)',
        // bg: mode('#ececec', 'gray.700')(props),
        color: mode('var(--textPrimaryColor)', 'gray.200')(props),
        lineHeight: 1.3333
      }
    })
  }
})
