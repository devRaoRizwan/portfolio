import { useEffect, useState } from 'react'
import { profile } from '../content'
import { IconMail, IconX, gmailWebUrl, openGmail } from './ui'

const DELAY = 3500
const KEY = 'availability-toast-dismissed'

// Browser storage can be missing or blocked, so every access is guarded.
const wasDismissed = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
const rememberDismissed = () => {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // Nothing to do: the toast just comes back on the next visit.
  }
}

// A small note that slides in after a few seconds and steps aside while the
// Contact section, which says the same thing, is on screen. Phones skip it:
// it would cover the content and the header already has an Email button.
export default function AvailabilityToast() {
  const [ready, setReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [contactInView, setContactInView] = useState(false)

  useEffect(() => {
    if (!profile.openTo || wasDismissed()) return
    const timer = setTimeout(() => setReady(true), DELAY)

    const contact = document.getElementById('contact')
    let observer
    if (contact && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), { threshold: 0.2 })
      observer.observe(contact)
    }
    return () => {
      clearTimeout(timer)
      observer?.disconnect()
    }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    rememberDismissed()
  }

  const visible = ready && !dismissed && !contactInView

  return (
    <div
      role="status"
      aria-hidden={!visible}
      className={`no-print fixed bottom-5 right-5 z-50 hidden w-[340px] transition duration-500 ease-out sm:block ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_1px_2px_rgba(10,10,10,0.05),0_18px_40px_-12px_rgba(10,10,10,0.3)] backdrop-blur-xl">
        <span aria-hidden className="relative mt-1.5 flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{profile.openTo}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-muted">{profile.availability}</p>
          <a
            href={gmailWebUrl(profile.email)}
            onClick={(e) => openGmail(e, profile.email)}
            target="_blank"
            rel="noreferrer noopener"
            tabIndex={visible ? 0 : -1}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-dark"
          >
            <IconMail width={14} height={14} />
            Email me
          </a>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          tabIndex={visible ? 0 : -1}
          className="-m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-white/60 hover:text-ink"
        >
          <IconX width={15} height={15} />
        </button>
      </div>
    </div>
  )
}
