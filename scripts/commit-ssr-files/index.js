/*
Read html and xml files generated in the `build` folder and commit to deploy on Github pages.
script launched from `npm run deploy-static-pages` script
To run this file in local, a Github access token is required
Create a `.env` file that contains only: `GITHUB_ACCESS_TOKEN=xxxx`
*/
/* eslint-disable no-console */
const fs = require('fs')
const prettyBytes = require('pretty-bytes')
require('dotenv').config({ silent: true }) // avoid warning about missing `.env` file on CI server

const readFilenamesFromFolder = require('./read-files')
const commit = require('./commit')
const debug = false
const commitMessage = debug ? 'Commit test' : 'Daily deploy'

const PUBLIC_DIR = 'build'

Promise.resolve(PUBLIC_DIR)
  .then(readFilenamesFromFolder)
  .then(filenames => filenames.map(readFile))
  .then(promises => {
    return Promise.all(promises)
      .then(files => commitFiles(files))
      .then(() => console.log('All promises are OK!'))
      .catch(err => console.log('Error in Promise', err))
  })

function readFile(filepath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(`${PUBLIC_DIR}/${filepath}`, 'utf8', (err, data) => {
      if (err) return reject(err)
      const html = data
      console.log('Filesystem OK!', filepath, prettyBytes(data.length))
      return resolve({
        filepath,
        html
      })
    })
  })
}

function commitFiles(files) {
  console.log('Ready to commit files', files.map(file => file.filepath))
  return commit({
    files,
    repo: `michaelrambeau/bestofjs${debug ? '-sandbox' : ''}`,
    message: commitMessage,
    branch: 'gh-pages',
    token: process.env.GITHUB_ACCESS_TOKEN
  })
}
