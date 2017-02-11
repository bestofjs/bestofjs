import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TagFilter from '../components/TagView'
import populate from '../helpers/populate'
import log from '../helpers/log'
import * as uiActionCreators from '../actions/uiActions'

const AllProjectsPage = React.createClass({

  shouldComponentUpdate (nextProps) {
    // `shouldComponentUpdate` has been implemented to avoid
    // rendering the page twice when browsing tags.
    if (!nextProps.tag) return false
    const sameUi = Object.keys(nextProps.ui)
      .every(key => this.props.ui[key] === nextProps.ui[key])
    return nextProps.tag.id !== this.props.tag.id || !sameUi
  },

  render () {
    log('Render the <AllProjectsPage> container', this.props)
    const { tagProjects, isLoggedin, uiActions, ui, graphProjects, count } = this.props
    return (
      <TagFilter
        projects={tagProjects}
        graphProjects={graphProjects}
        maxStars={tagProjects.length > 0 ? tagProjects[0].stars : 0}
        isLoggedin={isLoggedin}
        ui={ui}
        uiActions={uiActions}
        count={count}
      />
    )
  }

})

function mapStateToProps (sortFilter) {
  return function (state, props) {
    const {
      entities: { projects, tags, links },
      githubProjects,
      auth: {
        username
      },
      ui
    } = state

    const allProjects = githubProjects[sortFilter]
    const count = allProjects.length

    const tagProjects = allProjects
      .map(id => projects[id])
      .slice(0, 50)
      .map(populate(tags, links))
    const graphProjects = tagProjects
      .slice(0, 10)
    return {
      tagProjects,
      graphProjects,
      isLoggedin: username !== '',
      ui: Object.assign({}, ui, {
        starFilter: sortFilter
      }),
      count
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default sortFilter => connect(
  mapStateToProps(sortFilter),
  mapDispatchToProps
)(AllProjectsPage)
