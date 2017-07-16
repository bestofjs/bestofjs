import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TagFilter from '../components/TagView'
import { getProjectsByTag } from '../selectors'
import log from '../helpers/log'
import * as uiActionCreators from '../actions/uiActions'

class TagFilterPage extends Component {
  render() {
    log('Render the <TagFilterPage> container')
    const {
      tagProjects,
      tag,
      isLoggedin,
      uiActions,
      ui,
      graphProjects
    } = this.props
    return (
      <TagFilter
        projects={tagProjects}
        graphProjects={graphProjects}
        tag={tag}
        maxStars={tagProjects.length > 0 ? tagProjects[0].stars : 0}
        isLoggedin={isLoggedin}
        ui={ui}
        uiActions={uiActions}
      />
    )
  }
}

function mapStateToProps(sortFilter) {
  return function(state, props) {
    const { entities: { tags }, auth: { username }, ui } = state

    const tagId = props.match.params.id
    const tagProjects = getProjectsByTag({
      criteria: sortFilter,
      tagId,
      limit: 100
    })(state)
    return {
      tagProjects,
      // graphProjects,
      tag: tags[tagId],
      isLoggedin: username !== '',
      ui: Object.assign({}, ui, {
        starFilter: sortFilter
      })
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default sortFilter =>
  connect(mapStateToProps(sortFilter), mapDispatchToProps)(TagFilterPage)
