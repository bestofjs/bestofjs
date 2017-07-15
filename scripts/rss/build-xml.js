import builder from 'xmlbuilder'

import getAvatarUrl from '../../src/components/common/getAvatarUrl'

export default function buildXml(projects) {
  const xml = builder
    .create('rss', { version: '1.0', encoding: 'UTF-8' })
    .att('version', '2.0')
    .ele('channel')
  xml.ele('title', {}, 'Best of JavaScript - Weekly trends')
  xml.ele('link', {}, 'http://bestof.js.org/projects/trending/this-week')
  xml.ele('pubDate', {}, new Date())
  xml.ele('lastBuildDate', {}, new Date())
  projects.forEach(project => {
    addItem(xml, project)
  })
  return xml.end({ pretty: true })

  // console.log(xml)
  // return xml
}

function addItem(xmlParent, project) {
  console.log(project)
  const xmlItem = xmlParent.ele('item')
  xmlItem.ele(
    'title',
    {},
    `${project.name} [+${project.stats.weekly} stars this week]`
  )
  xmlItem.ele('author', {}, project.full_name.split('/').slice(0, 1))
  xmlItem.ele('description', {}, project.description)
  xmlItem.ele('link', {}, project.url || project.repository)
  xmlItem.ele('pubDate', {}, project.pushed_at)
  xmlItem.ele('image', {}, getAvatarUrl(project, 200))
}
