import { wait } from 'react-testing-library'
import renderApp from '../test/render-app'

it('Should render the `About` page', async () => {
  const { getByText } = renderApp({ route: '/about' })
  await wait(() => getByText(/Why Best of JavaScript/))
})
