import { renderToString } from 'react-dom/server'
import App from './App'
import NotFound from './components/NotFound'
import { projects } from './content'

// Images listed for the home page in the sitemap.
export const images = ['/images/rao-rizwan.webp', '/images/og.png', ...projects.map((p) => p.cover.image)]

export function render() {
  return renderToString(<App />)
}

export function renderNotFound() {
  return renderToString(<NotFound />)
}
