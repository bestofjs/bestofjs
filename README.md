![bestofjs logo](http://michaelrambeau.com/img/blog/2015-10-bestofjs.jpg)

[![Build Status](https://travis-ci.org/michaelrambeau/bestofjs-webui.svg?branch=master)](https://travis-ci.org/michaelrambeau/bestofjs-webui)

## Concept

[bestof.js.org](http://bestof.js.org/) is an application to check the latest trends about open source projects related to the web platform (JavaScript of course, but also html, css...)
This is a place where font-end engineers and node.js developers can find the best components to build amazing web applications:

* Frameworks
* Librairies
* CSS tools
* Testing tools
* and many other things...

## How it works

A list of projects related to the web platform (JavaScript of course but also HTML and CSS) is stored in a MongoDB database.

Everytime we find a new project, we add it to the database.

Then everyday, an automatic task checks project data from Github, for every project stored and generates data consumed by the web application. This batch is an other repository: [bestofjs-batches](https://github.com/michaelrambeau/bestofjs-batches).

The web application displays the total number of stars and their variation over the last days.

## Road map

Features coming sooner or later:

* See project last commit date (to check projects that are really active)
* User generated content: project reviews and useful resources about projects
* Hall of fame: add a link to see a list of some of the most important members of the community (great contributors like Sindre, Substack, TJ...)

## Technical overview

This repository is the front-end application, a single-page application built with the following technologies:

* [React](http://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [React router](https://github.com/rackt/react-router)
* [Webpack](http://webpack.github.io/)

Webpack is used to built the application in development and production mode.

Related repositories:

* [bestofjs-keystonejs](https://github.com/michaelrambeau/bestofjs-keystonejs): the web application used by admin users to manage data (used to add projects and tags for example). Built with [KeystoneJS](http://keystonejs.com/), a node.js CMS.
* [bestofjs-batches](https://github.com/michaelrambeau/bestofjs-batches): Scheduled tasks that generate every day data used by the web application.
* [bestofjs-microservices](https://github.com/michaelrambeau/microservices): microservice used to retrieve project information from Github, when a project is opened in the webui application
* [bestofjs](https://github.com/michaelrambeau/bestofjs): repository used to deploy content to Github pages, linked to js.org domain. Generated from bestofjs-webui repository.


## URLs and environments

* http://bestof.js.org/ production version is hosted on Github pages, using `.js.org` domain provided by https://js.org/
* Firebase (deployed manually, used to share development features): https://bestofjs.firebaseapp.com/
* Netlify (automatically built from `staging` branch): http://bestofjs.netlify.com/

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
