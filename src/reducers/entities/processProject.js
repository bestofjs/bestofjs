import slugify from '../../helpers/slugify'

export default function processProject(item) {
  const result = {
    full_name: item.full_name,
    repository: 'https://github.com/' + item.full_name,
    slug: slugify(item.name),
    tags: item.tags,
    deltas: item.deltas,
    description: item.description,
    name: item.name,
    pushed_at: item.pushed_at,
    stars: item.stars,
    url: item.url,
    packageName: item.npm,
    contributor_count: item.contributor_count,
    owner_id: item.owner_id,
    stats: {
      total: item.stars,
      daily: item.trends.daily,
      weekly: average(item.trends.weekly, 7),
      monthly: average(item.trends.monthly, 30),
      quarterly: average(item.trends.quarterly, 90),
      yearly: average(item.trends.yearly, 365)
    },
    svg: item.svglogo,
    icon: item.icon,
    branch: item.branch
  }
  return result
}

function average(delta, numberOfDays) {
  return round(delta / numberOfDays)
}

function round(number, decimals = 1) {
  const i = Math.pow(10, decimals)
  return Math.round(number * i) / i
}
