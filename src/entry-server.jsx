import { renderToString } from 'react-dom/server'
import App from './App'
import { caseStudies } from './caseStudies'

// Every route the prerender writes to disk, with the head tags that differ from the home page.
export const routes = [
  { path: '/' },
  ...caseStudies.map((s) => ({ path: s.path, meta: s.meta })),
]

export function render(path = '/') {
  return renderToString(<App path={path} />)
}
