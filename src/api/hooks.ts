import useSWR from 'swr'

import getApiRootURL from './config'
import { fetchHTML, fetchJSON } from '../helpers/fetch'

export function useFetchProjectReadMe({ full_name, branch }) {
  const fetcher = () => fetchProjectReadMe({ full_name, branch })
  return useSWR(['/api/projects/readme', full_name], fetcher, {
    revalidateOnFocus: false
  })
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

export function useFetchCompareProjects({ full_names }) {
  const fetcher = () => fetchCompareProjects({ full_names })
  return useSWR(['/api/projects/compare', ...full_names], fetcher)
}

function fetchProjectDetails({ full_name }) {
  const url = `${getApiRootURL(
    'GET_PROJECT_DETAILS'
  )}/api/project-details?fullName=${full_name}`
  return fetchJSON(url)
}

function fetchCompareProjects({ full_names }) {
  const url = `${getApiRootURL(
    'COMPARE_PROJECTS'
  )}/api/compare-projects?fullNames=${full_names.join(',')}`
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

export function useFetchMonthlyRankings(date) {
  const fetcher = () => loadMonthlyRankings(date)
  const key = date ? formatDate(date) : 'latest'
  return useSWR(['/monthly-rankings', key], fetcher)
}

function loadMonthlyRankings(date?: MonthlyDate) {
  const rootURL = getApiRootURL('GET_RANKINGS')
  const url = `${rootURL}/monthly/${date ? formatDate(date) : 'latest'}`
  return fetchJSON(url)
}

function formatDate(date: MonthlyDate) {
  const year = date.year.toString()
  const month = date.month.toString().padStart(2, '0')
  return year + '/' + year + '-' + month + '.json'
}
