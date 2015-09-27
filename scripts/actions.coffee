Reflux = require 'reflux'

#
# ACTIONS
#
actions = Reflux.createActions
  #Async. actions (ajax requests)
  "getProjects":
    asyncResult: true
  "getProject": {}
  "getReadme":
    asyncResult: true
  "getTag":
    asyncResult: true
  "selectTag": {}
  "removeTag": {}
  "selectSort": {}
  "changeText": {}
  "toggleMenu": {}

module.exports = actions
