import { work } from '../content'
import { Section, Reveal, Chip, Logo } from './ui'
import Diagram from './Diagram'

export default function Work() {
  return (
    <Section id="work" title="Experience">
      <div className="space-y-5">
        {work.map((job, i) => (
          <Reveal key={job.company} delay={i * 80}>
            <article className="glass glass-hover rounded-[24px] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <Logo src={job.logo} name={job.company} size={48} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-xl font-semibold text-ink">{job.company}</h3>
                    <p className="font-mono text-xs text-faint">{job.period}</p>
                  </div>
                  <p className="mt-0.5 font-mono text-sm text-muted">{job.role}</p>
                </div>
              </div>

              <p className="mt-5 max-w-3xl leading-relaxed text-ink-soft">{job.story}</p>

              <Diagram diagram={job.diagram} />

              <div className="mt-6 flex flex-wrap gap-1.5">
                {job.stack.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
