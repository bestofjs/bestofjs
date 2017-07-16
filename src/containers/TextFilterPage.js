import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import withUser from './withUser'
import TextFilter from '../components/SearchView'
import log from '../helpers/log'
import { searchForProjects } from '../selectors'

import { populate as populateHero, filter as filterHero } from '../helpers/hof'
import * as uiActionCreators from '../actions/uiActions'
import * as myProjectsActionCreators from '../actions/myProjectsActions'

class TextFilterPage extends Component {
  render() {
    log('Render the <TextFilterPage> container', this.props)
    const {
      foundProjects,
      foundHeroes,
      text,
      isLoggedin,
      auth,
      uiActions,
      myProjectsActions,
      ui,
      allHeroesCount
    } = this.props
    return (
      <TextFilter
        projects={foundProjects}
        searchText={text}
        isLoggedin={isLoggedin}
        heroes={foundHeroes}
        auth={auth}
        uiActions={uiActions}
        myProjectsActions={myProjectsActions}
        hotFilter={ui.hotFilter}
        allHeroesCount={allHeroesCount}
        ui={ui}
      />
    )
  }
}

function mapStateToProps(state, props) {
  const { entities: { heroes }, auth, ui } = state
  const text = props.match.params.text
  const foundProjects = searchForProjects(text)(state)
  const allHeroes = Object.keys(heroes).map(id => heroes[id])
  const foundHeroes = allHeroes
    .filter(filterHero(text))
    .slice(0, 10)
    .map(populateHero(state))
  return {
    foundProjects,
    foundHeroes,
    text,
    isLoggedin: auth.username !== '',
    auth,
    ui,
    allHeroesCount: allHeroes.length
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    myProjectsActions: bindActionCreators(myProjectsActionCreators, dispatch)
  }
}

const withUserPage = withUser(TextFilterPage)
export default connect(mapStateToProps, mapDispatchToProps)(withUserPage)
