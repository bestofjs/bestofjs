import TagFilter from '../containers/TagFilterPage'
import items from './sortItems'

function TagsRoute () {
  return {
    path: 'tags/:id',
    indexRoute: {
      component: TagFilter('total')
    },
    childRoutes: items.map(item => (
      {
        path: item.path,
        component: TagFilter(item.key)
      }
    ))
  }
}

export default TagsRoute
