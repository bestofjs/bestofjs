console.log 'start the app!'
Reflux = require 'reflux'
request = require 'superagent'

#
# ACTIONS
#
actions = Reflux.createActions
  #Async. actions (ajax requests)
  "getProjects":
    asyncResult: true
  "getProject":
    asyncResult: true
  "getTag":
    asyncResult: true
  "selectTag": {}
  "selectSort": {}
  "changeText": {}


#
# STORES
#

appStore = Reflux.createStore
  listenables: [actions]

  init: () ->
    @filteredProjects = []
    @allProjects = []
    @hotProjects = []
    @popularProjects = []
    @tags = []
    @project = {}
    @tag = {}
    @sort = 'stars'
    @searchText = ''

    @selectedTag =
      index: 0
      id: '*'
    @selectedSort =
      index: 0
      id: 'stars'
    #load initial data
    actions.getProjects()

  getInitialState: () ->
    @getState()

  getState: () ->
    state =
      allProjects: @allProjects
      filteredProjects: @filteredProjects
      popularProjects: @popularProjects
      hotProjects: @hotProjects
      tags: @tags
      selectedTag: @selectedTag
      selectedSort: @selectedSort
      searchText: @searchText
      project: @project
      tag: @tag
      maxStars: if @popularProjects.length > 0 then @popularProjects[0].stars else 0
    state

  onGetProjectsCompleted: (data) ->
    projects = data.projects
    @tags = data.tags

    @tagsMap = {}
    @counters = @updateCounters projects
    for tag in @tags
      tag.counter = @counters[tag._id]
      @tagsMap[tag._id] = tag

    @allProjects = @populateTagData projects


    console.log 'tagsMap', @tagsMap
    @popularProjects = @sortBy @allProjects.slice(0), 'stars'
    @hotProjects = @sortBy @allProjects.slice(0), 'delta1'
    @trigger @getState()

  updateCounters: (projects) ->
    counters = {}
    for project in projects
      for id in project.tags
        if counters[id]
          counters[id]++
        else
          counters[id] = 1
    console.log 'counters', counters
    counters

  populateTagData: (projects) ->
    # update project.tags property
    # from an array of ids to an array of objects
    for project in projects
      tags = []
      for tagId in project.tags
        tags.push  @tagsMap[tagId]
      console.log tags
      project.tags = tags
    projects


  onGetProject: () ->
    @project = {}
    @trigger @getState

  onGetProjectCompleted: (data) ->
    console.log 'project', data
    @project = data.project
    #readme = markdown.toHTML data.readme
    readme = marked data.readme
    @project.readme =
      __html: readme
    for tag in @project.tags
      tag.counter = @counters[tag._id]
    @trigger @getState


  onSelectTag: (item) ->
    @selectedTag = item
    @trigger @getState

  onSelectSort: (item) ->
    @selectedSort = item
    @trigger @getState

  onChangeText: (text) ->
    console.log text
    @searchText = text
    @filteredProjects = @getFilteredProjects()
    @trigger @getState
    true


  onGetTagCompleted: (data) ->
    @tag = data.tag
    @tag.projects = data.projects
    @trigger @getState

  getFilteredProjects: () ->
    console.info 'Filter projects', @searchText
    projects = @allProjects
    #Filter by tag
    if @selectedTag.id isnt '*'
      projects = projects.filter (project) =>
        project.tags.length > 0 and project.tags[0] is @selectedTag.id
    #Filter by text
    if @searchText isnt ''
      projects = projects.filter (project) =>
        re = new RegExp @searchText, 'i'
        re.test project.name
    #console.log 'Sort', projects
    @sortProjects projects

  sortBy: (projects, field, direction = 'DESC') ->
    projects.sort (a, b) ->
      diff = _.get(a, field) - _.get(b, field)
      diff * (if direction = 'DESC' then - 1 else 1)

  sortProjects: (projects) ->
    @sortBy projects, @selectedSort.id

#
# API
#
#path = 'https://bestofjs-michaelrambeau.c9.io/'
#path = 'https://bestofjs.herokuapp.com/'
path = process.env.API
console.info 'API...' + process.env
actions.getProjects.listen () =>
  request.get "#{path}project/all", (err, response) =>
    actions.getProjects.completed response.body

actions.getProject.listen (id) =>
  request.get "#{path}project/#{id}", (err, response) =>
    actions.getProject.completed response.body

actions.getTag.listen (id) =>
  #request.get "#{path}tag/#{id}", (err, response) =>
  request.get "#{path}tag/#{id}", (err, response) =>
    actions.getTag.completed response.body

module.exports =
  store: appStore
  actions: actions
