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
    @allProjects = data.projects
    @tags = data.tags
    @popularProjects = @sortBy @allProjects.slice(0), 'stars'
    @hotProjects = @sortBy @allProjects.slice(0), 'delta1'
    @trigger @getState

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
    @trigger @getState
    self = this
    fn = () =>
      console.log 'update!!!'
      self.filteredProjects = self.getFilteredProjects()
      self.trigger self.getState()
      true
    _.throttle(fn, 2000)()
    #update()
    true


  onGetTagCompleted: (data) ->
    @tag = data.tag
    @tag.projects = data.projects
    @trigger @getState

  getFilteredProjects: () ->
    projects = @allProjects
    #console.log 'Filter', projects
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
path = 'https://bestofjs.herokuapp.com/'
console.log 'API...'
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
