/*
Script to be run from `npm run rss-once-a-week` command, called by `npn run daily`
to build the XML weekly feed only once a week, on CI servers
*/
/* eslint-disable no-console */
import buildFeed from './build-weekly-feed'

const today = new Date()
const dayOfTheWeek = today.getDay()

if (dayOfTheWeek === 0) {
  console.log("It's Sunday, let's build the weekly feed!")
  buildFeed()
} else {
  console.log('Weekly RSS Feed is built only on Sunday (GMT)')
}
