import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import withUser from '../../containers/withUser'
import TextFilter from '../../components/SearchView'
import log from '../../helpers/log'
import * as uiActionCreators from '../../actions/uiActions'
import * as myProjectsActionCreators from '../../actions/myProjectsActions'
import { searchForProjects } from '../../selectors'
import { searchForHeroes } from '../../selectors/hall-of-fame'

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
      ui
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
        ui={ui}
      />
    )
  }
}

function mapStateToProps(state, props) {
  const { auth, ui } = state
  const text = props.match.params.text
  const foundProjects = searchForProjects(text)(state)
  const foundHeroes = searchForHeroes(text)(state)
  return {
    foundProjects,
    foundHeroes,
    text,
    isLoggedin: auth.username !== '',
    auth,
    ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    myProjectsActions: bindActionCreators(myProjectsActionCreators, dispatch)
  }
}

const withUserPage = withUser(TextFilterPage)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUserPage)
