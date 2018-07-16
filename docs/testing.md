# Testing the pages with `react-testing-library`

We follow the approach described in [this article](https://blog.kentcdodds.com/introducing-the-react-testing-library-e3a274307e65), trying to test the pages the way the real users interact with the page, rather than testing the component implementation details.

Instead of checking React elements or DOM elements, we target page elements the end-user can see, using:

- `getByText`
- `getByLabelText` (to target an input element by its label)

## Goal

We want to check that all pages visited by the end-user render correctly (at least without throwing an error!)

All pages top level components, defined inside `src/pages/` folder, should have a test written in `XxxxPage.test.js` file.

```
src
├── pages
│   ├── AboutPage
│   │   ├── AboutPage.test.js
│   │   └── index.js
│   ├── HomePage
│   │   ├── HomePage.test.js
│   │   ├── index.js
```

## Strategy

We use `renderApp` function (from `src/test/render-app.js`) to render the application in "test" mode, mocking some dependencies, specifying the "route" we want to visit.

```js
it('Should render the `About` page', async () => {
  const { getByText } = renderApp({ route: '/about' })
  await wait(() => getByText('Why Best of JavaScript ?'))
})
```

Note: we have to "wait" for the element because we use code splitting to load some page bundles on-demand (including the "About" page), therefore we have to wait for the JavaScript bundle related to the page.

`renderApp` method will return an object that includes properties provided by `react-testing-library`, plus some properties we added for convenience:

- `mainNode`: the `<main>` container for the page content
- `history`: the object used to navigate through routes

```js
const { container, getByText, debug, mainNode } = renderApp({
  route: '/tags/react'
})
```

## Tips

Note: `react-testing-library` relies on `dom-testing-library`.

For example, `getByText(text)`, provided by the render method, is a shortcut for the method with the same name, provided by `dom-testing-library`:

```js
import { getByText } from 'dom-testing-library'
getByText(container, text)
```

`debug` function will print the HTML code of the whole page.

To print the content of given HTML element, use `prettyDOM`

```
import { prettyDOM } from 'react-testing-library'
console.log(prettyDOM(mainNode))
```

## About performances

Tests are pretty slow, it takes time to render the application every time we call `renderApp` (around 1 second?).

To navigate through pages, we can call `history.push(route)`... but this is almost as slow!
