import React, {
  createContext
  // useState, useEffect, useCallback
} from 'react'
import useReactRouter from 'use-react-router'
import { parse, stringify } from 'qs'

// import { allProjects, getAllTags } from '../../selectors'

export const SearchContext = createContext({})

// export const SearchProvider = () => <div>OK</div>

export const SearchProvider = ({ children }) => {
  const { history, location } = useReactRouter()

  const { query, selectedTags, page } = queryStringToState(location.search)

  // const [{ query, selectedTags, page }, setSearchState] = useState(initialState)
  // const { query, selectedTags, page } = initialState

  // const { selectedTags, query } = queryStringToState(search)
  // console.log('>> Render `SearchProvider`', selectedTags, query, search)
  // const isSameState = (state) => {
  //   return state.query === query && state.selectedTags.join('') === selectedTags
  // }
  const onChange = changes => {
    const queryString = stateToQueryString({
      query,
      selectedTags,
      page: 1,
      ...changes
    })
    const path = queryString ? `/projects?${queryString}` : '/' // back to the homepage if there is no query
    history.push(path)
  }
  // onChange = debounce(onChange, 1000, { leading: true })

  // let syncHistory = queryString => {
  //   const path = `/projects?${queryString}`
  //   console.log('>>> PUSH', path)
  //   history.push(path)
  // }

  // const onChangeSortOrder = id => {
  //   const queryString = stateToQueryString({ query, selectedTags, page: 1 })
  //   const paths = {
  //     today: '/trending/today'
  //   }
  //   const path = `/projects${paths[id] | '/'}`
  //   history.push(path)
  // }

  // const [syncHistory] = useDebouncedCallback(queryString => {
  //   history.push({ search: queryString })
  // }, 1000)

  // useEffect(
  //   () => {
  //     if (location.pathname !== '/projects') {
  //       setSearchState({ query: '', selectedTags: [], page: undefined })
  //     }
  //   },
  //   [location.pathname]
  // )

  // useEffect(
  //   () => {
  //     const queryString = stateToQueryString({ query, selectedTags })
  //     const path = `/projects?${queryString}`
  //     console.log('>>> PUSH', path)
  //     history.push(path)
  //   },
  //   [history, query, selectedTags]
  // )

  return (
    <SearchContext.Provider
      value={{ selectedTags, query, page, history, onChange }}
    >
      {children}
    </SearchContext.Provider>
  )
}

function queryStringToState(queryString) {
  const parameters = parse(queryString, { ignoreQueryPrefix: true })

  const selectedTags = parameters.tags || []
  const page = toInteger(parameters.page)

  return {
    selectedTags,
    query: parameters.query || '',
    page
  }
}

function stateToQueryString({ query, selectedTags, page }) {
  return stringify(
    { query, tags: selectedTags, page },
    {
      encode: false,
      // indices: false,
      filter: (prefix, value) => (!value ? undefined : value)
    }
  )
}

const toInteger = (input, defaultValue = 1) =>
  isNaN(input) ? defaultValue : parseInt(input, 0)
