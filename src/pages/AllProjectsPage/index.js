import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TagFilter from '../../components/TagView'
import log from '../../helpers/log'
import * as uiActionCreators from '../../actions/uiActions'
import { getProjectsSortedBy, getAllProjectsCount } from '../../selectors'
import { getPageNumber } from '../../components/common/pagination/helpers'

class AllProjectsPage extends Component {
  render() {
    log('Render the <AllProjectsPage> container', this.props)
    const {
      tagProjects,
      isLoggedin,
      uiActions,
      ui,
      graphProjects,
      count,
      url,
      itemPerPage,
      pageNumber
    } = this.props
    return (
      <TagFilter
        projects={tagProjects}
        total={count}
        url={url}
        graphProjects={graphProjects}
        isLoggedin={isLoggedin}
        ui={ui}
        uiActions={uiActions}
        count={count}
        itemPerPage={itemPerPage}
        pageNumber={pageNumber}
        showTags={true}
      />
    )
  }
}

function mapStateToProps(sortFilter) {
  return function(state, props) {
    const { location } = props
    const pageNumber = getPageNumber(location) || 1
    const itemPerPage = 50
    const start = itemPerPage * (pageNumber - 1)
    const url = location.pathname

    const tagProjects = getProjectsSortedBy({
      criteria: sortFilter,
      start,
      limit: itemPerPage
    })(state)
    const count = getAllProjectsCount(state)
    const {
      auth: { username },
      ui
    } = state
    return {
      tagProjects,
      isLoggedin: username !== '',
      ui: Object.assign({}, ui, {
        starFilter: sortFilter
      }),
      count,
      url,
      itemPerPage,
      pageNumber
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default sortFilter =>
  connect(
    mapStateToProps(sortFilter),
    mapDispatchToProps
  )(AllProjectsPage)
