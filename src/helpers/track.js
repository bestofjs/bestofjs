// Analytics tracking, used to track 'View project' and 'Filter tag' actions.

/* global ga */

export default function track(category, action) {
  if (process.env.NODE_ENV === 'development') {
    console.info("No tracking in [DEV] '" + category + "' / '" + action + "'");
  } else {
    if (typeof ga !== 'undefined' && ga !== null) {
      ga('send', 'event', category, action);
    } else {
      console.error('Unable to tack event');
    }
  }
}
