export const sortOrderOptions = [
  {
    id: 'total',
    label: 'By total number of stars'
  },
  { type: 'divider' },
  {
    id: 'daily',
    label: 'By stars added yesterday'
  },
  {
    id: 'weekly',
    label: 'By stars added the last 7 days'
  },
  {
    id: 'monthly',
    label: 'By stars added the last 30 days'
  },
  {
    id: 'yearly',
    label: 'By stars added the last 12 months'
  },
  { type: 'divider' },
  {
    id: 'monthly-downloads',
    label: 'By downloads the last 30 days'
  },
  { type: 'divider' },
  {
    id: 'last-commit',
    label: 'By date of the latest commit'
  },
  {
    id: 'contributors',
    label: 'By number of contributors'
  },
  { type: 'divider' },
  {
    id: 'created',
    label: 'By date of creation (Oldest first)',
    direction: 'asc'
  },
  {
    id: 'newest',
    label: 'By date of addition on Best of JS'
  },
  { type: 'divider' },
  {
    id: 'match',
    label: 'Best matching',
    disabled: ({ query }) => query === ''
  },
  { type: 'divider' },
  {
    id: 'bookmark',
    label: 'By date of the bookmark',
    disabled: ({ location }) => location.pathname !== '/bookmarks'
  }
]
