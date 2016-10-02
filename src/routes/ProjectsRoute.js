import ProjectPage from '../containers/ProjectPage'

import ProjectGithubTab from '../components/ProjectView/GithubTab'

import ProjectLinksTab from '../components/ProjectView/LinksTab'
import ProjectLinksList from '../components/ProjectView/LinksTab/List'
import ProjectLinksAdd from '../components/ProjectView/LinksTab/Create'
import ProjectLinksEdit from '../components/ProjectView/LinksTab/Edit'

import ProjectReviewsTab from '../components/ProjectView/ReviewsTab'
import ProjectReviewsList from '../components/ProjectView/ReviewsTab/List'
import ProjectReviewsAdd from '../components/ProjectView/ReviewsTab/Create'
import ProjectReviewsEdit from '../components/ProjectView/ReviewsTab/Edit'

const LinksRoutes = {
  path: 'links',
  component: ProjectLinksTab,
  indexRoute: {
    component: ProjectLinksList
  },
  childRoutes: [
    {
      path: 'add',
      component: ProjectLinksAdd
    },
    {
      path: ':linkId/edit',
      component: ProjectLinksEdit
    }
  ]
}

const ReviewsRoutes = {
  path: 'reviews',
  component: ProjectReviewsTab,
  indexRoute: {
    component: ProjectReviewsList
  },
  childRoutes: [
    {
      path: 'add',
      component: ProjectReviewsAdd
    },
    {
      path: ':reviewId/edit',
      component: ProjectReviewsEdit
    }
  ]
}

export default function () {
  return {
    path: 'projects/:id',
    component: ProjectPage,
    indexRoute: {
      component: ProjectGithubTab
    },
    childRoutes: [
      {
        path: 'readme',
        component: ProjectGithubTab
      },
      LinksRoutes,
      ReviewsRoutes
    ]
  }
}
