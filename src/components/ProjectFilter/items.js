export default [
  {
    value: 'total',
    text: 'Total',
    comment: 'total number of star',
    category: 'top',
    url: 'popular'
  },
  {
    value: 'daily',
    text: '1 day',
    comment: 'stars added yesterday',
    category: 'trend',
    url: 'trending/today'
  },
  {
    value: 'weekly',
    text: '1 week',
    comment: 'stars added last week',
    category: 'trend',
    url: 'trending/this-week'
  },
  {
    value: 'monthly',
    text: '1 month',
    comment: 'stars added last month',
    category: 'trend',
    url: 'trending/this-month'
  },
  {
    value: 'quaterly',
    text: '3 months',
    comment: 'stars added the last 3 months',
    category: 'trend',
    url: 'trending/last-3-months'
  },
  {
    text: 'quality',
    value: 'packagequality',
    comment: 'packagequality.com score',
    category: 'quality',
    url: 'score/packagequality'
  },
  {
    text: 'npms.io',
    value: 'npms',
    comment: 'npms.io score',
    category: 'quality',
    url: 'score/npms'
  }
]
