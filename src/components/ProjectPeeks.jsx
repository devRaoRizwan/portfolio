import { projects } from '../content'

const Arrow = ({ flip }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={flip ? 'rotate-180' : ''}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// Each card fills the space beside the 1100px article, up to 220px, keeping a
// 20px gap from the article and from the screen edge, so it is never cut off.
const gutter = '((100vw - 1100px) / 2)'
const width = `min(220px, calc(${gutter} - 40px))`
const edge = `max(20px, calc(${gutter} - 240px))`

function Peek({ project, side }) {
  const left = side === 'left'
  const light = project.cover.image.replace('.webp', '-light-800.webp')
  return (
    <a
      href={`/projects/${project.slug}`}
      aria-label={`${left ? 'Previous' : 'Next'} project: ${project.name}`}
      style={{ width, [side]: edge }}
      className={`glass group fixed top-1/2 z-30 -translate-y-1/2 overflow-hidden rounded-[20px] opacity-80 transition duration-300 ease-out hover:opacity-100 ${
        left ? 'hover:translate-x-2' : 'hover:-translate-x-2'
      }`}
    >
      <img src={light} alt="" width={800} height={350} loading="lazy" decoding="async" className="aspect-[16/7] w-full object-cover object-top" />
      {/* The cover already carries the logo, so the name gets the full width. */}
      <span className={`block px-3.5 py-3 ${left ? 'text-right' : ''}`}>
        <span className={`flex items-center gap-1 text-[11px] text-muted ${left ? 'justify-end' : ''}`}>
          {left && <Arrow flip />}
          {left ? 'Previous' : 'Next'}
          {!left && <Arrow />}
        </span>
        <span className="mt-0.5 block truncate text-[14px] font-semibold text-ink">{project.name}</span>
      </span>
    </a>
  )
}

// The neighbouring projects on both sides of a wide screen, vertically centred
// like the next slides of a carousel. Narrower screens use the row at the bottom.
export default function ProjectPeeks({ current }) {
  if (projects.length < 2) return null
  const at = projects.indexOf(current)
  const prev = projects[(at - 1 + projects.length) % projects.length]
  const next = projects[(at + 1) % projects.length]

  return (
    <nav aria-label="Other projects" className="no-print hidden min-[1440px]:block">
      {prev !== next && <Peek project={prev} side="left" />}
      <Peek project={next} side="right" />
    </nav>
  )
}
