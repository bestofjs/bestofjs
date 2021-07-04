import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from '@emotion/react'

import { unregister } from './registerServiceWorker'
import { Root } from './root'

// Old-fashioned stylesheets
import './stylesheets/base.css'

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  colors: {
    blue: '#07c',
    red: '#e10'
  },
  borders: {
    dashed: '1px dashed var(--boxBorderColor)'
  }
}

function start() {
  render(
    <ThemeProvider theme={theme}>
      <Root />
    </ThemeProvider>,
    document.getElementById('root')
  )
}

start()
unregister()
