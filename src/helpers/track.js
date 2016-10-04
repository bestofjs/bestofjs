// Analytics tracking, used to track page views and 'View project' events.

import log from './log'

/* global ga */

export default function track (category, action) {
  if (process.env.NODE_ENV === 'test') return false
  if (process.env.NODE_ENV === 'development') {
    log(`ga ${action ? 'event' : 'pageview'} ${category} ${action || ''} (no tracking in [DEV])`)
    return false
  }
  if (typeof ga !== 'undefined' && ga !== null) {
    if (action) {
      ga('send', 'event', category, action)
    } else {
      ga('send', 'pageview', category)
    }
  } else {
    throw new Error('Unable to tack event')
  }
}
