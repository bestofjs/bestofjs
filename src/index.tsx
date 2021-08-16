import React from 'react'
import { render } from 'react-dom'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

import { unregister } from './registerServiceWorker'
import { Root } from './root'
import { customTheme } from 'theme'

// Old-fashioned stylesheets
import './stylesheets/base.css'

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
