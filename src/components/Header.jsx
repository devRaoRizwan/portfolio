import { useEffect, useState } from 'react'
import { profile } from '../content'
import { Shell } from './Sections'
import { IconMail, gmailWebUrl, openGmail } from './ui'

const LINKS = [
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Experience' },
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
          className="glass flex items-center gap-2 rounded-2xl py-1.5 pl-1.5 pr-1.5 sm:pl-4"
        >
          <a href={base ? '/' : '#top'} className="hidden shrink-0 text-[15px] font-semibold tracking-tight text-ink sm:block">
            {profile.name}
          </a>

          <ul className="-my-1 mr-auto flex min-w-0 items-center overflow-x-auto py-1 [mask-image:linear-gradient(to_right,#000_82%,transparent)] [scrollbar-width:none] sm:ml-6 sm:[mask-image:none]">
            {LINKS.map((l) => (
              <li key={l.id} className="shrink-0">
                <a
                  href={`${base}#${l.id}`}
                  onClick={() => !base && flash(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`block rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    active === l.id ? 'glass-chip font-medium text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {l.label}
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
