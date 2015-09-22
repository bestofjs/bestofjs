request = require('superagent')

# start function called by root component (entry.jsx)
start = (cb) ->
  path = process.env.API
  console.log 'Start the app: load project list from', path
  request.get "#{path}project/all", (err, response) =>
    if err then return cb err
    cb null, response.body

# Listen for API calls
api = require('./api')()

module.exports =
  start: start
