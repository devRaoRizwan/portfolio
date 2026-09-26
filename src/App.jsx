import { Analytics } from '@vercel/analytics/react'
import { Hero, Projects, Experience, Tools, Contact, Footer } from './components/Sections'
import Header from './components/Header'
import Activity from './components/Activity'

export default function App() {
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

      <Header />
      <Hero />

      <main id="main" className="pb-2 lg:pb-4">
        <Projects />
        <Experience />
        <Activity />
        <Tools />
        <Contact />
      </main>

      <Footer />

      <Analytics />
    </>
  )
}
