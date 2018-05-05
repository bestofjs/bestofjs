const escapeStringRegexp = require('escape-string-regexp')

export default function interpolateHtml({
  template,
  title,
  description,
  appHtml,
  styles
}) {
  let html = template
  html = html.replace(
    new RegExp(
      `${escapeStringRegexp('<title>')}.+${escapeStringRegexp('</title>')}`,
      'g'
    ),
    `<title>${title}</title>`
  )
  html = html.replace(
    new RegExp(`%${escapeStringRegexp('DESCRIPTION')}%`, 'g'),
    description
  )
  html = includeAppHtml(html, appHtml)
  html = includeStyles(html, styles)
  return html
}

function includeAppHtml(template, appHtml) {
  const [head, tail] = template.split(`<div id="root"></div>`)
  return `${head}<div id="root">${appHtml}</div>${tail}`
}

function includeStyles(template, styles) {
  const [head, tail] = template.split(`<style></style>`)
  return `${head}${styles}${tail}`
}
