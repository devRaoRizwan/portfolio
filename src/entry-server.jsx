import { renderToString } from 'react-dom/server'
import App from './App'
import { caseStudies } from './caseStudies'
import { projects } from './content'

const SITE = 'https://devraorizwan.online'
const PERSON = { '@id': `${SITE}/#rao-rizwan` }

// Article and breadcrumb data for a case study, credited to the Person on the home page.
function caseStudySchema(study) {
  const url = `${SITE}${study.path}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: `${study.project} case study`,
        description: study.meta.description,
        url,
        mainEntityOfPage: url,
        image: `${SITE}${study.cover}`,
        author: PERSON,
        publisher: PERSON,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#${study.path.split('/').pop()}` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Rao Rizwan', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/#projects` },
          { '@type': 'ListItem', position: 3, name: study.project, item: url },
        ],
      },
    ],
  }
}

// Every route the prerender writes to disk: head tags that differ from the home
// page, extra structured data, and the images listed for it in the sitemap.
export const routes = [
  {
    path: '/',
    images: ['/images/rao-rizwan.webp', '/images/og.png', ...projects.map((p) => p.cover.image)],
  },
  ...caseStudies.map((s) => ({
    path: s.path,
    meta: s.meta,
    schema: caseStudySchema(s),
    images: [s.cover],
  })),
]

export function render(path = '/') {
  return renderToString(<App path={path} />)
}
