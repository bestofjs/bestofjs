request = require('superagent')

# start function called by root component (entry.jsx)
start = (cb) ->
  path = process.env.API
  url = "#{path}project/all"
  url = "http://bestofjs-data.divshot.io/projects.json"
  console.log 'Start the app: load project list from', url
  request.get url, (err, response) =>
    if err then return cb err
    cb null, response.body

# Listen for API calls
api = require('./api')()

module.exports =
  start: start
