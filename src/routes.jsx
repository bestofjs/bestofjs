import React from 'react'
import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import Redirect from 'react-router/lib/Redirect'

import App from './containers/App'
import getHomePage from './containers/HomePage'
import About from './containers/AboutPage'
import HoF from './containers/HoFPage'
import TagFilter from './containers/TagFilterPage'
import TextFilter from './containers/TextFilterPage'
import Links from './containers/LinksPage'

// Single Project page
import ProjectPage from './containers/ProjectPage'

import SubmitRepoPage from './containers/SubmitRepoPage'
import SubmitHeroPage from './containers/SubmitHeroPage'
import UserRequestsPage from './containers/UserRequestsPage'

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
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home}/>
      <Route path="requests" component={UserRequestsPage}/>
      <Route path="requests/add-project" component={SubmitRepoPage}/>
      <Route path="requests/add-hero" component={SubmitHeroPage}/>
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
      <Redirect from="*" to="/" />
    </Route>
  )
}

export default getRoutes
