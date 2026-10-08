import { useEffect, useState } from 'react'
import { Shell } from './Sections'

// `short` is the label phones use, so every link fits without scrolling.
const LINKS = [
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Experience', short: 'Exp' },
  { id: 'activity', label: 'Activity' },
  { id: 'stack', label: 'Tools' },
  { id: 'contact', label: 'Contact' },
]

// Flashes the heading of the section a link jumps to, so the eye lands on it.
function flash(id) {
  const head = document.getElementById(id)?.querySelector('.section-head')
  if (!head) return
  head.classList.remove('flash')
  void head.offsetWidth
  head.classList.add('flash')
}

// Off the home page, section links point back at it instead of in-page anchors.
export default function Header({ base = '' }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const nodes = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (seen) setActive(seen.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="no-print sticky top-0 z-40 pt-3">
      <Shell>
        <nav
          aria-label="Sections"
          className="glass flex items-center gap-1 rounded-2xl px-1.5 py-1.5 sm:gap-2 sm:px-4"
        >
          <ul className="flex min-w-0 flex-1 items-center justify-between sm:justify-start sm:gap-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`${base}#${l.id}`}
                  onClick={() => !base && flash(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                  aria-label={l.short ? l.label : undefined}
                  className={`block whitespace-nowrap rounded-lg px-1.5 py-2 text-[12.5px] transition-colors max-[359px]:px-1 max-[359px]:text-[11.5px] min-[400px]:px-2.5 sm:text-[13px] ${
                    active === l.id ? 'glass-chip font-medium text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {l.short ? (
                    <>
                      <span className="sm:hidden">{l.short}</span>
                      <span className="hidden sm:inline">{l.label}</span>
                    </>
                  ) : (
                    l.label
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Shell>
    </div>
  )
}
