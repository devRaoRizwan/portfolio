import { useEffect, useRef, useState } from 'react'

export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', id }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

export function Section({ id, title, children, className = '', flush = false }) {
  const pad = flush ? 'pb-6 sm:pb-8 lg:pb-10' : 'py-6 sm:py-8 lg:py-10'
  return (
    <section id={id} className={`w-full ${pad} ${className}`}>
      {title && (
        <Reveal className="mb-5">
          <h2 className="text-[1.75rem] sm:text-3xl">{title}</h2>
        </Reveal>
      )}
      {children}
    </section>
  )
}

export function Logo({ src, name, size = 44, className = '' }) {
  const sizedByClass = /(^|\s)(h-|w-|size-)/.test(className)
  const monogram = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <span
      className={`glass-chip flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={sizedByClass ? undefined : { width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-mono text-xs font-semibold text-muted">{monogram}</span>
      )}
    </span>
  )
}

export function Chip({ children }) {
  return (
    <span className="glass-chip inline-flex items-center rounded-lg px-2.5 py-1 font-mono text-xs text-ink-soft">
      {children}
    </span>
  )
}

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconMail = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

export const IconGithub = (p) => (
  <svg {...base} {...p}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export const IconLinkedin = (p) => (
  <svg {...base} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export const IconDownload = (p) => (
  <svg {...base} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const IconArrow = (p) => (
  <svg {...base} {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export function LogoGrid({ items }) {
  return (
    <ul className="grid grid-cols-4 gap-1.5 @sm:gap-2 @md:grid-cols-5 @2xl:grid-cols-6">
      {items.map((item) => (
        <li key={item.name}>
          <div className="glass glass-hover flex h-full flex-col items-center gap-2 rounded-xl px-1.5 py-3 sm:gap-2.5 sm:rounded-2xl sm:px-2 sm:py-5">
            {item.icon ? (
              <img
                src={item.icon}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                decoding="async"
                className="h-5 w-5 sm:h-7 sm:w-7"
              />
            ) : (
              <span className="flex h-5 items-center font-mono text-sm font-semibold text-ink sm:h-7 sm:text-base">
                {item.name.slice(0, 2)}
              </span>
            )}
            <span className="text-center text-[10px] leading-tight text-muted sm:text-[11px]">
              {item.name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export const IconLayers = (p) => (
  <svg {...base} {...p}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

export const IconBriefcase = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

export const IconWrench = (p) => (
  <svg {...base} {...p}>
    <path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3z" />
    <path d="M14.7 6.3 18 3l3 3-3.3 3.3" />
  </svg>
)

export const IconSparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
  </svg>
)

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)


export const gmailWebUrl = (email) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`

export function openGmail(event, email) {
  if (event) event.preventDefault()
  const web = gmailWebUrl(email)
  const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent || '')

  if (!mobile) {
    window.open(web, '_blank', 'noopener,noreferrer')
    return
  }

  const fallback = setTimeout(() => {
    if (!document.hidden) window.location.href = web
  }, 1200)

  const cancel = () => {
    if (document.hidden) clearTimeout(fallback)
  }
  document.addEventListener('visibilitychange', cancel, { once: true })
  window.addEventListener('pagehide', () => clearTimeout(fallback), { once: true })

  window.location.href = `googlegmail://co?to=${encodeURIComponent(email)}`
}

export function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target)
      return
    }

    let frame = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(target * eased)
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return [ref, value.toFixed(decimals)]
}
