import { renderToString } from 'react-dom/server'
import App from './App'
import { projects } from './content'

// Every route the prerender writes to disk, with the images listed for it in the sitemap.
export const routes = [
  {
    path: '/',
    images: ['/images/rao-rizwan.webp', '/images/og.png', ...projects.map((p) => p.cover.image)],
  },
]

export function render() {
  return renderToString(<App />)
}
