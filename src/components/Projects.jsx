import { projects } from '../content'
import { Section, Reveal, Chip, IconArrow, IconGithub } from './ui'
import Diagram, { NodeIcon } from './Diagram'

function Cover({ cover, name, href }) {
  if (!cover) return null

  const inner = cover.image ? (
    <img
      src={cover.image}
      alt={cover.alt}
      width={1400}
      height={900}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-accent-soft via-white to-accent-soft">
      <NodeIcon icon={cover.icon} size={40} />
      {cover.caption && (
        <span className="font-mono text-xs text-muted">{cover.caption}</span>
      )}
    </div>
  )

  const shell =
    'group block aspect-[16/11] overflow-hidden rounded-2xl shadow-[0_2px_4px_rgba(10,10,10,0.05),0_18px_40px_-18px_rgba(10,10,10,0.35)] ring-1 ring-black/[0.07] md:aspect-auto md:h-full md:self-stretch'

  return href ? (
    <a href={href} target="_blank" rel="noreferrer noopener" className={shell}>
      {inner}
      <span className="sr-only">Open the live {name} site</span>
    </a>
  ) : (
    <div className={shell}>{inner}</div>
  )
}

function Links({ name, links }) {
  const repos = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'crawlers', label: 'Crawlers' },
  ].filter((r) => links[r.key])

  return (
    <div className="no-print mt-6 flex flex-wrap items-center gap-2">
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[0_2px_4px_rgba(10,10,10,0.08),0_10px_24px_-10px_rgba(10,10,10,0.4)] transition-colors hover:bg-accent-dark"
        >
          Open live site
          <span className="sr-only">for {name}</span>
          <IconArrow width={15} height={15} />
        </a>
      )}
      {repos.map((repo) => (
        <a
          key={repo.key}
          href={links[repo.key]}
          target="_blank"
          rel="noreferrer noopener"
          className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
        >
          <IconGithub width={15} height={15} />
          {repos.length > 1 ? repo.label : 'Source'}
          <span className="sr-only">code for {name}</span>
        </a>
      ))}
    </div>
  )
}

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-5">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 80}>
            <article className="glass glass-hover rounded-[24px] p-6 sm:p-8">
              <div className="grid items-stretch gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
                <Cover cover={project.cover} name={project.name} href={project.links.live} />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-2xl font-semibold text-ink">{project.name}</h3>
                    {project.links.live && (
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-ink">
                        <span aria-hidden className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-40" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-sm text-muted">{project.tagline}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>

                  <p className="mt-5 leading-relaxed text-ink-soft">{project.description}</p>

                  <Links name={project.name} links={project.links} />
                </div>
              </div>

              <Diagram diagram={project.diagram} />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
