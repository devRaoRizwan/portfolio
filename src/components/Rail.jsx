import { useEffect, useState } from 'react'
import { profile, background } from '../content'
import EmailButton from './EmailButton'
import {
  Logo,
  IconGithub,
  IconLinkedin,
  IconDownload,
} from './ui'

const LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#work', label: 'Experience' },
  { href: '#stack', label: 'Tools' },
  { href: '#ai', label: 'AI tools' },
]

export default function Rail() {
  const { education, community } = background
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

        <p className="mt-3.5 text-[13px] leading-relaxed text-muted">{profile.bio}</p>

        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {profile.coreStack.map((tech) => (
            <li
              key={tech}
              className="glass-chip rounded-lg px-2 py-0.5 font-mono text-[11px] text-ink-soft"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-4 h-px bg-[var(--color-line)]" />

        <div className="mt-4">
          <p className="eyebrow mb-2.5">Studied</p>
          <div className="flex items-center gap-3">
            <Logo src={education.logo} name={education.institution} className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-snug text-ink">
                {education.institution}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {education.degree}, {education.period}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="eyebrow mb-2.5">Outside work</p>
          <ul className="space-y-3">
            {community.map((item) => (
              <li key={item.org} className="flex items-start gap-3">
                <Logo src={item.logo} name={item.org} className="h-8 w-8 sm:h-9 sm:w-9" />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium leading-snug text-ink">{item.org}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 h-px bg-[var(--color-line)]" />


        <nav aria-label="Sections" className="no-print mt-4 hidden lg:block">
          <ul>
            {LINKS.map((link, i) => {
              const on = active === link.href
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`group flex items-baseline gap-3 py-1.5 text-sm transition-colors ${
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

        <div className="no-print mt-5 flex flex-wrap items-center gap-2">
          <EmailButton className="flex-1" />
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
            className="glass-chip glass-hover inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink sm:h-10 sm:w-10"
          >
            <IconGithub width={16} height={16} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="glass-chip glass-hover inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink sm:h-10 sm:w-10"
          >
            <IconLinkedin width={16} height={16} />
          </a>
        </div>
      </div>
    </header>
  )
}
