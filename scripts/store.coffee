Reflux = require 'reflux'
actions = require './actions'
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
    @errorMessage = ''

    @selectedTag =
      index: 0
      id: '*'
    @selectedSort =
      index: 0
      id: 'stars'

    # Load initial data
    if false then actions.getProjects().catch () ->
      console.log 'Error caught!!!'

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
      errorMessage: @errorMessage
      maxStars: if @popularProjects.length > 0 then @popularProjects[0].stars else 0
      lastUpdate: @lastUpdate
    state

  onGetProjectsCompleted: (data) ->
    projects = data.projects
    @tags = data.tags
    @lastUpdate = new Date(data.date)
    console.info 'Got initial data', @lastUpdate

    @tagsMap = {}
    @counters = @updateCounters projects
    for tag in @tags
      tag.counter = @counters[tag._id]
      @tagsMap[tag._id] = tag
    @allProjects = @populateTagData projects
    @popularProjects = @sortBy @allProjects.slice(0), 'stars'
    @hotProjects = @sortBy @allProjects.slice(0), 'delta1'
    @filteredProjects = @getFilteredProjects()
    @trigger @getState()

  onGetProjectsFailed: (msg) ->
    @errorMessage = "ERROR: #{msg} !"
    @trigger @getState()

  updateCounters: (projects) ->
    counters = {}
    for project in projects
      for id in project.tags
        if counters[id]
          counters[id]++
        else
          counters[id] = 1
    counters

  populateTagData: (projects) ->
    # update project.tags property
    # from an array of ids to an array of objects
    for project in projects
      tags = []
      for tagId in project.tags
        tags.push  @tagsMap[tagId]
      project.tags = tags
    projects

  # <ProjectPage> component triggers actions.getProject(id)
  onGetProject: (id) ->
    found = @allProjects.filter (project) ->
      project._id is id
    console.info 'Request project', id, found[0]
    @project = found[0]
    @trigger @getState()
    actions.getReadme @project

  onGetReadmeCompleted: (data) ->
    console.info 'readme response', data
    readme = marked data.readme
    @project.readme =
      __html: readme
    for tag in @project.tags
      tag.counter = @counters[tag._id]
    @trigger @getState()

  onGetProjectFailed: (err) ->
    @errorMessage = 'ERROR!'
    @trigger @getState()


  onSelectTag: (id) ->
    @selectedTag = @tagsMap[id]

    # reset the text filter (to filter projects using the tag filter only)
    @searchText= ''

    @filteredProjects = @getFilteredProjects()
    window.scrollTo(0,0)
    @trigger @getState()

  onRemoveTag: () ->
    @selectedTag = {}
    @filteredProjects = @getFilteredProjects()
    @trigger @getState()

  onSelectSort: (item) ->
    @selectedSort = item
    @trigger @getState()

  onChangeText: (text) ->
    @searchText = text

    # reset the selected tag (to filter projects using text filter only)
    @selectedTag = {}

    @filteredProjects = @getFilteredProjects()
    @trigger @getState()
    true


  onGetTagCompleted: (data) ->
    @tag = data.tag
    @tag.projects = data.projects
    @trigger @getState()

  getFilteredProjects: () ->
    console.log 'Filter projects', @searchText, @selectedTag._id
    projects = @allProjects
    #Filter by tag
    if @selectedTag._id
      projects = projects.filter (project) =>
        ids = _.pluck(project.tags, '_id')
        project.tags.length > 0 and ids.indexOf(@selectedTag._id) > -1
    #Filter by text
    if @searchText isnt ''
      projects = projects.filter (project) =>
        pattern = if @searchText.length > 2 then @searchText else '^' + @searchText
        re = new RegExp pattern, 'i'
        if re.test project.name then return true
        if @searchText.length > 2
          if re.test project.description then return true
          if re.test project.repository then return true
        false
    @sortProjects projects

  sortBy: (projects, field, direction = 'DESC') ->
    projects.sort (a, b) ->
      diff = _.get(a, field) - _.get(b, field)
      diff * (if direction = 'DESC' then - 1 else 1)

  sortProjects: (projects) ->
    @sortBy projects, @selectedSort.id

  onToggleMenu: () ->
    nodes = window.document.querySelectorAll('#layout, #menuLink, #menu')
    _.forEach nodes, (element) ->
      element.classList.toggle('active')

module.exports = appStore
