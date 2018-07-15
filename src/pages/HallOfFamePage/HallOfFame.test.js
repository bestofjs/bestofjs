import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'

import renderApp from '../../test/render-app'
import data from '../../test/data/hof.json'
import { fetchHeroesSuccess } from '../../actions/hofActions'

it('Should render the `Hall of Fame` page', async () => {
  const { mainNode, store } = renderApp({ route: '/hall-of-fame' })
  store.dispatch(fetchHeroesSuccess(data))
  await wait(() => getByText(mainNode, 'JavaScript Hall of Fame'))
  getByText(mainNode, 'Dan Abramov')
})
