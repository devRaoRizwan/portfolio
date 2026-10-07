import { Analytics } from '@vercel/analytics/react'
import { Hero, Projects, Experience, Tools, Contact } from './components/Sections'
import Header from './components/Header'
import Activity from './components/Activity'
import Mesh from './components/Mesh'
import AvailabilityToast from './components/AvailabilityToast'
import ProjectPage, { projectPath } from './components/ProjectPage'
import { projects } from './content'

const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

// The prerender passes the path; in the browser it comes from the address bar.
export default function App({ path }) {
  const current = normalize(path ?? (typeof window !== 'undefined' ? window.location.pathname : '/'))
  const project = projects.find((p) => projectPath(p) === current)

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Mesh />

      {project ? (
        <>
          <Header base="/" />
          <ProjectPage project={project} />
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

      {!project && <AvailabilityToast />}
      <Analytics />
    </>
  )
}
