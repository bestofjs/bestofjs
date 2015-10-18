request = require 'superagent'
actions = require('./actions')

#
# API
#
path = process.env.API

init = () ->

  actions.getProjects.listen () =>
    path = process.env.API
    url = "#{path}projects.json"
    if process.env.NODE_ENV is "development" then console.log '[DEV] Start the app: load project list from', url
    request.get url, (err, response) =>
      if err
        console.log 'FAILED!'
        actions.getProjects.failed err.message
      else
        actions.getProjects.completed response.body

  # actions.getProject.listen (id) =>
  #   request.get "#{path}project/#{id}", (err, response) =>
  #     actions.getProject.completed response.body

  actions.getReadme.listen (project) =>
    webtaskUrl = process.env.GET_README # set up in webpack.*.config.js file
    request.get "#{webtaskUrl}&url=#{project.repository}", (err, response) =>
      actions.getReadme.completed response.body

  actions.getTag.listen (id) =>
    #request.get "#{path}tag/#{id}", (err, response) =>
    request.get "#{path}tag/#{id}", (err, response) =>
      actions.getTag.completed response.body

module.exports = init
