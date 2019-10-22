import React from 'react'
import { render } from 'react-dom'

import { unregister } from './registerServiceWorker'
import { Root } from './root'

// Old-fashioned stylesheets
import './stylesheets/base.css'

function start() {
  render(<Root />, document.getElementById('root'))
}

start()
unregister()
