import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router-dom'

import List from './List'
import Edit from './Edit'
import Create from './Create'
import ProjectTabsContent from '../ProjectTabsContent'
import Tabs from '../Tabs'

const rootPath = '/projects/:id/reviews'

const ReviewIndex = props => {
  const { project, reviews, links } = props
  return (
    <>
      <Tabs
        project={project}
        activePath="reviews"
        reviews={reviews}
        links={links}
      />
      <ProjectTabsContent style={{ marginBottom: '2em' }}>
        <Switch>
          <Route exact path={rootPath} render={() => <List {...props} />} />
          <Route
            exact
            path={`${rootPath}/:reviewId/edit`}
            render={() => <Edit {...props} />}
          />
          <Route
            exact
            path={`${rootPath}/add`}
            render={() => <Create {...props} />}
          />
        </Switch>
      </ProjectTabsContent>
    </>
  )
}

export default ReviewIndex
