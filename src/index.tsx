import React from 'react'
import { render } from 'react-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
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
  config,
  styles: {
    global: props => ({
      body: {
        bg: mode('#ececec', 'gray.700')(props),
        color: mode('var(--textPrimaryColor)', 'gray.200')(props),
        lineHeight: 1.3333
      }
    })
  },
  fonts: {
    body: 'Roboto Slab'
  }
})

console.log(customTheme)

function start() {
  render(
    <ChakraProvider theme={customTheme} resetCSS={false}>
      <Root />
    </ChakraProvider>,
    document.getElementById('root')
  )
}

start()
unregister()
