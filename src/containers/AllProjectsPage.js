import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TagFilter from '../components/TagView'
import log from '../helpers/log'
import * as uiActionCreators from '../actions/uiActions'
import { getProjectsSortedBy, getAllProjectsCount } from '../selectors'

class AllProjectsPage extends Component {
  shouldComponentUpdate(nextProps) {
    // `shouldComponentUpdate` has been implemented to avoid
    // rendering the page twice when browsing tags.
    if (!nextProps.tag) return false
    const sameUi = Object.keys(nextProps.ui).every(
      key => this.props.ui[key] === nextProps.ui[key]
    )
    return nextProps.tag.id !== this.props.tag.id || !sameUi
  }
  render() {
    log('Render the <AllProjectsPage> container', this.props)
    const {
      tagProjects,
      isLoggedin,
      uiActions,
      ui,
      graphProjects,
      count
    } = this.props
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
}

function mapStateToProps(sortFilter) {
  return function(state, props) {
    const tagProjects = getProjectsSortedBy({
      criteria: sortFilter,
      limit: 50
    })(state)
    const count = getAllProjectsCount(state)
    const { auth: { username }, ui } = state
    return {
      tagProjects,
      isLoggedin: username !== '',
      ui: Object.assign({}, ui, {
        starFilter: sortFilter
      }),
      count
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default sortFilter =>
  connect(mapStateToProps(sortFilter), mapDispatchToProps)(AllProjectsPage)
