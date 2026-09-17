import { profile, projects, work, toolbelt, aitools, background } from '../content'
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
} from './ui'

function Shell({ children, className = '' }) {
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
    <header id="top" className="pt-6 sm:pt-8">
      <Shell>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.75fr_1fr] lg:gap-6">
        <Reveal className="h-full">
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
                    <p className="eyebrow mb-1.5 lg:mb-4">{profile.role}</p>
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
                  alt=""
                  width={240}
                  height={240}
                  className="h-40 w-40 rounded-full object-cover shadow-[0_8px_26px_-8px_rgba(10,10,10,0.3)] ring-4 ring-white/80"
                />
              </picture>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-[var(--color-line)] pt-6 sm:grid-cols-4">
              <Stat value={100000} suffix="+" label="Requests a day in production" />
              <Stat value={2.3} decimals={1} suffix=" yrs" label="Shipping Python backends" />
              <Stat value={1300} suffix="+" label="Live listings on JobHarvester" />
              <Stat value={18} label="Tools used in production" />
            </div>
          </div>
        </Reveal>

        <BackgroundPanel />
        </div>
      </Shell>
    </header>
  )
}

function BackgroundPanel() {
  const { education, community } = background
  return (
    <Reveal delay={80} className="h-full" id="education">
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
      </div>
    </Reveal>
  )
}

function ProjectCard({ project, delay }) {
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
            alt={project.cover.alt}
            width={1400}
            height={900}
            loading="lazy"
            decoding="async"
            className="aspect-[16/6] w-full object-cover object-top sm:aspect-[16/7]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
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
          <p className="mt-1 font-mono text-[13px] text-muted">{project.tagline}</p>
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-soft sm:line-clamp-none sm:text-[14px]">
            {project.description}
          </p>

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
          <ProjectCard key={project.name} project={project} delay={i * 80} />
        ))}
      </div>
    </Section>
  )
}

function RoleCard({ job, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="glass glass-hover @container flex h-full flex-col rounded-[22px] p-5 sm:p-6">
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

        <p className="mt-4 line-clamp-4 text-[13px] leading-relaxed text-ink-soft sm:line-clamp-none sm:text-[14px]">
          {job.story}
        </p>

        <Diagram diagram={job.diagram} />

        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {job.stack.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
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


export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <Reveal>
        <div className="glass rounded-[24px] p-6 text-center sm:p-10 lg:p-14">
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">
            I am looking for backend work, remote or in Lahore. If something here
            matches what you need, email is the fastest way to reach me.
          </p>

          <a
            href={gmailWebUrl(profile.email)}
            onClick={(e) => openGmail(e, profile.email)}
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-6 inline-flex max-w-full items-center gap-3 font-mono text-[15px] leading-tight tracking-tight text-ink transition-opacity hover:opacity-70 sm:mt-8 sm:text-[1.75rem]"
          >
            <span className="break-all">{profile.email}</span>
            <IconArrow
              width={20}
              height={20}
              className="hidden shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:block"
            />
          </a>

          <div className="no-print mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-9">
            <a
              href={profile.resume}
              download
              className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
            >
              <IconDownload width={15} height={15} />
              Download CV
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
            >
              <IconGithub width={15} height={15} />
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
            >
              <IconLinkedin width={15} height={15} />
              LinkedIn
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
