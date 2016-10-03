[![bestofjs screenshot](https://cloud.githubusercontent.com/assets/5546996/16543336/4791cf2e-410a-11e6-8e30-cd6b971953b2.png)](http://bestof.js.org/)

[![Build Status](https://travis-ci.org/michaelrambeau/bestofjs-webui.svg?branch=master)](https://travis-ci.org/michaelrambeau/bestofjs-webui)

[![Join the chat at https://gitter.im/michaelrambeau/bestofjs-webui](https://badges.gitter.im/michaelrambeau/bestofjs-webui.svg)](https://gitter.im/michaelrambeau/bestofjs-webui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Concept

[bestof.js.org](http://bestof.js.org/) gathers the latest trends about open source projects related to the web platform: JavaScript of course (client and server side) but also html, css...

This is a place where font-end engineers and node.js developers can find the best components to build amazing web applications:

* Frameworks
* Libraries
* CSS toolkits
* Testing tools
* and many other things...

2 new features have been added recently (May 2015):

* Users can sign in with their Github account and add "Reviews" and "Links" about the projects they care. Anyone can contribute!
* A Hall of Fame has been created to gather the most amazing people of the community: developers, authors, speakers, mentors...

## How it works

A list of projects related to the web platform (JavaScript of course but also HTML and CSS) is stored in a MongoDB database.

Every time we find a new project, we add it to the database.

Then everyday, an automatic task checks project data from Github, for every project stored and generates data consumed by the web application. This batch is an other repository: [bestofjs-batches](https://github.com/michaelrambeau/bestofjs-batches).

The web application displays the total number of stars and their variation over the last days.


## Technical overview

### Cloud services

#### Database: [mLab](https://mlab.com/)

Database-as-a-Service for MongoDB

#### CI Server: [SemaphoreCI](https://semaphoreci.com/)

The "build scheduler" is used to generate static JSON files every day.

#### node.js microservices

[webtask.io](https://webtask.io/) runs node.js micro services used by the application.

#### Authentication

[Auth0](https://auth0.com/): authentication as a service, used for Github login feature.

#### Static hosting

[Firebase](https://www.firebase.com/): used to serve json data used by the single-page application

### Libraries

This repository is the front-end application, a single-page application built with the following modules:

* [React](http://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [React router](https://github.com/rackt/react-router)
* [Webpack](http://webpack.github.io/)

Webpack is used to build the application in development and production mode.

### Repositories

bestof.js.org application is made of 5 repositories:

* [bestofjs-webui](https://github.com/michaelrambeau/bestofjs-webui) (this repo!): the single-page application for end users
* [bestofjs-admin](https://github.com/michaelrambeau/bestofjs-admin): the web application used by admin users to manage content (used to add projects, tags and hall of fame members for example). Built with [KeystoneJS](http://keystonejs.com/), a node.js CMS.
* [bestofjs-batches](https://github.com/michaelrambeau/bestofjs-batches): Scheduled tasks that generate every day data used by the web application.
* [bestofjs-webtasks](https://github.com/michaelrambeau/bestofjs-webtasks): microservices used to serve dynamic data: to read and write user-generated content (links and reviews), to get README.md from Github when a project is opened.
* [bestofjs](https://github.com/michaelrambeau/bestofjs): repository used to deploy content to Github pages, linked to js.org domain. Generated from bestofjs-webui repository, does not contain any source code.


## URLs and environments

http://bestof.js.org/ production version is hosted on Github pages, using `.js.org` domain provided by https://js.org/.

Other URLs, used to preview features:

* Firebase (deployed manually using `npm run firebase` command): https://bestofjs.firebaseapp.com/
* Netlify (automatically built from `staging` branch): http://bestofjs.netlify.com/
* Surge (deployed manually using `npm run surge` command): http://bestofjs.surge.sh/

## Commands

### Development workflow

Start the web server and watch for changes on the filesystem:

```
npm start
```

The application should be running at [localhost:8080/index.html](http://localhost:8080/index.html)


Thank to [React hot loader](http://gaearon.github.io/react-hot-loader/), every time a React component is updated, the UI is automatically updated, without losing the application state.

Note: built files are not written on the disk, they are served by the Webpack server that keeps them in memory. Therefore before uploading files to the production web server, the production files have to be built using a specific command.

### Production deploy

Build the files for production (`index.html` rendered server-side, `build/app.css` and `build/bundle-app.js`):

```
npm run build
```

Push all files to Github pages
```
npm run gh-pages
```

Note: a specific repository [bestofjs](https://github.com/michaelrambeau/bestofjs), that contains only one branch `gh-pages`, has been created to host the content on Github pages.

These 2 commands can be combined into one single command:

```
npm run deploy
```

### Deploys to other static host services

Firebase (requires `firebase-tools` module to be installed)

```
npm run firebase
```

Surge.sh (requires `surge` module to be installed)

```
npm run surge
```

### Daily update

Data come from a static JSON file `projects.json` hosted on a CDN (Firebase).
Every morning at 6:00 AM (21:00 UTC), the JSON file is updated by a daily batch running in `bestofjs-batches` repository.

Then, 30 minutes later, `npm run daily` command is launched from this repository, in order to rebuild the html file, using React server-side rendering feature.

`npm run daily` is split into 2 tasks:

* `npm run build-html`: build `www/index.html` in local, requesting data by http from `projects.json`
* `npm run deploy-html`: commit `www/index.html` to `bestofjs` repository, using Github API.

### Testing

Run unit tests:

```
npm test
```

Run unit tests in debug mode, to be able to see console.log in the terminal window:

```
npm run test-debug
```

Run test from only one single file:

```
babel-node test/components/ProjectPageSpec.js
```
