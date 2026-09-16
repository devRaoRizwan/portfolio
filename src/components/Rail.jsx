import { useEffect, useState } from 'react'
import { profile } from '../content'
import {
  IconMail,
  IconGithub,
  IconLinkedin,
  IconDownload,
} from './ui'

const LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#work', label: 'Experience' },
  { href: '#stack', label: 'Tools' },
  { href: '#ai', label: 'AI tools' },
  { href: '#education', label: 'Background' },
]

export default function Rail() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (seen) setActive(`#${seen.target.id}`)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: [0.05, 0.4] }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header id="top" className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-start lg:py-6">
      <div className="glass flex w-full flex-col rounded-[26px] p-5 sm:p-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        <div className="flex items-center gap-4 lg:block">
          <picture>
            <source srcSet={profile.photo} type="image/webp" />
            <img
              src={profile.photoFallback}
              alt={profile.photoAlt}
              width={88}
              height={88}
              fetchPriority="high"
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/80 shadow-[0_4px_12px_rgba(10,10,10,0.12)] lg:h-[88px] lg:w-[88px]"
            />
          </picture>

          <div className="min-w-0 lg:mt-3">
            <h1 className="text-[1.6rem] leading-tight">{profile.name}</h1>
            <p className="mt-0.5 font-mono text-[13px] text-muted">{profile.role}</p>
          </div>
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{profile.bio}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {profile.coreStack.map((tech) => (
            <li
              key={tech}
              className="glass-chip rounded-lg px-2 py-0.5 font-mono text-[11px] text-ink-soft"
            >
              {tech}
            </li>
          ))}
        </ul>

        <nav aria-label="Sections" className="no-print mt-5 lg:hidden">
          <ul className="flex flex-wrap gap-1.5">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="glass-chip inline-flex rounded-lg px-2.5 py-1 text-[13px] text-ink-soft"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sections" className="no-print mt-5 hidden lg:block">
          <ul>
            {LINKS.map((link, i) => {
              const on = active === link.href
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`group flex items-baseline gap-3 py-[7px] text-sm transition-colors ${
                      on ? 'font-medium text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`tabular w-5 shrink-0 font-mono text-[11px] transition-colors ${
                        on ? 'text-ink' : 'text-faint group-hover:text-muted'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="no-print mt-6 flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            <IconMail width={15} height={15} />
            Email
          </a>
          <a
            href={profile.resume}
            download
            className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink"
          >
            <IconDownload width={15} height={15} />
            CV
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="glass-chip glass-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink"
          >
            <IconGithub width={17} height={17} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="glass-chip glass-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink"
          >
            <IconLinkedin width={17} height={17} />
          </a>
        </div>
      </div>
    </header>
  )
}
