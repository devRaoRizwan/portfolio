import { useEffect, useState } from 'react'
import { profile } from '../content'
import {
  IconUser,
  IconLayers,
  IconBriefcase,
  IconWrench,
  IconSparkle,
  IconMail,
  gmailWebUrl,
  openGmail,
} from './ui'

const TABS = [
  { href: '#top', label: 'Me', Icon: IconUser },
  { href: '#projects', label: 'Work', Icon: IconLayers },
  { href: '#work', label: 'Exp', Icon: IconBriefcase },
  { href: '#stack', label: 'Tools', Icon: IconWrench },
  { href: '#ai', label: 'AI', Icon: IconSparkle },
]

export default function MobileNav() {
  const [active, setActive] = useState('#top')

  useEffect(() => {
    const nodes = TABS.map((t) => document.querySelector(t.href)).filter(Boolean)
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (seen) setActive(`#${seen.target.id}`)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.3] }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <nav
          aria-label="Sections"
          className="glass pointer-events-auto flex items-center gap-0.5 rounded-2xl p-1.5"
        >
          {TABS.map(({ href, label, Icon }) => {
            const on = active === href
            return (
              <a
                key={href}
                href={href}
                aria-current={on ? 'true' : undefined}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
                  on ? 'glass-chip text-ink' : 'text-muted'
                }`}
              >
                <Icon width={16} height={16} />
                <span className="text-[9px] font-medium leading-none">{label}</span>
              </a>
            )
          })}

          <a
            href={gmailWebUrl(profile.email)}
            onClick={(e) => openGmail(e, profile.email)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Email"
            className="ml-0.5 flex shrink-0 flex-col items-center gap-1 rounded-xl bg-accent px-3 py-1.5 text-white"
          >
            <IconMail width={16} height={16} />
            <span className="text-[9px] font-medium leading-none">Email</span>
          </a>
        </nav>
      </div>
    </div>
  )
}
