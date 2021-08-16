import React from 'react'
import { render } from 'react-dom'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

import { unregister } from './registerServiceWorker'
import { Root } from './root'

// Old-fashioned stylesheets
import './stylesheets/base.css'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

// 3. extend the theme
const customTheme = extendTheme({
  components: {
    Tag: {
      defaultProps: {
        // variant: 'outline',
        // size: 'xl'
      }
    },
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
    }
  },
  config,
  fonts: {
    heading: 'Roboto Slab',
    body: 'Roboto Slab'
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

console.log(customTheme)

function start() {
  render(
    <>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      <ChakraProvider theme={customTheme} resetCSS={true}>
        <Root />
      </ChakraProvider>
    </>,
    document.getElementById('root')
  )
}

start()
unregister()
