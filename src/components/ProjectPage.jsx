import activity from '../activity.json'
import Diagram from './Diagram'
import Slideshow from './Slideshow'
import MoreProjects from './MoreProjects'
import ProjectPeeks from './ProjectPeeks'
import { Shell } from './Sections'
import { Logo, Chip, IconArrow, IconGithub } from './ui'

// Rounded down to the hundred so "1,400+" stays true between daily refreshes.
const listings = Math.floor((activity.jobharvester?.listings ?? 1300) / 100) * 100

export const projectPath = (project) => `/projects/${project.slug}`

export const describe = (project) => project.description.replace('{listings}', listings.toLocaleString('en-US'))

// The cover first, then the screenshots the project has.
function slidesFor(project) {
  const { image, alt } = project.cover
  return [
    { src: image, srcSet: `${image.replace('.webp', '-800.webp')} 800w, ${image} 1400w`, alt, width: 1400, height: 612 },
    ...(project.gallery ?? []).map(({ src, alt }) => ({
      src,
      srcSet: `${src.replace('.webp', '-800.webp')} 800w, ${src} 1600w`,
      alt,
      width: 1600,
      height: 777,
    })),
  ]
}

const REPOS = [
  { key: 'overview', label: 'Overview' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'crawlers', label: 'Crawlers' },
]

const prose = 'text-[15px] leading-relaxed text-ink-soft'

function Block({ title, children }) {
  return (
    <section className="glass-inset rounded-2xl p-5 sm:p-6">
      <h2 className="text-[1.05rem] font-semibold tracking-tight">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

const Heading = ({ children }) => (
  <h2 className="mt-10 text-[1.15rem] font-semibold tracking-tight sm:text-[1.25rem]">{children}</h2>
)

export default function ProjectPage({ project }) {
  const repos = REPOS.filter((r) => project.links[r.key])
  const { details } = project

  return (
    <main id="main" className="pb-12 pt-4 sm:pt-5">
      <Shell>
        <div className="mx-auto max-w-[1100px]">
          <a
            href="/#projects"
            className="no-print mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted transition-colors hover:text-ink"
          >
            <IconArrow width={14} height={14} className="rotate-180" />
            All projects
          </a>

          <article className="glass overflow-hidden rounded-[26px]">
            <Slideshow slides={slidesFor(project)} label={`${project.name} screenshots`} autoplay={5000} />

            <div className="@container p-6 sm:p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <Logo src={project.logo} name={project.name} className="h-12 w-12 sm:h-14 sm:w-14" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h1 className="text-[1.7rem] leading-tight tracking-tight sm:text-[2.2rem]">{project.name}</h1>
                    {project.links.live && (
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-signal-ink">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
                        Live
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[13px] text-muted">{project.tagline}</p>
                </div>
              </div>

              {details ? (
                <>
                  <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    <Block title="The problem">
                      <p className={prose}>{details.problem}</p>
                    </Block>
                    <Block title="What I built">
                      <p className={prose}>{details.solution}</p>
                      <ul className="mt-4 space-y-2.5">
                        {details.points.map((point) => (
                          <li key={point} className="flex gap-3 text-[14px] leading-relaxed text-ink-soft">
                            <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </Block>
                  </div>

                  <Heading>How it works</Heading>
                  <Diagram diagram={details.flow ?? project.diagram} expanded />

                  <Heading>Tech used</Heading>
                  <dl className="mt-4 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                    {details.tech.map(({ layer, items }) => (
                      <div key={layer} className="grid gap-2 py-3.5 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-4">
                        <dt className="text-[13px] font-medium text-muted">{layer}</dt>
                        <dd className="flex flex-wrap gap-1.5">
                          {items.map((tech) => (
                            <Chip key={tech}>{tech}</Chip>
                          ))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <>
                  <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
                    {describe(project)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                  {project.diagram && <Diagram diagram={project.diagram} />}
                </>
              )}

              <div className="no-print mt-8 flex flex-wrap items-center gap-2">
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

          <MoreProjects current={project} />
          <ProjectPeeks current={project} />
        </div>
      </Shell>
    </main>
  )
}
