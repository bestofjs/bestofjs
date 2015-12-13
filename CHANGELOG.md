# Change log

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
* Shorter URLs for project pages, no more database _id
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
