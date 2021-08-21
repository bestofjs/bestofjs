import React from 'react'
import { render } from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { unregister } from './registerServiceWorker'
import { Root } from './root'
import { customTheme } from 'theme'
import { initializeColorMode } from 'color-mode'

// Old-fashioned stylesheets
import './stylesheets/base.css'

function start() {
  initializeColorMode('system') // required to read user's preference
  render(
    <ChakraProvider theme={customTheme} resetCSS={true}>
      <Root />
    </ChakraProvider>,
    document.getElementById('root')
  )
}

start()
unregister()
