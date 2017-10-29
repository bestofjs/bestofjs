const jsdom = require('jsdom')
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// Function to be run once before all tests.
function init() {
  configure({ adapter: new Adapter() })
  process.env.NODE_ENV = 'test'
  process.env.VERSION = '0.0.0'
  if (global.window) {
    console.log('((( window object already initialized )))') // eslint-disable-no-console
    return
  }

  // setup the simplest document possible
  var doc = jsdom.jsdom('<!doctype html><html><body></body></html>')

  // get the window object out of the document
  var win = doc.defaultView
  global.document = doc
  global.window = win

  // seems to be required to deal with `dangerouslySetInnerHTML`
  // (README section in the Project page)
  global.navigator = {
    userAgent: 'node.js'
  }
  return
}
module.exports = init
