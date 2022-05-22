# Change log

## 0.35 - 2022-05-22

- Use [Vite](http://vitejs.dev/) instead of Create React App to speed up dev server and build times! (#138)
- Add GitHub actions to run tests automatically
- All files converted to `ts` and `tsx` files
- Fix issue related to missing projects on the Timeline page
- Use Node.js 16 to build the project

## 0.34 - 2022-01-30

- Improve project details page, show NPM download graph right away #123
- Allow `$` character in project slugs, removing `slugify` package #122
- Upgrade React 17 and TypeScript 4.4 dependencies
- Fix Windows dev setup

## 0.33.0 - 2021-09-30

- Dark mode #112
- Project logos have both a light `logos/*.svg` and a dark version `logos/*.dark.svg`
- Introduction of [ChakraUI](https://chakra-ui.com/) for core components (buttons, layout primitives...) and "styled system"
- Dropdown menu redone using [Headless UI](https://headlessui.dev/) to avoid `framer-motion` dependency

## 0.32.1 - 2021-08-10

- Font and spacing adjustments #111

## 0.32.0 - 2021-08-09

- Add Discord server link and improve the header #110
- Self host fonts instead of using Google fonts

## 0.31.1 - 2021-07-03

- Scroll to top when navigating through a paginated list of projects

## 0.31.0 - 2021-06-14

- Change dynamically page title #106
- Fix CSS warnings
- Handle `/rankings/monthly` URL (no params) and add link to navigation dropdown button

## 0.30.0 - 2021-05-31

- Add dropdown navigation menu to the header #103
- Add "Related projects" and _Best of JS_ logo to the footer #103
- Use Cloudflare Web Analytics instead of Google Analytics #105
- Add "Sponsors" button to the home page
- Add a link to the CHANGELOG document in the "Application Update" notification

## 0.29.0 - 2021-04-01

- Show monthly rankings in the top page #102
- Add `/rankings/monthly/:year/:month` to show the monthly "full rankings"

## 0.28.0 - 2021-03-21

- Use `Emotion` instead of `Styled Components` to prepare the potential integration of ChakraUI components

## 0.27.1 - 2021-01-01

- Fix: handle `null` data returned by the API to show the heat-map about the daily trends, when there is no data available

## 0.27.0 - 2020-11-18

- Upgrade to Create React App v4.0
- Add quick links section to Project details page

## 0.26.1 - 2020-09-28

- Use `react-content-loader` for avatar placeholder
- Improve error handling when fetching data

## 0.26.0

- Use `react-icons` package for all icons, instead of Octicons CDN link

## 0.25.0 - 2020-08-13

- Add Timeline page #94

## 0.24.1

- Add creation date sort option

## 0.24.0 - 2020-06-28

- Use [Unstated Next](https://github.com/jamiebuilds/unstated-next) instead of Redux to manage the state
- Use [swr](https://swr.vercel.app/) instead of [React Async](https://github.com/async-library/react-async) for data fetching hooks
- Use [Unfetch](https://github.com/developit/unfetch) to make HTTP calls
- Upgrade React 16.13.1
- Use React Suspense to do code splitting

## 0.23.1 - 2020-05-24

- Notify the user when an application update is available
- Introduce TypeScript
- Upgrade to `react-scripts@3.4.1`

## 0.23.0 - 2020-05-09

- Fetch static JSON data from Now.sh (`bestofjs-static-api.now.sh`) instead of Firebase
- Add navigation buttons for the weekly newsletter section

## 0.22.0 - 2020-04-06

- Add monthly download chart to project details page (#78)
- Use Zeit serverless function for API dynamic calls

## 0.21.0 - 2020-03-17

- Add "Recently Added Projects" section to the top page, and sort by date of addition (#86)
- Add "Featured Projects" section to the top page
- Add story and rankings from the weekly newsletter to the top page
- Add `/featured` page

## 0.20.0 - 2019-12-26

- Add monthly trends graph to project details page (#81)
- Add all tags page (#83)

## 0.19.0 - 2019-10-20

- New search engine, the user can combine one or several tags with keywords, in the same search box (#75)
- Promotion of State of JavaScript 2019 survey

## 0.18.0 - 2019-08-14

- Remove "links" and "reviews" feature
- Use hook to fetch project details

## 0.17.0 - 2019-07-18

- Upgrade projects JSON API (hosted on Firebase) `v2` => `v3`
- Upgrade project details API (hosted on Now.sh) `v1` => `v2`

## 0.16.0 - 2019-06-23

- Upgrade `react-scripts@3` and `react@16.8`

## 0.15.3 - 2019-05-11

- Upgrade `react-scripts` from Create React App v2
- Fix error about special symbols in search field (#69)

## 0.14.0 - 2018-10-01

- Add "All Licenses" feature (#53) in Package section

## 0.13.1 - 2018-09-15

- Add link to [State of JavaScript 2018](https://stateofjs.com/)

## 0.13.0 - 2018-08-19

- Add bundle size and package size data (#61)
- Update RSS feed URL, the feed is built from the weekly site https://weekly.bestofjs.org/rss/trends.xml
- Add commit hook, using [pretty-quick](https://github.com/azz/pretty-quick)

## 0.12.0 - 2018-06-01

- Use `styled-components` instead of `stylus` to style the application
- Use `create-react-app` instead of custom webpack settings
- Server-Side-Rendering script disabled
- Load "Hall of Fame" data only from the relevant page, not when the application starts
- Add [JavaScript Weekly](https://weekly.bestofjs.org/) subscription link

## 0.11.3 - 2018-01-20

- `JavaScript Rising Stars` link
- Add tag description

## 0.11.0 - 2017-10-22

- Code splitting

## 0.10.0 - 2017-10-16

- Add npm packages dependency list, commit count and contributor count #52
- Pagination for "All projects" and tag pages #54
- Use `formik` instead of `redux-form` to manage user content forms
- RSS Weekly feed #40

## 0.9.0 - 2017-09-18

- New "Daily Trends" block in `/project/:slug` pages, including a heatmap showing stargazer variations over the last 12 months #33

## 0.8.0 - 2017-07-18

- "My projects" feature #41
- Serve site over https #45
- Use `prettier` to format the code
- Fetch links and reviews related to projects using `bestofjs-api` #48
- Promote "State of JavaScript 2017" in the top page
- Refactoring using `reselect` selectors and removing all `shouldComponentUpdate` statements

## 0.7.5 - 2017-04-29

- Fix search engine (bug introduced by 0.7.4)

## 0.7.4 - 2017-04-27

- Display project custom icon if provided (#39)
- Use `reselect` selector to avoid unnecessary sidebar menu renderings
- Render only once the project list when the homepage loads

## 0.7.3 - 2017-04-22

- Upgrade to `react-hot-loader` v3
- Upgrade to `redux-form` v6, rewrite all forms using the new <Field> approach
- Upgrade to `react-router` v4, create new "routes" components
- Upgrade to `react` v15.5, replace all `createClass` instructions by class syntax

## 0.7.2 - 2017-03-20

- No more database `_id` (#36)

## 0.7.1 - 2017-03-19

- Fix npms.io url (#37)

## 0.7.0 - 2017-02-11

- Update homepage content, removing popular project list, using the `ProjectCard` components
- Add a 'ALL PROJECT' view
- Update Tag page tabs layout, adding `Trending / Last 12` months option. Requires project API v2.
- Use a svg file for the logo

## 0.6.5 - 2016-12-25

- Improve project README.md styling using the stylesheet from https://github.com/sindresorhus/github-markdown-css project
- Fix error about Hall of Fame "Suggest a new member" button.

## 0.6.4 - 2016-12-01

- Take into account project default branch when calling get-github-readme microservice (#32)

## 0.6.3 - 2016-10-01

- Use micro-service hosted on `now.sh` to get project README.md
- Add URLs for direct access to trend filters, for example `/tags/react/trends/today`
- Remove tabs from 'Hot projects' table in the homepage

## 0.6.2 - 2016-08-04

- Display a SVG icon for some projects (React, Awesome, Redux...), instead of the default repo owner avatar

## 0.6.1 - 2016-07-23

- Add 'Suggest a new Hall of Fame member' button
- Compute project `slug` field from project name instead of using the repository name (because 2 projects have the same `framework` repo name!)

## 0.6.0 - 2016-07-21

- Add project avatar

## 0.5.1 - 2016-07-12

- Add data from npms.io
- Add view options in tag page

## 0.5.0 - 2016-07-03

- Add data from npm (package name and version number) and from http://packagequality.com/ in project card
- Make it compatible with [Redux DevTools Chrome extension](https://github.com/zalmoxisus/redux-devtools-extension)
- Show trends for the last month and the last 3 months using tabs to toggle sort order
- Add 'my requests' view and 'add project' feature, to let user suggest new GitHub projects (#22)
- New 2-column layout for tag and search result pages (#17)
- Truncate project description in the top page

## 0.4.4 - 2016-06-05

- server-side rendering for Hall of Fame page
- Make URL nicer: use project "slugs" instead of database ids (#19)

## 0.4.3 - 2016-05-28

- Get rid of hash bang URLs using browser history (#18)
- use `react-router-scroll` middleware
- Add emojis in description of project page (#6)

## 0.4.2 - 2016-05-20

- Fix About page bug introduced by 0.4.1 release
- Add some tooltips (in the Hall of Famer card, in the colored bar displayed at the bottom of the projects)
- Track page view events using React Router `onUpdate` to trigger `pageview` events

## 0.4.1 - 2016-05-15

- Add a sort filter in tag pages: sort by total number of stars, stars added yesterday and stars added since last week.
- On mobiles, close the sidebar after navigation occurs
- Trigger search when enter key is pressed in the search box
- Include Hall of Famers in search results
- Display alert after login and logout
- use `why-did-you-update` to track unnecessary renderings in dev

## 0.4.0 - 2016-05-08

- New "Hall of Fame" feature displaying 80 important people (#12)
- Daily/Weekly filter in the top page.

## 0.3.2 - 2016-04-30

- Add logo in the sidebar
- Fix hot reloading for style files
- use `isomorphic-fetch` for http requests
- improve search box algorithm, checking the tags and sorting by relevance
- remove `react-router-redux` dependency to avoid double rendering when navigation occurs

## 0.3.1 - 2016-04-24

- Add Links view in the sidebar
- Add manifest.json
- Avoid http `OPTIONS` requests (#14)
- Upgrade `redux-form` to 5.1.3
- "GitHub corner" icon

## 0.3.0 - 2016-04-11

- GitHub login feature using Auth0 authentication service
- Add user generated content feature: "Reviews" and "Links" (#2)
- Update React dependency 0.14.7 -> 15.0.1

## 0.3.0-alpha - 2016-02-29

- html page rendered server-side by `npm run daily` script, run every morning on CI
- Layout adjustment
- Use stateless components as much as possible
- only one JavaScript file in production (merging `vendor` and `app` bundles)
- use Autprefixer PostCSS plugin to add browser prefixes to CSS code.

## 0.2.6 - 2015-12-30

- Cache README.md (only fetch it from GitHub if needed)
- Fix issue #9

## 0.2.5 - 2015-12-14

- Redux optimization, use middleware for tracking and navigation side effects (scroll to top, close the side menu on mobiles), create `containers` connected to Redux state
- Redirect to homepage for unknown URLs
- Write some tests using the brand new `enzyme` library
- New "Popular tag" menu in the sidebar

## 0.2.4 - 2015-11-28

- Get projects.json from firebase instead of divshot (issue #7)
- Use the new logo in the splash screen
- Add data (last commit, daily star variation) in the `<ProjectPage>`

## 0.2.3 - 2015-11-08

- New sidebar using [slideout](https://github.com/Mango/slideout) JavaScript component instead of pure CSS.
- More colors displayed in the `Delta` bar, inside project blocks.
- Use `topbar` library instead of `pace` for the loading indicator
- Use `vague-time` module instead of `moment` to display dates

## 0.2.2 - 2015-11-05

- Use octicon instead of fontawesome
- Add `pushed_at` information
- Shorter URLs for project pages, no more database `_id`
- Upgrade to babel v6

## 0.2.1 - 2015-10-31

- First tests run with `npm test` command
- `www/index.html` optimization, built from `src/index.html` file, using `npm run minify` command.
- `www/index.html` removed from git index using `git rm --cached www/index.html` command.

## 0.2.0 - 2015-10-24

- Refactoring using Redux instead of Reflux
- Upgrade to React 0.14 and React router 1.0

## 0.1.3 - 2015-10-10

- `get-readme` service URL setup in config files
- Remove `marked` dependency because get-readme service now returns HTML content instead of markdown

## 0.1.2 - 2015-10-09

Add Analytics events

## 0.1.1 - 2015-10-07

Add "About" page

## 0.1.0 - 2015-09-28

- The first version pushed to github pages (`bestofjs` repository)
- No more web application listening to requests:
  - Project list got from a JSON static file pushed everyday to divshot.io
  - README.md got from a micro-service created on webtask.io

## 0.0.3 - 2015-09-22

- New layout, with a sidebar that display the tag list.
- Search filter updates the URL: `/#/search/flexb` for example
- No more material-ui dependency
- No more `flexboxgrid` dependency
- Display a "splash" screen when the page loads
- Initial project data is passed to the root component

## 0.0.2 - 2015-07-21

- Add tag list to the home page
- Add a colored bar to project block, to see star evolution over the last week

## 0.0.1 - 2015-06-20

### The first commit!

Available pages:

- `/home`: home page, with most starred and hot projects
- `/projects`: list of all projects
- `/projects/:project_id` project page, load README.md from GitHub
- `/tags/`: tag_id tag page, list of all associated projects
- `/about` static page; about bestof.js.org project

[How to keep a change log file updated](http://keepachangelog.com/)
