import { Analytics } from '@vercel/analytics/react'
import { Hero, Projects, Experience, Tools, Contact } from './components/Sections'
import Header from './components/Header'
import Activity from './components/Activity'
import AvailabilityToast from './components/AvailabilityToast'
import CaseStudy from './components/CaseStudy'
import { caseStudies } from './caseStudies'

const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

// The prerender passes the path; in the browser it comes from the address bar.
export default function App({ path }) {
  const current = normalize(path ?? (typeof window !== 'undefined' ? window.location.pathname : '/'))
  const index = caseStudies.findIndex((s) => s.path === current)
  const study = caseStudies[index]
  const next = caseStudies.length > 1 ? caseStudies[(index + 1) % caseStudies.length] : null

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div className="mesh" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>

      {study ? (
        <>
          <Header base="/" />
          <CaseStudy study={study} next={next} />
        </>
      ) : (
        <>
          <Header />
          <Hero />

          <main id="main" className="pb-6 lg:pb-10">
            <Projects />
            <Experience />
            <Activity />
            <Tools />
            <Contact />
          </main>
        </>
      )}

      <AvailabilityToast />
      <Analytics />
    </>
  )
}
