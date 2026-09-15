import { toolbelt } from '../content'
import { Section, Reveal, LogoGrid } from './ui'

export default function Stack() {
  return (
    <Section id="stack" title="Tools">
      <Reveal>
        <LogoGrid items={toolbelt} />
      </Reveal>
    </Section>
  )
}
