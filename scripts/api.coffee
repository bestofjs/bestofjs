request = require 'superagent'
actions = require('./actions')

#
# API
#
#path = 'https://bestofjs-michaelrambeau.c9.io/'
#path = 'https://bestofjs.herokuapp.com/'
path = process.env.API
console.info 'API...' + process.env

init = () ->

  actions.getProjects.listen () =>
    # request.get "#{path}project/all", (err, response) =>
    console.info 'Get projects'
    request.get "http://development.bestofjs-data.divshot.io/projects.json", (err, response) =>
      if err
        console.log 'FAILED!'
        actions.getProjects.failed err.message
      else
        console.info 'GET DATA!'
        actions.getProjects.completed response.body

  actions.getProject.listen (id) =>
    request.get "#{path}project/#{id}", (err, response) =>
      actions.getProject.completed response.body

  actions.getTag.listen (id) =>
    #request.get "#{path}tag/#{id}", (err, response) =>
    request.get "#{path}tag/#{id}", (err, response) =>
      actions.getTag.completed response.body

module.exports = init
