import useSWR from 'swr'

import getApiRootURL from './config'
import { fetchHTML, fetchJSON } from '../helpers/fetch'

export function useFetchProjectReadMe({ full_name, branch }) {
  const fetcher = () => fetchProjectReadMe({ full_name, branch })
  return useSWR(['/api/projects/readme', full_name], fetcher)
}

function fetchProjectReadMe({ full_name, branch = 'master' }) {
  const url = `${getApiRootURL(
    'GET_README'
  )}/api/project-readme?fullName=${full_name}&branch=${branch}`
  return fetchHTML(url)
}

export function useFetchProjectDetails({ full_name }) {
  const fetcher = () => fetchProjectDetails({ full_name })
  return useSWR(['/api/projects/details', full_name], fetcher)
}

function fetchProjectDetails({ full_name }) {
  const url = `${getApiRootURL(
    'GET_PROJECT_DETAILS'
  )}/api/project-details?fullName=${full_name}`
  return fetchJSON(url)
}

const loadNewsletterIssue = ({ issueNumber: number }) => {
  const root = 'https://weekly.bestofjs.org'
  const url = number
    ? `${root}/issues/${number}/routeInfo.json`
    : `${root}/latest/routeInfo.json`
  return fetchJSON(url).then(({ data }) => ({
    isLatest: data.isLatest,
    ...data.issue
  }))
}

export function useWeeklyNewsletter(issueNumber) {
  const fetcher = () => loadNewsletterIssue({ issueNumber })
  return useSWR(['/api/newsletters/issue', issueNumber], fetcher)
}

export function useFetchMonthlyDownloads(packageName) {
  const fetcher = () => fetchMonthlyDownloads({ packageName })
  return useSWR(['/api/projects/downloads', packageName], fetcher)
}

const fetchMonthlyDownloads = ({ packageName }) => {
  const url = `${getApiRootURL(
    'GET_PACKAGE_DATA'
  )}/api/package-monthly-downloads?packageName=${packageName}`
  return fetchJSON(url)
}
