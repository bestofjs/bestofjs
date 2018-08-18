import slugify from '../../helpers/slugify'

// Round the average number of stars used in "trending this year" graphs
function roundAverage(number, decimals = 1) {
  const i = Math.pow(10, decimals)
  return Math.round(number * i) / i
}

function nthElement(arr, i) {
  if (arr.length === 0) return 0
  return arr[Math.min(i, arr.length - 1)]
}

export default function processProject(item) {
  const monthlyStars = item.monthly.slice(0)
  monthlyStars.reverse() // caution, reverse() mutates the array!

  const weeklyTotal = item.deltas.reduce((result, delta) => result + delta, 0)

  const addedAverage = (total, period) => {
    const delta = item.stars - total
    return roundAverage(delta / period)
  }

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
      daily: item.deltas[0],
      weekly: item.deltas.length > 6 ? roundAverage(weeklyTotal / 7) : null,
      monthly:
        monthlyStars.length > 1 ? addedAverage(monthlyStars[1], 30) : null,
      quaterly:
        monthlyStars.length > 3
          ? addedAverage(nthElement(monthlyStars, 3), 90)
          : null,
      yearly:
        item.monthly.length > 6
          ? addedAverage(nthElement(monthlyStars, 6), 365)
          : null
    },
    monthly: item.monthly,
    svg: item.svglogo,
    icon: item.icon,
    branch: item.branch
  }
  return result
}
