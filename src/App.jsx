import { Analytics } from '@vercel/analytics/react'
import { Hero, Projects, Experience, Tools, Contact } from './components/Sections'
import Header from './components/Header'
import Activity from './components/Activity'
import Mesh from './components/Mesh'
import AvailabilityToast from './components/AvailabilityToast'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Mesh />

      <Header />
      <Hero />

      <main id="main" className="pb-6 lg:pb-10">
        <Projects />
        <Experience />
        <Activity />
        <Tools />
        <Contact />
      </main>

      <AvailabilityToast />
      <Analytics />
    </>
  )
}
