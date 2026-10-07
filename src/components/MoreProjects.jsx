import { useEffect, useRef, useState } from 'react'
import { projects } from '../content'
import { Logo } from './ui'

const Chevron = ({ flip }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points={flip ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
  </svg>
)

// The other projects as a row of small cards, starting with the next one.
// Wide screens hide it and show ProjectPeeks at the sides instead.
// It is a scroll-snap strip, so phones swipe it; the side arrows appear only
// while there is more to scroll in that direction.
export default function MoreProjects({ current }) {
  const at = projects.indexOf(current)
  const others = [...projects.slice(at + 1), ...projects.slice(0, at)]
  const strip = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  const measure = () => {
    const node = strip.current
    if (!node) return
    setEdges({
      start: node.scrollLeft <= 4,
      end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 4,
    })
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const scroll = (dir) => {
    const node = strip.current
    if (!node) return
    const card = node.firstElementChild?.getBoundingClientRect().width ?? node.clientWidth
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollBy({ left: dir * (card + 16), behavior: smooth ? 'smooth' : 'auto' })
  }

  if (!others.length) return null

  const arrow =
    'absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-ink shadow-[0_4px_14px_rgba(10,10,10,0.15)] transition-opacity sm:flex'

  return (
    <section className="no-print mt-10 min-[1440px]:hidden" aria-labelledby="more-projects">
      <h2 id="more-projects" className="mb-4 px-1 text-[1.15rem] font-semibold tracking-tight sm:text-[1.25rem]">
        More projects
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous projects"
          className={`${arrow} -left-5 ${edges.start ? 'pointer-events-none opacity-0' : ''}`}
        >
          <Chevron flip />
        </button>

        <ul
          ref={strip}
          onScroll={measure}
          className="-mx-3 -mb-16 -mt-2 flex snap-x snap-mandatory scroll-px-3 gap-4 overflow-x-auto px-3 pb-20 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {others.map((p) => {
            const light = p.cover.image.replace('.webp', '-light-800.webp')
            return (
              <li key={p.slug} className="w-[78%] flex-none snap-start sm:w-[calc((100%-1rem)/1.7)] lg:w-[calc((100%-2rem)/2.5)]">
                <a href={`/projects/${p.slug}`} className="glass glass-hover block h-full overflow-hidden rounded-[20px]">
                  <img
                    src={light}
                    alt=""
                    width={800}
                    height={350}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/7] w-full object-cover object-top"
                  />
                  <span className="flex items-center gap-3 p-4">
                    <Logo src={p.logo} name={p.name} className="h-9 w-9" />
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-ink">{p.name}</span>
                      <span className="block truncate font-mono text-[12px] text-muted">{p.tagline}</span>
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="More projects"
          className={`${arrow} -right-5 ${edges.end ? 'pointer-events-none opacity-0' : ''}`}
        >
          <Chevron />
        </button>
      </div>
    </section>
  )
}
