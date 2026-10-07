import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://devraorizwan.online'
const dist = resolve('dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
const { render, renderNotFound, routes } = await import('./dist-ssr/entry-server.js')

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
  const dir = resolve(dist, `.${path}`)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), withMeta(template, path, meta).replace('<div id="root"></div>', `<div id="root">${html}</div>`))
  console.log(`prerendered ${(Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1)} KB of HTML for ${path}`)
}

// Vercel serves 404.html for any path it has no file for. It is plain HTML with
// the site's stylesheet and no script, so there is nothing to hydrate.
const stylesheet = template.match(/<link rel="stylesheet"[^>]*>/)[0]
writeFileSync(
  resolve(dist, '404.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="robots" content="noindex" />
    <title>Page not found | Rao Rizwan</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    ${stylesheet}
  </head>
  <body>
    <div id="root">${renderNotFound()}</div>
  </body>
</html>
`
)
console.log('prerendered 404.html')
rmSync(resolve('dist-ssr'), { recursive: true, force: true })

// The sitemap is built from the same route list, stamped with this build's date.
const today = new Date().toISOString().slice(0, 10)
const entries = routes.map(({ path, images = [] }) =>
  [
    '  <url>',
    `    <loc>${SITE}${path}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>`,
    ...images.map((src) => `    <image:image><image:loc>${SITE}${src}</image:loc></image:image>`),
    '  </url>',
  ].join('\n')
)
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`
)
console.log('sitemap written')
