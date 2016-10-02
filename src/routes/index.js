import App from '../containers/App'
import getHomePage from '../containers/HomePage'
import About from '../containers/AboutPage'
import HoF from '../containers/HoFPage'
import TextFilter from '../containers/TextFilterPage'
import Links from '../containers/LinksPage'

import ProjectsRoute from './ProjectsRoute'
import TagsRoute from './TagsRoute'
import RequestsRoute from './RequestsRoute'

function getRoutes (count = 3) {
  const Home = getHomePage(count)
  const HomeRoute = {
    component: Home
  }
  return {
    path: '/',
    component: App,
    indexRoute: HomeRoute,
    childRoutes: [
      {
        path: 'hof',
        component: HoF
      },
      {
        path: 'about',
        component: About
      },
      {
        path: 'search/:text',
        component: TextFilter
      },
      {
        path: 'links',
        component: Links
      },
      TagsRoute(),
      ProjectsRoute(),
      ...RequestsRoute()
    ]
  }
}

export default getRoutes
