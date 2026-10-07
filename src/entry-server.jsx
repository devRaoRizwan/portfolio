import { renderToString } from 'react-dom/server'
import App from './App'
import NotFound from './components/NotFound'
import { describe, projectPath } from './components/ProjectPage'
import { projects } from './content'

const oneLine = (text) => text.replace(/\s+/g, ' ').trim()

// Every page the prerender writes: its path, the head tags that differ from the
// home page, and the images the sitemap lists for it.
export const routes = [
  {
    path: '/',
    images: ['/images/rao-rizwan.webp', '/images/og.png', ...projects.map((p) => p.cover.image.replace('.webp', '-light.webp'))],
  },
  ...projects.map((p) => ({
    path: projectPath(p),
    meta: {
      title: `${p.name}: ${p.tagline} | Rao Rizwan`,
      description: oneLine(describe(p)),
    },
    images: [p.cover.image, ...(p.gallery ?? []).map((g) => g.src)],
  })),
]

export function render(path = '/') {
  return renderToString(<App path={path} />)
}

export function renderNotFound() {
  return renderToString(<NotFound />)
}
