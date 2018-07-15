// import { wait } from 'react-testing-library'
import { getByText } from 'dom-testing-library'
import renderApp from '../../test/render-app'

it('Should render the `React` tag page, and then the `Node.js frameworks` page', async () => {
  const { mainNode, history } = renderApp({
    route: '/tags/react'
  })
  getByText(mainNode, 'React Router')
  getByText(mainNode, 'Create React App')
  history.push('/tags/nodejs-framework')
  getByText(mainNode, /Node\.js framework/i)
  getByText(mainNode, 'Express')
  getByText(mainNode, 'Meteor')
})
