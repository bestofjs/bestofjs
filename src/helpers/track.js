// Analytics tracking, used to track 'View project' and 'Filter tag' actions.
export default function track(category, action) {
  if (process.env.NODE_ENV === "development") {
    return console.info("No tracking in [DEV] '" + category + "' / '" + action + "'");
  } else {
    if (typeof ga !== "undefined" && ga !== null) {
      return ga('send', 'event', category, action);
    } else {
      return console.error('Unable to tack events');
    }
  }
}
