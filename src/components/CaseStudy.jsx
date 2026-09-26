import { profile } from '../content'
import Diagram from './Diagram'
import { Shell } from './Sections'
import { Chip, Logo, IconArrow, IconGithub, IconMail, gmailWebUrl, openGmail } from './ui'

function Block({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="glass rounded-[24px] p-6 sm:p-8">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="text-[1.35rem] leading-tight tracking-tight sm:text-[1.6rem]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

const prose = 'text-[14px] leading-relaxed text-ink-soft sm:text-[15px]'

export default function CaseStudy({ study, next }) {
  return (
    <main id="main" className="pb-10 pt-4 sm:pt-5">
      <Shell>
        <div className="mx-auto max-w-[1100px]">
          <a
            href="/#projects"
            className="no-print mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted transition-colors hover:text-ink"
          >
            <IconArrow width={14} height={14} className="rotate-180" />
            All projects
          </a>

          <header className="glass overflow-hidden rounded-[26px]">
            <div className="bg-[#0e0e13]">
              <img
                src={study.cover}
                srcSet={`${study.cover.replace('.webp', '-800.webp')} 800w, ${study.cover} 1400w`}
                sizes="(min-width: 1100px) 1100px, 100vw"
                alt={`${study.project} cover`}
                width={1400}
                height={612}
                fetchpriority="high"
                className="aspect-[16/6] w-full object-cover object-top sm:aspect-[16/7]"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <Logo src={study.logo} name={study.project} className="h-12 w-12" />
                <div>
                  <p className="eyebrow">Case study</p>
                  <h1 className="mt-1 text-[1.9rem] leading-none tracking-tight sm:text-[2.6rem]">{study.project}</h1>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">{study.lead}</p>

              <dl className="mt-6 grid gap-4 border-t border-[var(--color-line)] pt-5 sm:grid-cols-3">
                {study.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="eyebrow">{f.label}</dt>
                    <dd className="mt-1.5 text-[14px] font-medium text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {study.stack.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="no-print mt-6 flex flex-wrap gap-2">
                <a
                  href={study.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                >
                  Open live site
                  <IconArrow width={15} height={15} />
                </a>
                <a
                  href={study.links.code}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass-chip glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
                >
                  <IconGithub width={15} height={15} />
                  Read the code
                </a>
              </div>
            </div>
          </header>

          <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
            <Block eyebrow="Why" title="The problem">
              <div className="max-w-3xl space-y-4">
                {study.problem.map((p) => (
                  <p key={p.slice(0, 24)} className={prose}>
                    {p}
                  </p>
                ))}
              </div>
            </Block>

            <Block eyebrow="Constraints" title="What it had to guarantee">
              <ul className="grid gap-3 sm:grid-cols-2">
                {study.guarantees.map((g) => (
                  <li key={g.title} className="glass-inset rounded-2xl p-4">
                    <p className="text-[14px] font-semibold text-ink">{g.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{g.body}</p>
                  </li>
                ))}
              </ul>
            </Block>

            <Block eyebrow="Architecture" title="How a push becomes an AI-BOM">
              {/* The diagram brings its own top margin; this pulls it back under the heading. */}
              <div className="@container -mt-6">
                <Diagram diagram={study.diagram} />
              </div>
              <ol className="mt-6 space-y-5">
                {study.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-medium text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0 max-w-3xl">
                      <p className="text-[15px] font-semibold text-ink">{s.title}</p>
                      <p className={`mt-1 ${prose}`}>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>

            <Block eyebrow="Trade-offs" title="Decisions, and what they cost">
              <div className="grid gap-3 lg:grid-cols-2">
                {study.decisions.map((d) => (
                  <article key={d.title} className="glass-inset flex flex-col rounded-2xl p-5">
                    <h3 className="text-[15px] font-semibold text-ink">{d.title}</h3>
                    <p className="eyebrow mb-1.5 mt-4">Why</p>
                    <p className="text-[13.5px] leading-relaxed text-ink-soft">{d.why}</p>
                    <p className="eyebrow mb-1.5 mt-4">The cost</p>
                    <p className="text-[13.5px] leading-relaxed text-muted">{d.cost}</p>
                  </article>
                ))}
              </div>
            </Block>

            <div className={`grid gap-5 sm:gap-6 ${study.testing ? 'lg:grid-cols-2' : ''}`}>
              <Block eyebrow="Security" title="Hardening">
                <ul className="space-y-3">
                  {study.hardening.map((h) => (
                    <li key={h.slice(0, 24)} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-soft">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/60" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Block>

              {study.testing && (
                <Block eyebrow="Quality" title="Testing">
                  <p className={prose}>{study.testing}</p>
                </Block>
              )}
            </div>

            <Block eyebrow="Honest limits" title="What I would change next">
              <ul className="grid gap-3 md:grid-cols-3">
                {study.next.map((n) => (
                  <li key={n.title} className="glass-inset rounded-2xl p-4">
                    <p className="text-[14px] font-semibold text-ink">{n.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{n.body}</p>
                  </li>
                ))}
              </ul>
            </Block>

            <section className="rounded-[24px] bg-[#0b0b0f] p-6 text-white sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[1.35rem] leading-tight tracking-tight text-white sm:text-[1.6rem]">
                    Want to talk through the design?
                  </h2>
                  <p className="mt-1.5 text-[14px] text-white/65">
                    I am happy to go deeper on any of these trade-offs.
                  </p>
                </div>
                <div className="no-print flex flex-wrap gap-2">
                  <a
                    href={gmailWebUrl(profile.email)}
                    onClick={(e) => openGmail(e, profile.email)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white/85"
                  >
                    <IconMail width={15} height={15} />
                    Email me
                  </a>
                  <a
                    href="/#projects"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    More projects
                  </a>
                </div>
              </div>
            </section>

            {next && (
              <a
                href={next.path}
                className="glass glass-hover group flex items-center gap-4 rounded-[24px] p-5 sm:p-6"
              >
                <Logo src={next.logo} name={next.project} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <p className="eyebrow">Next case study</p>
                  <p className="mt-1 text-[16px] font-semibold text-ink">{next.project}</p>
                </div>
                <IconArrow
                  width={18}
                  height={18}
                  className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink"
                />
              </a>
            )}
          </div>
        </div>
      </Shell>
    </main>
  )
}
