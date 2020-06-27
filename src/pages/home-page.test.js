import renderApp from '../test/render-app'
// import { wait } from 'react-testing-library'

it('Should render the Homepage', () => {
  const { getByText } = renderApp({ route: '/' })
  getByText('Hot Projects')
})
