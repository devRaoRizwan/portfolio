import Rail from './components/Rail'
import MobileNav from './components/MobileNav'
import Work from './components/Work'
import Projects from './components/Projects'
import Stack from './components/Stack'
import AITools from './components/AITools'

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

      <div className="mx-auto w-full max-w-[1500px] px-4 pb-24 sm:px-6 lg:px-8 lg:pb-0">
        <div className="grid gap-3 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[380px_minmax(0,1fr)]">
          <Rail />

          <main id="main" className="min-w-0 pb-6 lg:py-6">
            <Projects />
            <Work />
            <Stack />
            <AITools />
          </main>
        </div>
      </div>

      <MobileNav />
    </>
  )
}
