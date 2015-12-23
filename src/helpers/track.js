// Analytics tracking, used to track 'View project' and 'Filter tag' actions.

import log from './log';

/* global ga */

export default function track(category, action) {
  if (process.env.NODE_ENV === 'development') {
    log("No tracking in [DEV] '" + category + "' / '" + action + "'");
  } else {
    if (typeof ga !== 'undefined' && ga !== null) {
      ga('send', 'event', category, action);
    } else {
      throw new Error('Unable to tack event');
    }
  }
}
