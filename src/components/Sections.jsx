import { useEffect, useRef, useState } from 'react'
import { profile, projects, work, toolbelt, aitools, background } from '../content'
import activity from '../activity.json'
import EmailButton from './EmailButton'
import Diagram from './Diagram'
import {
  gmailWebUrl,
  openGmail,
  Reveal,
  Logo,
  Chip,
  LogoGrid,
  useCountUp,
  IconGithub,
  IconLinkedin,
  IconDownload,
  IconArrow,
  IconMail,
  IconCopy,
  IconCheck,
} from './ui'

// Rounded down to the hundred so "1,400+" stays true between daily refreshes.
const listings = Math.floor((activity.jobharvester?.listings ?? 1300) / 100) * 100

// Phones clamp long descriptions; the toggle appears only when text was cut.
const CLAMP = { 3: 'line-clamp-3', 4: 'line-clamp-4' }

function ClampText({ children, lines = 3, className = '' }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [clipped, setClipped] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => setClipped(node.scrollHeight > node.clientHeight + 1)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <>
      <p ref={ref} className={`${open ? '' : CLAMP[lines]} sm:line-clamp-none ${className}`}>
        {children}
      </p>
      {(clipped || open) && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="no-print mt-1.5 self-start py-1 text-[13px] font-medium text-ink underline decoration-[var(--color-line)] underline-offset-4 sm:hidden"
        >
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </>
  )
}

export function Shell({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export function Section({ id, title, children }) {
  return (
    <section id={id} className="py-10 sm:py-12 lg:py-14">
      <Shell>
        <Reveal className="mb-6 sm:mb-7">
          <div className="section-head flex items-baseline gap-4 border-b border-[var(--color-line)] px-2 pb-4 pt-1">
            <h2 className="text-[1.4rem] leading-none tracking-tight sm:text-[2rem]">
              {title}
            </h2>
          </div>
        </Reveal>
        {children}
      </Shell>
    </section>
  )
}

function Stat({ value, decimals = 0, suffix = '', label }) {
  const [ref, shown] = useCountUp(value, { decimals })
  const pretty = Number(shown).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return (
    <div ref={ref}>
      <p className="tabular text-[1.35rem] font-semibold leading-none tracking-tight text-ink sm:text-[2.1rem]">
        {pretty}
        {suffix}
      </p>
      <p className="mt-2 text-[13px] leading-snug text-muted">{label}</p>
    </div>
  )
}

export function Hero() {
  return (
    <header id="top" className="pt-4 sm:pt-5">
      <Shell>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.75fr_1fr] lg:gap-6">
        <div className="h-full">
          <div className="glass h-full rounded-[26px] p-6 sm:p-8">
            <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto] lg:gap-10">
              <div className="min-w-0">
                <div className="flex items-center gap-4">
                  <picture className="lg:hidden">
                    <source srcSet={profile.photo} type="image/webp" />
                    <img
                      src={profile.photoFallback}
                      alt={profile.photoAlt}
                      width={160}
                      height={160}
                      fetchpriority="high"
                      className="h-[76px] w-[76px] shrink-0 rounded-full object-cover shadow-[0_6px_20px_-6px_rgba(10,10,10,0.28)] ring-[3px] ring-white/80 sm:h-24 sm:w-24"
                    />
                  </picture>

                  <div className="min-w-0">
                    <p className="eyebrow mb-1.5 lg:mb-4">
                      {profile.role}
                      <span className="hidden text-faint/70 sm:inline"> · </span>
                      <span className="block sm:inline">{profile.location}</span>
                    </p>
                    <h1 className="text-[1.9rem] leading-[0.95] tracking-tight sm:text-[3rem] lg:text-[3.4rem]">
                      {profile.name}
                    </h1>
                  </div>
                </div>
                <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-ink-soft sm:text-[15px]">
                  {profile.bio}
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5 sm:mt-6">
                  {profile.coreStack.map((tech) => (
                    <li
                      key={tech}
                      className="glass-chip rounded-lg px-2.5 py-1 font-mono text-xs text-ink-soft"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="no-print mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-2.5">
                  <EmailButton className="flex-1 sm:flex-none" />
                  <a
                    href={profile.resume}
                    download
                    className="glass-chip glass-hover inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink sm:flex-none"
                  >
                    <IconDownload width={15} height={15} />
                    <span className="sm:hidden">CV</span>
                    <span className="hidden sm:inline">Download CV</span>
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="me noreferrer noopener"
                    aria-label="GitHub"
                    className="glass-chip glass-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink"
                  >
                    <IconGithub width={17} height={17} />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="me noreferrer noopener"
                    aria-label="LinkedIn"
                    className="glass-chip glass-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink"
                  >
                    <IconLinkedin width={17} height={17} />
                  </a>
                </div>
              </div>

              <picture className="hidden lg:block">
                <source srcSet={profile.photo} type="image/webp" />
                <img
                  src={profile.photoFallback}
                  alt={profile.photoAlt}
                  width={240}
                  height={240}
                  className="h-40 w-40 rounded-full object-cover shadow-[0_8px_26px_-8px_rgba(10,10,10,0.3)] ring-4 ring-white/80"
                />
              </picture>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-[var(--color-line)] pt-6 sm:grid-cols-4">
              <Stat value={100000} suffix="+" label="Requests a day in production" />
              <Stat value={2.3} decimals={1} suffix=" yrs" label="Shipping Python backends" />
              <Stat value={listings} suffix="+" label="Listings collected by JobHarvester" />
              <Stat value={toolbelt.length} label="Tools used in production" />
            </div>
          </div>
        </div>

        <BackgroundPanel />
        </div>
      </Shell>
    </header>
  )
}

function BackgroundPanel() {
  const { education, community } = background
  return (
    <div className="h-full" id="education">
      <div className="glass flex h-full flex-col rounded-[26px] p-6 sm:p-7">
        <div className="section-head -mx-1 mb-5 flex items-baseline gap-3 border-b border-[var(--color-line)] px-1 pb-4">
          <h2 className="text-[1.3rem] leading-none tracking-tight">Background</h2>
        </div>

        <p className="eyebrow mb-3">Studied</p>
        <div className="flex items-center gap-3">
          <Logo src={education.logo} name={education.institution} className="h-11 w-11" />
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug text-ink">{education.institution}</p>
            <p className="mt-0.5 text-xs text-muted">
              {education.degree}, {education.period}
            </p>
          </div>
        </div>

        <div className="my-5 h-px bg-[var(--color-line)]" />

        <p className="eyebrow mb-3">Outside work</p>
        <ul className="space-y-4">
          {community.map((item) => (
            <li key={item.org} className="flex items-start gap-3">
              <Logo src={item.logo} name={item.org} className="h-11 w-11" />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-ink">{item.org}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>

        {profile.location && (
          <div className="mt-auto pt-5">
            <div className="mb-5 h-px bg-[var(--color-line)]" />
            <p className="eyebrow mb-2">Based in</p>
            <p className="text-sm font-medium text-ink">{profile.location}</p>
            <p className="mt-0.5 text-xs text-muted">{profile.availability}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, delay, eager = false }) {
  const repos = [
    { key: 'overview', label: 'Overview' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'crawlers', label: 'Crawlers' },
  ].filter((r) => project.links[r.key])

  return (
    <Reveal delay={delay} className="h-full">
      <article className="glass glass-hover @container flex h-full flex-col overflow-hidden rounded-[22px]">
        <div className="bg-[#0e0e13]">
          <img
            src={project.cover.image}
            srcSet={`${project.cover.image.replace('.webp', '-800.webp')} 800w, ${project.cover.image} 1400w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={project.cover.alt}
            width={1400}
            height={612}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="aspect-[16/6] w-full object-cover object-top sm:aspect-[16/7]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Logo src={project.logo} name={project.name} className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-ink sm:text-xl">{project.name}</h3>
                {project.links.live && (
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-[#047857]">
                    <span aria-hidden className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </span>
                    Live
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[13px] text-muted">{project.tagline}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <ClampText className="text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
              {project.description.replace('{listings}', listings.toLocaleString('en-US'))}
            </ClampText>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>

          {project.diagram && <Diagram diagram={project.diagram} />}

          <div className="no-print mt-auto flex flex-wrap items-center gap-2 pt-6">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                Open live site
                <IconArrow width={15} height={15} />
              </a>
            )}
            {repos.map((repo) => (
              <a
                key={repo.key}
                href={project.links[repo.key]}
                target="_blank"
                rel="noreferrer noopener"
                className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
              >
                <IconGithub width={15} height={15} />
                {repos.length > 1 || repo.key === 'overview' ? repo.label : 'Source'}
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} delay={i * 80} eager={i === 0} />
        ))}
      </div>
    </Section>
  )
}

function RoleCard({ job, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="glass glass-hover @container flex h-full flex-col rounded-[22px]">
        <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <Logo src={job.logo} name={job.company} className="h-12 w-12" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <h3 className="text-lg font-semibold leading-tight text-ink sm:text-xl">
                {job.company}
              </h3>
              <p className="font-mono text-[11px] text-faint">{job.period}</p>
            </div>
            <p className="mt-0.5 font-mono text-[13px] text-muted">{job.role}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <ClampText lines={4} className="text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
            {job.story}
          </ClampText>
        </div>

        <Diagram diagram={job.diagram} />

        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {job.stack.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
        </div>
      </article>
    </Reveal>
  )
}

export function Experience() {
  return (
    <Section id="work" title="Experience">
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
        {work.map((job, i) => (
          <RoleCard key={job.company} job={job} delay={i * 80} />
        ))}
      </div>
    </Section>
  )
}

export function Tools() {
  return (
    <Section id="stack" title="Tools">
      <Reveal>
        <div className="glass @container rounded-[24px] p-6 sm:p-7 lg:p-8">
          <p className="eyebrow mb-5">Stack</p>
          <LogoGrid items={toolbelt} />

          <div className="my-7 h-px bg-[var(--color-line)]" />

          <p className="eyebrow mb-5" id="ai">
            AI tools
          </p>
          <LogoGrid items={aitools} />
        </div>
      </Reveal>
    </Section>
  )
}


function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
    >
      {copied ? <IconCheck width={15} height={15} /> : <IconCopy width={15} height={15} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  )
}

function ContactRow({ href, icon, label, value, external = true, download = false, onClick }) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...(download ? { download: true } : {})}
        className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-white/[0.06] sm:px-4"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] text-white/50">{label}</span>
          <span className="block truncate text-[14px] font-medium text-white">{value}</span>
        </span>
        <IconArrow
          width={16}
          height={16}
          className="shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
        />
      </a>
    </li>
  )
}

export function Contact() {
  const handle = (url) => new URL(url).pathname.split('/').filter(Boolean).pop()
  return (
    <Section id="contact" title="Contact">
      <Reveal>
        <div className="relative overflow-hidden rounded-[26px] bg-[#0b0b0f] p-6 text-white shadow-[0_30px_60px_-28px_rgba(10,10,10,0.55)] sm:p-10 lg:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_320px_at_0%_0%,rgba(255,255,255,0.09),transparent_70%),radial-gradient(520px_300px_at_100%_100%,rgba(16,185,129,0.12),transparent_70%)]"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div>
              <h3 className="text-[1.9rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-[2.6rem]">
                Need a backend that holds up under load?
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
                I am looking for backend work, remote or on site in Lahore. If something
                here matches what you need, email is the fastest way to reach me.
              </p>
              <div className="no-print mt-7 flex flex-wrap gap-2.5">
                <a
                  href={gmailWebUrl(profile.email)}
                  onClick={(e) => openGmail(e, profile.email)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white/85"
                >
                  <IconMail width={15} height={15} />
                  Email me
                </a>
                <CopyEmail />
              </div>
            </div>

            <ul className="-mx-3 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:mx-0">
              <ContactRow
                href={gmailWebUrl(profile.email)}
                onClick={(e) => openGmail(e, profile.email)}
                icon={<IconMail width={17} height={17} />}
                label="Email"
                value={profile.email}
              />
              <ContactRow
                href={profile.linkedin}
                icon={<IconLinkedin width={17} height={17} />}
                label="LinkedIn"
                value={`in/${handle(profile.linkedin)}`}
              />
              <ContactRow
                href={profile.github}
                icon={<IconGithub width={17} height={17} />}
                label="GitHub"
                value={`@${handle(profile.github)}`}
              />
              <ContactRow
                href={profile.resume}
                external={false}
                download
                icon={<IconDownload width={17} height={17} />}
                label="Resume"
                value="Download CV (PDF)"
              />
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
