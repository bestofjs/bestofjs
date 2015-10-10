request = require('superagent')

# start function called by root component (entry.jsx)
start = (cb) ->
  path = process.env.API
  url = "#{path}projects.json"
  if process.env.NODE_ENV is "development" then console.log '[DEV] Start the app: load project list from', url
  request.get url, (err, response) =>
    if err then return cb err
    cb null, response.body

# Listen for API calls
api = require('./api')()

module.exports =
  start: start
