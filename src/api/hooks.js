import { useAsync } from 'react-async'
import { addBookmark, removeBookmark } from '../actions'

import getApiRootURL from './config'
import { fetchHTML, fetchJSON } from '../helpers/fetch'
import { useSelector, useDispatch } from 'react-redux'

export function useFetchProjectReadMe({ full_name, branch }) {
  return useAsync({
    promiseFn: fetchProjectReadMe,
    watch: full_name,
    full_name,
    branch
  })
}

function fetchProjectReadMe({ full_name, branch = 'master' }) {
  const url = `${getApiRootURL('GET_README')}/${full_name}?branch=${branch}`
  return fetchHTML(url)
}

export function useFetchProjectDetails({ full_name }) {
  return useAsync({
    promiseFn: fetchProjectDetails,
    watch: full_name,
    full_name
  })
}

function fetchProjectDetails({ full_name }) {
  const url = `${getApiRootURL('GET_PROJECT_DETAILS')}/projects/${full_name}`
  return fetchJSON(url)
}

export function useUser() {
  const { username, name } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const isLoggedIn = username !== ''
  return {
    isLoggedIn,
    username,
    name,
    addBookmark: project => dispatch(addBookmark(project)),
    removeBookmark: project => dispatch(removeBookmark(project))
  }
}
