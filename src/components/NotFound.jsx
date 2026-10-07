import { profile } from '../content'
import Mesh from './Mesh'
import { IconArrow } from './ui'

// Prerendered to 404.html and shipped without JavaScript, so nothing here may
// depend on hydration (no Reveal, no effects).
export default function NotFound() {
  return (
    <>
      <Mesh />
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="glass w-full max-w-md rounded-[26px] p-7 text-center sm:p-9">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-3 text-[1.9rem] leading-tight tracking-tight sm:text-[2.3rem]">Page not found</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
            Nothing lives at this address. It may have moved, or the link has a typo.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              Back to {profile.name}
              <IconArrow width={15} height={15} />
            </a>
            <a
              href="/#projects"
              className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
            >
              See projects
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
