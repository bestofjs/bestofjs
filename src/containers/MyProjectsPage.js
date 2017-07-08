import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MyProjects from '../components/MyProjects'
import withUser from './withUser'
import populate from '../helpers/populate'
import log from '../helpers/log'
// import filterProjects from '../helpers/filter'
// import { populate as populateHero, filter as filterHero } from '../helpers/hof'
import * as uiActionCreators from '../actions/uiActions'

class MyProjectPage extends Component {
  shouldComponentUpdate (nextProps) {
    return true
    // Render only if search box content has changed of if initial data has changed
    // HoF list may arrive later if `/search/xxx` URL is accessed directely
    // const sameText = nextProps.text === this.props.text
    // const sameData = nextProps.allHeroesCount === this.props.allHeroesCount
    // return !sameText || !sameData
  }
  render () {
    log('Render the <MyProjectsPage> container', this.props)
    const { myProjects, ui, isLoggedin } = this.props
    return (
      <MyProjects
        projects={myProjects}
        ui={ui}
        isLoggedin={isLoggedin}
      />
    )
  }
}

function mapStateToProps (state, props) {
  const {
    entities: { projects, tags, heroes, links },
    githubProjects,
    auth,
    ui
  } = state

  const allProjects = githubProjects.total.map(id => projects[id])
  const myProjects = allProjects.filter(project => project.belongsToMyProjects)
    .map(populate(tags))

  return {
    myProjects,
    // foundHeroes,
    // text,
    // isLoggedin: auth.username !== '',
    // auth,
    ui
    // allHeroesCount: allHeroes.length
  }
}

function mapDispatchToProps (dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(MyProjectPage))
