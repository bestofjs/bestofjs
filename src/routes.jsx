import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './containers/App'
import getHomePage from './containers/HomePage'
import About from './containers/AboutPage'
import HoF from './containers/HoFPage'
import TagFilter from './containers/TagFilterPage'
import TextFilter from './containers/TextFilterPage'
import Links from './containers/LinksPage'

// Single Project page
import ProjectPage from './containers/ProjectPage'

import ProjectGithubTab from './components/ProjectView/GithubTab'

import ProjectLinksTab from './components/ProjectView/LinksTab'
import ProjectLinksList from './components/ProjectView/LinksTab/List'
import ProjectLinksAdd from './components/ProjectView/LinksTab/Create'
import ProjectLinksEdit from './components/ProjectView/LinksTab/Edit'

import ProjectReviewsTab from './components/ProjectView/ReviewsTab'
import ProjectReviewsList from './components/ProjectView/ReviewsTab/List'
import ProjectReviewsAdd from './components/ProjectView/ReviewsTab/Create'
import ProjectReviewsEdit from './components/ProjectView/ReviewsTab/Edit'

const getRoutes = (count = 3) => {
  const Home = getHomePage(count)
  return (
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="home" component={Home}/>
      <Route path="about" component={About}/>
      <Route path="hof" component={HoF}/>
      <Route path="links" component={Links}/>
      <Route path="projects/:id" component={ProjectPage}>
        <IndexRoute component={ProjectGithubTab} />
        <Route path="readme" component={ProjectGithubTab} />
        <Route path="links" component={ProjectLinksTab}>
          <IndexRoute component={ProjectLinksList} />
          <Route path="add" component={ProjectLinksAdd} />
          <Route path=":linkId/edit" component={ProjectLinksEdit} />
        </Route>
        <Route path="reviews" component={ProjectReviewsTab}>
          <IndexRoute component={ProjectReviewsList} />
          <Route path="add" component={ProjectReviewsAdd} />
          <Route path=":reviewId/edit" component={ProjectReviewsEdit} />
        </Route>
        <Route path="reviews" component={ProjectReviewsTab} />
      </Route>
      <Route path="tags/:id" component={ TagFilter } />
      <Route path="search/:text" component={ TextFilter }/>
      <Redirect from="*" to="home" />
    </Route>
  )
}

export default getRoutes
