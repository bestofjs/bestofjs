import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import TagFilter from '../components/TagView'
import { getProjectsByTag, getTagCounters } from '../selectors'
import log from '../helpers/log'
import * as uiActionCreators from '../actions/uiActions'
import { getPageNumber } from '../components/common/pagination/helpers'

class TagFilterPage extends Component {
  render() {
    log('Render the <TagFilterPage> container')
    const {
      tagProjects,
      total,
      tag,
      pageNumber,
      url,
      itemPerPage,
      isLoggedin,
      uiActions,
      ui,
      graphProjects
    } = this.props
    return (
      <TagFilter
        projects={tagProjects}
        total={total}
        itemPerPage={itemPerPage}
        url={url}
        pageNumber={pageNumber}
        graphProjects={graphProjects}
        tag={tag}
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
    const { location } = props
    const pageNumber = getPageNumber(location) || 1
    const itemPerPage = 50
    const start = itemPerPage * (pageNumber - 1)
    const url = location.pathname

    const tagId = props.match.params.id
    const total = getTagCounters(state)[tagId]
    const tagProjects = getProjectsByTag({
      criteria: sortFilter,
      tagId,
      start,
      limit: itemPerPage
    })(state)
    return {
      tagProjects,
      total,
      pageNumber,
      itemPerPage,
      url,
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
  withRouter(
    connect(mapStateToProps(sortFilter), mapDispatchToProps)(TagFilterPage)
  )
