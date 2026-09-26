import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://devraorizwan.online'
const dist = resolve('dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
const { render, routes } = await import('./dist-ssr/entry-server.js')

const attr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

// Swaps the page-specific head tags; everything else is shared with the home page.
function withMeta(html, path, meta) {
  if (!meta) return html
  const url = `${SITE}${path}`
  const title = attr(meta.title)
  const description = attr(meta.description)
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(name="description"\s+content=")[^"]*/, `$1${description}`)
    .replace(/(rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(property="og:description"\s+content=")[^"]*/, `$1${description}`)
    .replace(/(name="twitter:title" content=")[^"]*/, `$1${title}`)
    .replace(/(name="twitter:description"\s+content=")[^"]*/, `$1${description}`)
}

for (const { path, meta } of routes) {
  const html = render(path)
  const page = withMeta(template, path, meta).replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const dir = resolve(dist, `.${path}`)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), page)
  console.log(`prerendered ${(Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1)} KB of HTML for ${path}`)
}
rmSync(resolve('dist-ssr'), { recursive: true, force: true })

// The sitemap is built from the same route list, stamped with this build's date.
const today = new Date().toISOString().slice(0, 10)
const entries = routes.map(({ path }) =>
  [
    '  <url>',
    `    <loc>${SITE}${path}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>`,
    '  </url>',
  ].join('\n')
)
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
)
console.log(`sitemap written with ${routes.length} pages`)
