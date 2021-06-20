import React from 'react'
import { render } from 'react-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

import { unregister } from './registerServiceWorker'
import { Root } from './root'

// Old-fashioned stylesheets
// import './stylesheets/base.css'

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
        bg: mode('gray.100', 'gray.700')(props)
      }
    })
  }
})

console.log(customTheme)

function start() {
  render(
    <ChakraProvider theme={customTheme}>
      <Root />
    </ChakraProvider>,
    document.getElementById('root')
  )
}

start()
unregister()
