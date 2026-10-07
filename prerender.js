import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://devraorizwan.online'
const dist = resolve('dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
const { render, renderNotFound, images } = await import('./dist-ssr/entry-server.js')

const html = render()
writeFileSync(resolve(dist, 'index.html'), template.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
console.log(`prerendered ${(Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1)} KB of HTML for /`)

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

// The sitemap lists the one page, stamped with this build's date.
const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images.map((src) => `    <image:image><image:loc>${SITE}${src}</image:loc></image:image>`).join('\n')}
  </url>
</urlset>
`
)
console.log('sitemap written')
