import { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { createContainer } from 'unstated-next'
import useSWR from 'swr'
import { stringify } from 'querystring'

import { fetchJSON } from 'helpers/fetch'

type TokenInfoResponse = {
  user_id: string
  name: string
  nickname: string
  picture: string
  user_metadata: { projects: BestOfJS.Bookmark[] }
}

const AUTH0_ROOT_URL = 'https://bestofjs.auth0.com'
const tokenStorageKey = 'bestofjs_id_token'

export function useAuth() {
  const { saveCurrentPath, restorePreviousPath } = usePersistPath()

  const startAuth = useCallback(async () => {
    try {
      const token = window.localStorage[tokenStorageKey]
      if (!token) {
        // No token found in the local storage => nothing to do
        return { token: undefined, profile: undefined }
      }
      const profile = await fetchUserProfile(token)
      restorePreviousPath()
      return { token, profile } as { token: string; profile: TokenInfoResponse }
    } catch (error) {
      resetToken()
      console.error(error)
    }
  }, []) //eslint-disable-line

  const login = () => {
    // Save the current URL so that we can redirect the user when we are back
    saveCurrentPath()
    const options = {
      client_id: 'dadmCoaRkXs0IhWwnDmyWaBOjLzJYf4s',
      redirect_uri: `${window.location.origin}/auth0.html`,
      scope: 'openid',
      response_type: 'token',
      connection: 'github',
      sso: 'true'
    }
    const queryString = stringify(options)
    const url = `${AUTH0_ROOT_URL}/authorize?&${queryString}`
    window.location.href = url // Go to Auth0 authentication page
  }

  const logout = () => {
    // Do not call window.auth0.logout() that will redirect to GitHub sign out page
    resetToken()
    window.location.href = '/'
  }

  const { data, error } = useSWR('auth', startAuth)
  if (error) {
    console.error('Unable to authenticate the user!', error)
  }
  const isPending = !data
  const profile = data?.profile
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks(
    profile,
    data?.token
  )

  return {
    token: data?.token,
    profile,
    isPending,
    isLoggedIn: !!profile?.name,
    login,
    logout,
    bookmarks,
    addBookmark,
    removeBookmark
  }
}

export const AuthContainer = createContainer(useAuth)
export const AuthProvider = AuthContainer.Provider

function useBookmarks(profile, token) {
  const [bookmarks, setBookmarks] = useState<BestOfJS.Bookmark[]>([])

  useEffect(() => {
    if (!profile) return
    setBookmarks(profile?.user_metadata?.projects || [])
  }, [profile])

  const toggleUpdateMyProjects = add => project => {
    const { user_id } = profile
    const updatedBookmarks = add
      ? addToMyProjectsIfUnique(bookmarks, project.slug)
      : bookmarks.filter(item => item.slug !== project.slug)
    setBookmarks(updatedBookmarks)
    saveUserProfile({ user_id, token, projects: updatedBookmarks })
  }
  const addBookmark = toggleUpdateMyProjects(true)
  const removeBookmark = toggleUpdateMyProjects(false)

  return {
    bookmarks,
    addBookmark,
    removeBookmark
  }
}

function fetchUserProfile(token: string): Promise<TokenInfoResponse> {
  const options = {
    body: `id_token=${token}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // do not use Content-Type: 'application/json' to avoid extra 'OPTIONS' requests (#9)
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const url = `${AUTH0_ROOT_URL}/tokeninfo`
  return fetchJSON(url, options)
}

function resetToken() {
  window.localStorage.removeItem(tokenStorageKey)
}

// Add the project to user's list only if it has not already bookmarked before
function addToMyProjectsIfUnique(myProjects, slug) {
  const found = myProjects.map(item => item.slug).find(item => item === slug)
  return found
    ? myProjects
    : myProjects.concat({ bookmarked_at: new Date(), slug })
}

function saveUserProfile({ user_id, token, projects }) {
  const url = `${AUTH0_ROOT_URL}/api/v2/users/${user_id}`
  const body = {
    user_metadata: {
      projects
    }
  }
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  return fetchJSON(url, options)
}

function usePersistPath() {
  const pathStorageKey = 'bestofjs_url'
  const history = useHistory()

  const saveCurrentPath = () => {
    const url = window.location.pathname
    window.localStorage.setItem(pathStorageKey, url)
  }

  const restorePreviousPath = () => {
    const previousPath = window.localStorage[pathStorageKey]
    if (!previousPath) return

    window.localStorage.removeItem(pathStorageKey)
    history.push(previousPath)
  }

  return { saveCurrentPath, restorePreviousPath }
}
