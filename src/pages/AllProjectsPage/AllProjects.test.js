import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'

import renderApp from '../../test/render-app'

const routes = [
  '/projects/trending/today',
  '/projects/trending/this-week',
  '/projects/trending/this-month',
  '/projects/trending/last-3-months',
  '/projects/trending/last-12-months'
]

it('Should render the `All projects` page', async () => {
  const { mainNode, history } = renderApp({ route: '/projects' })
  await wait(() => getByText(mainNode, 'All projects'))
  const testPage = route => {
    history.push(route)
    getByText(mainNode, /Popular/i)
    getByText(mainNode, /Trending/i)
    getByText(mainNode, /Vue/i)
  }
  routes.forEach(testPage)
})
