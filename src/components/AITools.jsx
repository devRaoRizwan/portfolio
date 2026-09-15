import { aitools } from '../content'
import { Section, Reveal, LogoGrid } from './ui'

export default function AITools() {
  return (
    <Section id="ai" title="AI tools">
      <Reveal>
        <LogoGrid items={aitools} />
      </Reveal>
    </Section>
  )
}
