import SubmitRepoPage from '../containers/SubmitRepoPage'
import SubmitHeroPage from '../containers/SubmitHeroPage'
import UserRequestsPage from '../containers/UserRequestsPage'

function RequestsRoute () {
  return [
    {
      path: 'requests',
      component: UserRequestsPage
    },
    {
      path: 'requests/add-project',
      component: SubmitRepoPage
    },
    {
      path: 'requests/add-hero',
      component: SubmitHeroPage
    }
  ]
}

export default RequestsRoute
