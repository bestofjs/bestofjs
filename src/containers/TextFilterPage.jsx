import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TextFilter from '../components/home/TextFilter'
import populate from '../helpers/populate'
import log from '../helpers/log'
import filterProjects from '../helpers/filter'
import { populate as populateHero, filter as filterHero } from '../helpers/hof'
import * as uiActionCreators from '../actions/uiActions'

const TextFilterPage = React.createClass({

  shouldComponentUpdate(nextProps) {
    // Render only if search box content has changed of if initial data has changed
    // HoF list may arrive later if `/search/xxx` URL is accessed directely
    const sameText = nextProps.text === this.props.text
    const sameData = nextProps.allHeroesCount === this.props.allHeroesCount
    return !sameText || !sameData
  },

  render() {
    log('Render the <TextFilterPage> container', this.props)
    const { foundProjects, foundHeroes, text, isLoggedin, auth, uiActions, ui, allHeroesCount } = this.props
    return (
      <TextFilter
        projects={ foundProjects }
        searchText={ text }
        isLoggedin={ isLoggedin }
        heroes={foundHeroes}
        auth={auth}
        uiActions={uiActions}
        hotFilter={ui.hotFilter}
        allHeroesCount={allHeroesCount}
      />
    )
  }

})

function mapStateToProps(state, props) {
  const {
    entities: { projects, tags, heroes, links },
    githubProjects,
    auth,
    ui
  } = state

  const text = props.params.text
  const allTags = Object.keys(tags).map(id => tags[id])

  const allProjects = githubProjects.total.map(id => projects[id])
  const foundProjects = filterProjects(allProjects, allTags, text)
    .slice(0, 50)
    .map(populate(tags, links))

  const allHeroes = Object.keys(heroes).map(id => heroes[id])
  const foundHeroes = allHeroes.filter(filterHero(text))
    .slice(0, 10)
    .map(populateHero(projects))

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
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextFilterPage)
