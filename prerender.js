import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve('dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
const { render } = await import('./dist-ssr/entry-server.js')

const html = render()
const out = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

writeFileSync(resolve(dist, 'index.html'), out)
rmSync(resolve('dist-ssr'), { recursive: true, force: true })

// Stamp the sitemap so lastmod reflects this build, not whenever it was written
const today = new Date().toISOString().slice(0, 10)
const sitemapPath = resolve(dist, 'sitemap.xml')
const sitemap = readFileSync(sitemapPath, 'utf-8').replace(
  /<lastmod>[^<]*<\/lastmod>/,
  `<lastmod>${today}</lastmod>`
)
writeFileSync(sitemapPath, sitemap)

const bytes = Buffer.byteLength(html, 'utf-8')
console.log(`prerendered ${(bytes / 1024).toFixed(1)} KB of HTML into dist/index.html`)
console.log(`sitemap lastmod set to ${today}`)
