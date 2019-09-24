import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'
import renderApp from '../test/render-app'

it('Should render `My projects` page', async () => {
  const { mainNode } = renderApp({
    route: '/bookmarks'
  })
  await wait(() => getByText(mainNode, /Bookmarked projects/i))
  getByText(mainNode, 'Please sign-in to access this feature!')
  // TODO: check what happens for a logged-in user
})
