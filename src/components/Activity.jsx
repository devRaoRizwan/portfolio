import activity from '../activity.json'
import { Section } from './Sections'
import { Reveal, Logo, IconGithub, IconCode } from './ui'

const WEEKS = 53
const CELL = 11
const GAP = 3
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// The green scale both GitHub and LeetCode use for their calendars.
const SHADES = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']

const leetcodeLevel = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 4 ? 2 : n <= 7 ? 3 : 4)

// Dates are derived from the snapshot, not the clock, so the prerendered
// markup and the hydrated markup always agree.
function buildWeeks(days, levelOf, weeksShown) {
  const byDate = new Map(days.map((d) => [d.date, d]))
  const end = new Date(activity.fetchedAt.slice(0, 10) + 'T00:00:00Z')
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - end.getUTCDay() - (weeksShown - 1) * 7)

  const weeks = []
  for (let w = 0; w < weeksShown; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + w * 7 + d)
      if (date > end) break
      const key = date.toISOString().slice(0, 10)
      const count = byDate.get(key)?.count ?? 0
      week.push({ key, count, level: levelOf(byDate.get(key), count), month: date.getUTCMonth(), day: date.getUTCDate() })
    }
    weeks.push(week)
  }
  return weeks
}

function Grid({ days, levelOf, noun, label, weeksShown, className }) {
  const weeks = buildWeeks(days, levelOf, weeksShown)
  const width = weeksShown * (CELL + GAP) - GAP
  const top = 16
  const height = top + 7 * (CELL + GAP) - GAP

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className={`h-auto w-full ${className}`}>
      {weeks.map((week, w) => {
        const first = week[0]
        const showMonth = first && first.day <= 7 && w < weeksShown - 2
        return (
          <g key={w} transform={`translate(${w * (CELL + GAP)} 0)`}>
            {showMonth && (
              <text y={10} className="fill-[var(--color-faint)] font-mono text-[9px]">
                {MONTHS[first.month]}
              </text>
            )}
            {week.map((day, d) => (
              <rect
                key={day.key}
                y={top + d * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2.5}
                fill={SHADES[day.level]}
              >
                <title>{`${day.count || 'No'} ${noun}${day.count === 1 ? '' : 's'} on ${day.key}`}</title>
              </rect>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// A full year is unreadable at phone width, so phones get the last six months.
function Heatmap(props) {
  return (
    <>
      <Grid {...props} weeksShown={WEEKS} className="hidden sm:block" />
      <Grid {...props} weeksShown={26} className="sm:hidden" />
    </>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
      Less
      {SHADES.map((c) => (
        <span key={c} className="h-2.5 w-2.5 rounded-[3px]" style={{ background: c }} />
      ))}
      More
    </div>
  )
}

function HeatmapCard({ name, handle, logo, url, icon, days, levelOf, noun }) {
  return (
    <article className="glass flex h-full flex-col rounded-[22px] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Logo src={logo} name={name} className="h-11 w-11" />
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight text-ink">{name}</h3>
            <p className="mt-0.5 truncate font-mono text-[12px] text-muted">@{handle}</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="no-print glass-chip glass-hover inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-ink"
        >
          {icon}
          Profile
        </a>
      </div>
      <div className="glass-inset mt-5 rounded-2xl p-3 sm:p-4">
        <Heatmap days={days} levelOf={levelOf} noun={noun} label={`${name} activity over the last year`} />
      </div>
      <div className="mt-3 flex justify-end">
        <Legend />
      </div>
    </article>
  )
}

export default function Activity() {
  const { github, leetcode } = activity
  if (!github && !leetcode) return null

  return (
    <Section id="activity" title="Activity">
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
        {github && (
          <Reveal className="h-full">
            <HeatmapCard
              name="GitHub"
              handle={github.user}
              logo="/tech/github.svg"
              url={github.url}
              icon={<IconGithub width={15} height={15} />}
              days={github.days}
              levelOf={(day) => day?.level ?? 0}
              noun="contribution"
            />
          </Reveal>
        )}
        {leetcode && (
          <Reveal delay={80} className="h-full">
            <HeatmapCard
              name="LeetCode"
              handle={leetcode.user}
              logo="/tech/leetcode.svg"
              url={leetcode.url}
              icon={<IconCode width={15} height={15} />}
              days={leetcode.days}
              levelOf={(_, count) => leetcodeLevel(count)}
              noun="submission"
            />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
