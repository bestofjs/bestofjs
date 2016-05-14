import React from 'react'
import { connect } from 'react-redux'

import TextFilter from '../components/home/TextFilter'
import populate from '../helpers/populate'
import log from '../helpers/log'
import filterProjects from '../helpers/filter'
import { populate as populateHero, filter as filterHero } from '../helpers/hof'

const TextFilterPage = React.createClass({

  shouldComponentUpdate(nextProps) {
    return nextProps.text !== this.props.text
  },

  render() {
    log('Render the <TextFilterPage> container', this.props)
    const { foundProjects, foundHeroes, text, isLoggedin, auth } = this.props
    return (
      <TextFilter
        projects={ foundProjects }
        searchText={ text }
        isLoggedin={ isLoggedin }
        heroes={foundHeroes}
        auth={auth}
      />
    )
  }

})

function mapStateToProps(state, props) {
  const {
    entities: { projects, tags, heroes, links },
    githubProjects: { popularProjectIds },
    auth
  } = state

  const text = props.params.text
  const allTags = Object.keys(tags).map(id => tags[id])

  const allProjects = popularProjectIds.map(id => projects[id])
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
    auth
  }
}

export default connect(mapStateToProps, {
})(TextFilterPage)
