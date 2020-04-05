import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'

import renderApp from '../test/render-app'

const routes = ['/project/redux/links', '/project/redux/reviews']

it('Should render the `Redux` project page', async () => {
  const { mainNode, history } = renderApp({ route: '/projects/redux' })
  await wait(() => getByText(mainNode, 'Redux'))
  getByText(mainNode, /Predictable state container for JavaScript apps/i)
  const testPage = route => {
    history.push(route)
  }
  routes.forEach(testPage)
  // TODO: check what happens for a logged-in user
})
