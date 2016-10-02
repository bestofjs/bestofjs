import TagFilter from '../containers/TagFilterPage'

const items = [
  {
    path: 'popular',
    key: 'total'
  },
  {
    path: 'trending/today',
    key: 'daily'
  },
  {
    path: 'trending/this-week',
    key: 'weekly'
  },
  {
    path: 'trending/this-month',
    key: 'monthly'
  },
  {
    path: 'trending/last-3-months',
    key: 'quaterly'
  },
  {
    path: 'score/packagequality',
    key: 'packagequality'
  },
  {
    path: 'score/npms',
    key: 'npms'
  }
]

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
