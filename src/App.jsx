import MobileNav from './components/MobileNav'
import { Hero, Projects, Experience, Tools } from './components/Sections'

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

      <Hero />

      <main id="main" className="pb-24 lg:pb-10">
        <Projects />
        <Experience />
        <Tools />
      </main>

      <MobileNav />
    </>
  )
}
