// Read html files generated in www folder and commit to deploy on Github pages.
// script launched from `npm run deploy-html`
// To run this file in local, a Github access token is required
// Create a `.env` file that contains only: `GITHUB_ACCESS_TOKEN=xxxx`
const fs = require('fs')
require('dotenv').load()

const commit = require('./commit')
const debug = false
const commitMessage = debug ? 'Commit test' : 'Daily deploy'

const filepaths = ['index.html', 'hof/index.html']

const arr = filepaths.map(path => readFile(path))
Promise.all(arr)
  .then(files => commitFiles(files))
  .then(() => console.log('All promises are OK!'))
  .catch(err => console.log('Error in Promise', err))

function readFile (filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(`www/${filepath}`, 'utf8', (err, data) => {
      if (err) return reject(err)
      // const html = `<p>Empty content, created at ${new Date()}</p>`
      const html = data
      console.log('Filesystem OK!', filepath, data.length)
      return resolve({
        filepath,
        html
      })
    })
  })
}

function commitFiles (files) {
  console.log('Ready to commit files', files.map(file => file.filepath));
  return commit({
    files,
    repo: `michaelrambeau/bestofjs${debug ? '-sandbox' : ''}`,
    message: commitMessage,
    branch: 'gh-pages',
    token: process.env.GITHUB_ACCESS_TOKEN
  })
}
