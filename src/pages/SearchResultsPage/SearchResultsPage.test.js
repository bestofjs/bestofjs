// import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'
import renderApp from '../../test/render-app'

xit('Should render the `Search Results` page', async () => {
  const { mainNode } = renderApp({
    route: '/search/axios'
  })
  getByText(mainNode, /Results for/i)
  getByText(mainNode, 'Axios')
  getByText(mainNode, /Promise based HTTP client for the browser/i)
})
