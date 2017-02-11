import AllProjects from '../containers/AllProjectsPage'
import items from './sortItems'

function AllProjectsRoute () {
  return {
    path: 'projects',
    indexRoute: {
      component: AllProjects('total')
    },
    childRoutes: items.map(item => (
      {
        path: item.path,
        component: AllProjects(item.key)
      }
    ))
  }
}

export default AllProjectsRoute
