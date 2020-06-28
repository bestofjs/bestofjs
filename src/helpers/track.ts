// Analytics tracking, used to track page views and 'View project' events.
import log from './log'

export default function track(category: string, action?: string) {
  if (process.env.NODE_ENV === 'test') return false
  if (process.env.NODE_ENV === 'development') {
    log(
      `ga ${action ? 'event' : 'pageview'} ${category} ${action ||
        ''} (no tracking in [DEV])`
    )
    return false
  }
  if (window.ga) {
    if (action) {
      window.ga('send', 'event', category, action)
    } else {
      window.ga('send', 'pageview', category)
    }
  } else {
    throw new Error('Unable to tack event')
  }
}
