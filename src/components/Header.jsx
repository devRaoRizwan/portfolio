import { useEffect, useState } from 'react'
import { profile } from '../content'
import { Shell } from './Sections'
import { IconMail, gmailWebUrl, openGmail } from './ui'

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

export default function Header() {
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
          className="glass flex items-center gap-1 rounded-2xl py-1.5 pl-1.5 pr-1.5 sm:gap-2 sm:pl-4"
        >
          <a href="#top" className="hidden shrink-0 text-[15px] font-semibold tracking-tight text-ink sm:block">
            {profile.name}
          </a>

          <ul className="flex min-w-0 flex-1 items-center justify-between sm:ml-6 sm:mr-auto sm:flex-none sm:justify-start">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => flash(l.id)}
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

          <a
            href={gmailWebUrl(profile.email)}
            onClick={(e) => openGmail(e, profile.email)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Email"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark sm:px-4"
          >
            <IconMail width={15} height={15} />
            <span className="hidden sm:inline">Email</span>
          </a>
        </nav>
      </Shell>
    </div>
  )
}
