import { background } from '../content'
import { Section, Reveal, Logo } from './ui'

export default function Background() {
  const { education, community } = background

  return (
    <Section id="education" title="Background">
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-[24px] p-6 sm:p-7">
            <p className="eyebrow mb-3">Studied</p>
            <div className="flex items-center gap-3">
              <Logo src={education.logo} name={education.institution} size={40} />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-ink">
                  {education.institution}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {education.degree}, {education.period}
                </p>
              </div>
            </div>

          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="glass h-full rounded-[24px] p-6 sm:p-7">
            <p className="eyebrow mb-3">Outside work</p>
            <ul className="space-y-4">
              {community.map((item) => (
                <li key={item.org} className="flex items-start gap-3">
                  <Logo src={item.logo} name={item.org} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug text-ink">{item.org}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
