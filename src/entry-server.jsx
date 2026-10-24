import { renderToString } from 'react-dom/server'
import App from './App'
import NotFound from './components/NotFound'
import { describe, projectPath } from './components/ProjectPage'
import { projects } from './content'

const SITE = 'https://devraorizwan.online'
const PERSON = { '@id': `${SITE}/#rao-rizwan` }

const oneLine = (text) => text.replace(/\s+/g, ' ').trim()

// A project page described as a page about that project, written by me, with a
// breadcrumb back to the home page. The Person and the SoftwareSourceCode it
// points at are defined in index.html, which every page carries.
function projectSchema(p) {
  const url = `${SITE}${projectPath(p)}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: `${p.name}: ${p.tagline}`,
        description: oneLine(describe(p)),
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#${p.slug}` },
        author: PERSON,
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}${p.cover.image}`, width: 1400, height: 612 },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Rao Rizwan', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/#projects` },
          { '@type': 'ListItem', position: 3, name: p.name, item: url },
        ],
      },
    ],
  }
}

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
      // Link previews show the project's own cover instead of the site-wide og.png.
      // JPG at 1200x630, the shape and format every link-preview service handles.
      image: { url: `${SITE}/images/og/${p.slug}.jpg`, alt: p.cover.alt, width: 1200, height: 630 },
    },
    schema: projectSchema(p),
    images: [p.cover.image, ...(p.gallery ?? []).map((g) => g.src)],
  })),
]

export function render(path = '/') {
  return renderToString(<App path={path} />)
}

export function renderNotFound() {
  return renderToString(<NotFound />)
}
