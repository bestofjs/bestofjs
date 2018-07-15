import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'

import renderApp from '../../test/render-app'

it('Should render the `Hall of Fame` page', async () => {
  const { mainNode } = renderApp({ route: '/hall-of-fame' })
  await wait(() => getByText(mainNode, 'JavaScript Hall of Fame'))
  getByText(mainNode, 'Dan Abramov')
})
