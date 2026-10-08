import { useEffect, useRef, useState } from 'react'
import { profile } from '../content'
import activity from '../activity.json'
import { Shell } from './Sections'
import { gmailWebUrl, openGmail, IconArrow, IconCopy, IconCheck, IconMail, IconLinkedin, IconGithub, IconFile } from './ui'

const SITE = 'https://devraorizwan.online'

const bare = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

// Every way to reach me. `copy` is what lands on the clipboard; `shown` is what the row reads.
const CONTACTS = [
  { label: 'Email', icon: IconMail, shown: profile.email, copy: profile.email, href: gmailWebUrl(profile.email), gmail: true },
  { label: 'LinkedIn', icon: IconLinkedin, shown: bare(profile.linkedin), copy: profile.linkedin, href: profile.linkedin },
  { label: 'GitHub', icon: IconGithub, shown: bare(profile.github), copy: profile.github, href: profile.github },
  { label: 'CV', icon: IconFile, shown: 'Download CV (PDF)', copy: `${SITE}${profile.resume}`, href: profile.resume, download: true },
]

// navigator.clipboard needs a secure page; the textarea route covers the rest.
async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = Object.assign(document.createElement('textarea'), { value: text })
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

function ContactRow({ contact, onCopied }) {
  const external = !contact.download
  const Icon = contact.icon
  return (
    <li className="flex items-center gap-3 py-2.5 lg:py-0">
      {/* Every row gets the same tile, size and stroke, so the icons read as one set. */}
      <span className="glass-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink">
        <Icon width={16} height={16} />
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="min-w-0 flex-1">
          <span className="block text-[12px] text-muted">{contact.label}</span>
          <a
            href={contact.href}
            onClick={contact.gmail ? (e) => openGmail(e, profile.email) : undefined}
            {...(external ? { target: '_blank', rel: 'me noreferrer noopener' } : { download: true })}
            className="block truncate font-mono text-[12.5px] text-ink-soft underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-[var(--color-line)]"
          >
            {contact.shown}
          </a>
        </div>
        <button
          type="button"
          onClick={async () => (await writeClipboard(contact.copy)) && onCopied(contact.label)}
          aria-label={`Copy ${contact.label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-white/70 hover:text-ink"
        >
          <IconCopy width={14} height={14} />
        </button>
      </div>
    </li>
  )
}

// A small dark pill at the bottom of the screen: "LinkedIn copied". It keeps the
// last label while it fades out.
function CopiedToast({ label }) {
  const last = useRef(label)
  if (label) last.current = label
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition duration-300 ${
        label ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {last.current && (
        <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(10,10,10,0.5)]">
          <IconCheck width={14} height={14} />
          {last.current} copied
        </span>
      )}
    </div>
  )
}

// A full-width footer fixed to the end of the page with every way to reach me,
// each one copyable. It carries id="contact", so the header's Contact link and
// the availability toast both treat it as the contact section.
export default function Footer({ base = '' }) {
  const [copied, setCopied] = useState(null)
  const timer = useRef()

  const onCopied = (label) => {
    setCopied(label)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(null), 1800)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  // The toast sits outside <footer>: its backdrop blur would pin a fixed child to the footer.
  return (
    <>
      <footer
        id="contact"
        className="no-print mt-10 border-t border-white/80 bg-white/60 shadow-[0_-1px_0_rgba(10,10,10,0.06)] backdrop-blur-xl sm:mt-14"
      >
        <Shell>
          <div className="py-7 sm:py-9">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-faint lg:mb-4">Get in touch</p>
            {/* A list on phones, one row of five on desktop. */}
            <ul className="-my-2 divide-y divide-[var(--color-line)] lg:my-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:divide-y-0">
              {CONTACTS.map((c) => (
                <ContactRow key={c.label} contact={c} onCopied={onCopied} />
              ))}
            </ul>
          </div>
        </Shell>

        <div className="border-t border-[var(--color-line)]">
          <Shell>
            <div className="flex items-center justify-between gap-4 py-4 text-[12.5px] text-faint">
              {/* The year comes from the build snapshot so prerendered and hydrated markup agree. */}
              <span>© {activity.fetchedAt.slice(0, 4)} {profile.name}</span>
              <a href={base ? '#' : '#top'} className="inline-flex items-center gap-1.5 font-medium text-ink-soft transition-colors hover:text-ink">
                Back to top
                <IconArrow width={13} height={13} className="-rotate-90" />
              </a>
            </div>
          </Shell>
        </div>
      </footer>
      <CopiedToast label={copied} />
    </>
  )
}
