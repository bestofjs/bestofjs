# BestOfJS weekly RSS feed

## Goal

Create a RSS feed available for RSS readers such as feedly.com or Netvibes, as requested by users in https://github.com/michaelrambeau/bestofjs-webui/issues/40 issue.

Every week an XML file should be created.
This file would display the **hottest projects of the week**, the same list as https://bestof.js.org/projects/trending/this-week

## Implementation

The XML file is created in the `www` folder so that it can be available from the following URL:

https://bestof.js.org/rss/weekly-trends.xml

## Scheduling

We use the `build scheduler` feature of SemaphoreCI server to generate the feed once a week.
We already use this feature to do "server-side rendering", every day.
So we are going to add a step in the **daily** build process, but this step will trigger the feed creation **only** once a week.

2 new npm commands have been created:

* `npm run rss`: manually generate the XML weekly feed
* `npm run rss-once-a-week`: trigger the XML generation, only once a week (if the day is Sunday)

`npm run daily` script, used to has been added to trigger the XML generation, has been updated.


```json
{
  "daily": "npm run build-html && npm run build-html-hof && npm run deploy-html && npm run rss-once-a-week",
  "rss-once-a-week": "babel-node scripts/rss/once-a-week",
  "rss": "babel-node scripts/rss"
}
```
