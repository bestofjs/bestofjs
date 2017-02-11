# Change log

# 0.7.0 - 2017-02-11
* Update homepage content, removing popular project list, using the `ProjectCard` components
* Add a 'ALL PROJECT' view
* Update Tag page tabs layout, adding `Trending / Last 12` months option. Requires project API v2.
* Use a svg file for the logo

# 0.6.5 - 2016-12-25
* Improve project README.md styling using the stylesheet from https://github.com/sindresorhus/github-markdown-css project
* Fix error about Hall of Fame "Suggest a new member" button.

# 0.6.4 - 2016-12-01
* Take into account project default branch when calling get-github-readme microservice (#32)

# 0.6.3 - 2016-10-01
* Use micro-service hosted on `now.sh` to get project README.md
* Add URLs for direct access to trend filters, for example `/tags/react/trends/today`
* Remove tabs from 'Hot projects' table in the homepage

# 0.6.2 - 2016-08-04
* Display a SVG icon for some projects (React, Awesome, Redux...), instead of the default repo owner avatar

# 0.6.1 - 2016-07-23
* Add 'Suggest a new Hall of Fame member' button
* Compute project `slug` field from project name instead of using the repository name (because 2 projects have the same `framework` repo name!)

# 0.6.0 - 2016-07-21
* Add project avatar

# 0.5.1 - 2016-07-12
* Add data from npms.io
* Add view options in tag page

## 0.5.0 - 2016-07-03
* Add data from npm (package name and version number) and from http://packagequality.com/ in project card
* Make it compatible with [Redux DevTools Chrome extension](https://github.com/zalmoxisus/redux-devtools-extension)
* Show trends for the last month and the last 3 months using tabs to toggle sort order
* Add 'my requests' view and 'add project' feature, to let user suggest new Github projects (#22)
* New 2-column layout for tag and search result pages (#17)
* Truncate project description in the top page

## 0.4.4 - 2016-06-05
* server-side rendering for Hall of Fame page
* Make URL nicer: use project "slugs" instead of database ids (#19)

## 0.4.3 - 2016-05-28
* Get rid of hash bang URLs using browser history (#18)
* use `react-router-scroll` middleware
* Add emojis in description of project page (#6)

## 0.4.2 - 2016-05-20
* Fix About page bug introduced by 0.4.1 release
* Add some tooltips (in the Hall of Famer card, in the colored bar displayed at the bottom of the projects)
* Track page view events using React Router `onUpdate` to trigger `pageview` events

## 0.4.1 - 2016-05-15
* Add a sort filter in tag pages: sort by total number of stars, stars added yesterday and stars added since last week.
* On mobiles, close the sidebar after navigation occurs
* Trigger search when enter key is pressed in the search box
* Include Hall of Famers in search results
* Display alert after login and logout
* use `why-did-you-update` to track unnecessary renderings in dev

## 0.4.0 - 2016-05-08
* New "Hall of Fame" feature displaying 80 important people (#12)
* Daily/Weekly filter in the top page.

## 0.3.2 - 2016-04-30
* Add logo in the sidebar
* Fix hot reloading for style files
* use `isomorphic-fetch` for http requests
* improve search box algorithm, checking the tags and sorting by relevance
* remove `react-router-redux` dependency to avoid double rendering when navigation occurs

## 0.3.1 - 2016-04-24
* Add Links view in the sidebar
* Add manifest.json
* Avoid http `OPTIONS` requests (#14)
* Upgrade `redux-form` to 5.1.3
* "Github corner" icon

## 0.3.0 - 2016-04-11
* Github login feature using Auth0 authentication service
* Add user generated content feature: "Reviews" and "Links" (#2)
* Update React dependency 0.14.7 -> 15.0.1

## 0.3.0-alpha - 2016-02-29
* html page rendered server-side by `npm run daily` script, run every morning on CI
* Layout adjustment
* Use stateless components as much as possible
* only one JavaScript file in production (merging `vendor` and `app` bundles)
* use Autprefixer PostCSS plugin to add browser prefixes to CSS code.

## 0.2.6 - 2015-12-30
* Cache README.md (only fetch it from Github if needed)
* Fix issue #9

## 0.2.5 - 2015-12-14
* Redux optimization, use middleware for tracking and navigation side effects (scroll to top, close the side menu on mobiles), create `containers` connected to Redux state
* Redirect to homepage for unknown URLs
* Write some tests using the brand new `enzyme` library
* New "Popular tag" menu in the sidebar

## 0.2.4 - 2015-11-28
* Get projects.json from firebase instead of divshot (issue #7)
* Use the new logo in the splash screen
* Add data (last commit, daily star variation) in the `<ProjectPage>`

## 0.2.3 - 2015-11-08
* New sidebar using [slideout](https://github.com/Mango/slideout) JavaScript component instead of pure CSS.
* More colors displayed in the `Delta` bar, inside project blocks.
* Use `topbar` library instead of `pace` for the loading indicator
* Use `vague-time` module instead of `moment` to display dates

## 0.2.2 - 2015-11-05
* Use octicon instead of fontawesome
* Add `pushed_at` information
* Shorter URLs for project pages, no more database `_id`
* Upgrade to babel v6

## 0.2.1 - 2015-10-31
* First tests run with `npm test` command
* `www/index.html` optimization, built from `src/index.html` file, using `npm run minify` command.
* `www/index.html` removed from git index using `git rm --cached www/index.html` command.

## 0.2.0 - 2015-10-24
* Refactoring using Redux instead of Reflux
* Upgrade to React 0.14 and React router 1.0

## 0.1.3 - 2015-10-10
get-readme service URL setup in config files
Remove `marked` dependency because get-readme service now returns HTML content

## 0.1.2 - 2015-10-09
Add Analytics events

## 0.1.1 - 2015-10-07
Add "About" page

## 0.1.0 - 2015-09-28
* The first version pushed to github pages (`bestofjs` repository)
* No more web application listening to requests:
  * Project list got from a JSON static file pushed everyday to divshot.io
  * README.md got from a micro-service created on webtask.io

## 0.0.3 - 2015-09-22
* New layout, with a sidebar that display the tag list.
* Search filter updates the URL: `/#/search/flexb` for example
* No more material-ui dependency
* No more flexboxgrid dependency
* Display a "splash" screen when the page loads
* Initial project data is passed to the root component

## 0.0.2 - 2015-07-21
* Add tag list to the home page
* Add a colored bar to project block, to see star evolution over the last week

## 0.0.1 - 2015-06-20
### The first commit!
Available pages:
* `/home`: home page, with most starred and hot projects
* `/projects`: list of all projects
* `/projects/:project_id` project page, load README.md from GitHub
* `/tags/``:tag_id tag page, list of all associated projects
* `/about` static page; about bestof.js.org project

[How to keep a change log file updated](http://keepachangelog.com/)
