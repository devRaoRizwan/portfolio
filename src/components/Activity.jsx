import activity from '../activity.json'
import { Section } from './Sections'
import { Reveal, Logo, IconCode, IconArrow } from './ui'

const WEEKS = 53
const CELL = 11
const GAP = 3
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// The site's own emerald, light to dark, so the calendars match the Live dots.
const SHADES = ['#e7e7ec', '#a7f3d0', '#34d399', '#059669', '#065f46']

// Dates are derived from the snapshot, not the clock, so the prerendered
// markup and the hydrated markup always agree.
const END = new Date(activity.fetchedAt.slice(0, 10) + 'T00:00:00Z')

function windowStart(weeksShown) {
  const start = new Date(END)
  start.setUTCDate(start.getUTCDate() - END.getUTCDay() - (weeksShown - 1) * 7)
  return start
}

// Totals cover exactly the cells the full-width grid draws.
function yearStats(days) {
  const from = windowStart(WEEKS).toISOString().slice(0, 10)
  const to = END.toISOString().slice(0, 10)
  const inWindow = days.filter((d) => d.date >= from && d.date <= to && d.count > 0)

  // Longest run of consecutive active days inside the same window.
  let longest = 0
  let run = 0
  let prev = null
  for (const { date } of inWindow) {
    const t = Date.parse(`${date}T00:00:00Z`)
    run = prev !== null && t - prev === 86400000 ? run + 1 : 1
    longest = Math.max(longest, run)
    prev = t
  }

  return {
    total: inWindow.reduce((sum, d) => sum + d.count, 0),
    activeDays: inWindow.length,
    longest,
    busiest: Math.max(0, ...inWindow.map((d) => d.count)),
  }
}

// One rule for both calendars, so a shade means the same thing on each: four
// steps relative to that calendar's busiest day. On GitHub data this lands on
// almost the same cut-offs GitHub uses for its own graph.
function shadeBy(days) {
  const { busiest } = yearStats(days)
  return (_, count) => (count === 0 || !busiest ? 0 : Math.min(4, Math.ceil((4 * count) / busiest)))
}

const plural = (n, word) => `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`

function Stats({ items }) {
  return (
    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
      {items.map(({ label, value }) => (
        // Label first for screen readers ("Active days: 78"), number first on screen.
        <div key={label} className="flex min-w-0 flex-col">
          <dt className="order-2 mt-1.5 text-[12px] leading-snug text-muted">{label}</dt>
          <dd className="order-1 tabular text-[1.35rem] font-semibold leading-none tracking-tight text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function buildWeeks(days, levelOf, weeksShown) {
  const byDate = new Map(days.map((d) => [d.date, d]))
  const end = END
  const start = windowStart(weeksShown)

  const weeks = []
  for (let w = 0; w < weeksShown; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + w * 7 + d)
      if (date > end) break
      const key = date.toISOString().slice(0, 10)
      const count = byDate.get(key)?.count ?? 0
      week.push({ key, count, level: levelOf?.(byDate.get(key), count) ?? 0, month: date.getUTCMonth(), day: date.getUTCDate() })
    }
    weeks.push(week)
  }
  return weeks
}

// `paint(date)` overrides the green scale: it returns a colour, or a pair of
// colours for a cell split diagonally between two sources.
function Grid({ days = [], levelOf, paint, label, weeksShown, className }) {
  const weeks = buildWeeks(days, levelOf, weeksShown)
  const width = weeksShown * (CELL + GAP) - GAP
  const top = 16
  const height = top + 7 * (CELL + GAP) - GAP

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className={`h-auto ${className}`}>
      {paint && (
        <defs>
          <clipPath id="split-cell" clipPathUnits="objectBoundingBox">
            <rect width="1" height="1" rx={2.5 / CELL} />
          </clipPath>
        </defs>
      )}
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
            {week.map((day, d) => {
              const y = top + d * (CELL + GAP)
              const fill = paint ? paint(day.key) : SHADES[day.level]
              if (Array.isArray(fill)) {
                return (
                  <g key={day.key} clipPath="url(#split-cell)">
                    <polygon points={`0,${y} ${CELL},${y} 0,${y + CELL}`} fill={fill[0]} />
                    <polygon points={`${CELL},${y} ${CELL},${y + CELL} 0,${y + CELL}`} fill={fill[1]} />
                  </g>
                )
              }
              return <rect key={day.key} y={y} width={CELL} height={CELL} rx={2.5} fill={fill} />
            })}
          </g>
        )
      })}
    </svg>
  )
}

// A full year is unreadable at phone width, so phones see the latest half of
// the same grid, cropped from the right.
function Heatmap(props) {
  return (
    <div className="flex justify-end overflow-hidden">
      <Grid {...props} weeksShown={WEEKS} className="w-[204%] max-w-none shrink-0 sm:w-full" />
    </div>
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

// Profile links under each calendar: logo, name, one line of detail, and a
// Profile button. Two side by side on wide cards, stacked on phones.
function ProfileTiles({ items }) {
  return (
    <ul className={`mt-3 grid gap-2 ${items.length > 1 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((p) => (
        <li key={p.name} className="glass-inset flex items-center gap-2.5 rounded-xl px-3 py-2.5">
          <Logo src={p.logo} name={p.name} className="h-8 w-8" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold leading-tight text-ink">{p.name}</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted">
              {p.color && <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} />}
              <span className="tabular truncate">{p.line}</span>
            </span>
          </span>
          <a
            href={p.url}
            target="_blank"
            rel="me noreferrer noopener"
            aria-label={`${p.name} profile`}
            className="no-print glass-chip glass-hover inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-ink"
          >
            Profile
            <IconArrow width={12} height={12} className="-rotate-45" />
          </a>
        </li>
      ))}
    </ul>
  )
}

function HeatmapCard({ name, handle, logo, url, days, levelOf, stats, profileLine }) {
  return (
    <article className="glass flex h-full flex-col rounded-[22px] p-5 sm:p-6">
      <div className="flex min-w-0 items-center gap-3">
        <Logo src={logo} name={name} className="h-11 w-11" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight text-ink">{name}</h3>
          <p className="mt-0.5 truncate font-mono text-[12px] text-muted">@{handle}</p>
        </div>
      </div>
      <Stats items={stats} />
      <div className="glass-inset mt-5 rounded-2xl p-3 sm:p-4">
        <Heatmap days={days} levelOf={levelOf} label={`${name} activity over the last year`} />
      </div>
      <ProfileTiles items={[{ name, logo, url, line: profileLine }]} />
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
        <p className="font-mono text-[12px] text-muted">Calendar figures cover the last 12 months</p>
        <Legend />
      </div>
    </article>
  )
}

// One solid colour per platform, no light-to-dark steps: a day either has
// activity on that platform or it does not.
const LEETCODE_COLOR = '#d97e2c'
const GFG_COLOR = '#3f9157'

// One calendar for both platforms: brown for LeetCode, dark green for
// GeeksforGeeks, split down the diagonal on days with both.
function combinedPainter(sources) {
  const active = sources.map(({ days, color }) => ({ dates: new Set(days.filter((d) => d.count > 0).map((d) => d.date)), color }))
  return (date) => {
    const hits = active.filter((s) => s.dates.has(date)).map((s) => s.color)
    if (hits.length === 0) return SHADES[0]
    return hits.length === 1 ? hits[0] : hits.slice(0, 2)
  }
}

function SplitLegend({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-faint">
      {items.map(({ label, colors }) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-[3px]"
            style={{ background: colors.length > 1 ? `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)` : colors[0] }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}

// LeetCode and GeeksforGeeks on the same skeleton as the GitHub card: header,
// four numbers, the combined calendar, then a row per platform with its own
// Profile button, and a caption with the legend.
function ProblemSolvingCard({ user, platforms, stats }) {
  const total = platforms.reduce((sum, p) => sum + p.solved, 0)
  const withDays = platforms.filter((p) => p.days?.length)
  const paint = combinedPainter(withDays.map((p) => ({ days: p.days, color: p.color })))

  return (
    <article className="glass flex h-full flex-col rounded-[22px] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="glass-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink">
          <IconCode width={20} height={20} />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight text-ink">Problem solving</h3>
          <p className="mt-0.5 truncate font-mono text-[12px] text-muted">@{user}</p>
        </div>
      </div>

      <Stats items={[{ label: 'Total solved', value: total }, ...stats]} />

      <div className="glass-inset mt-5 rounded-2xl p-3 sm:p-4">
        <Heatmap paint={paint} label="LeetCode and GeeksforGeeks activity over the last year" />
      </div>

      <ProfileTiles items={platforms.map((p) => ({ ...p, line: `${p.solved} solved` }))} />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
        <p className="font-mono text-[12px] text-muted">Calendar figures cover the last 12 months</p>
        <SplitLegend
          items={[
            ...withDays.map((p) => ({ label: p.short, colors: [p.color] })),
            ...(withDays.length > 1 ? [{ label: 'Both', colors: withDays.map((p) => p.color) }] : []),
          ]}
        />
      </div>
    </article>
  )
}

export default function Activity() {
  const { github, leetcode, gfg } = activity
  if (!github && !leetcode) return null

  const gh = github && yearStats(github.days)
  const lc = leetcode && yearStats(leetcode.days)
  const solved = leetcode?.solved

  return (
    <Section id="activity" title="Activity">
      <div className={`grid items-stretch gap-5 lg:gap-6 ${github && leetcode ? 'lg:grid-cols-2' : 'mx-auto max-w-[900px]'}`}>
        {github && (
          <Reveal className="h-full">
            <HeatmapCard
              name="GitHub"
              handle={github.user}
              logo="/tech/github.svg"
              url={github.url}
              profileLine={`github.com/${github.user}`}
              days={github.days}
              levelOf={shadeBy(github.days)}
              stats={[
                { label: 'Contributions', value: gh.total.toLocaleString('en-US') },
                { label: 'Active days', value: gh.activeDays },
                { label: 'Longest streak', value: plural(gh.longest, 'day') },
                ...(github.repos != null ? [{ label: 'Public repos', value: github.repos }] : []),
              ]}
            />
          </Reveal>
        )}
        {leetcode && (
          <Reveal delay={80} className="h-full">
            <ProblemSolvingCard
              user={leetcode.user}
              // A platform with no saved count is left out rather than shown as 0.
              platforms={[
                ...(solved?.all != null
                  ? [{ name: 'LeetCode', short: 'LeetCode', url: leetcode.url, logo: '/tech/leetcode.svg', color: LEETCODE_COLOR, solved: solved.all, days: leetcode.days }]
                  : []),
                ...(gfg?.solved != null
                  ? [{ name: 'GeeksforGeeks', short: 'GfG', url: gfg.url, logo: '/tech/geeksforgeeks.svg', color: GFG_COLOR, solved: gfg.solved, days: gfg.days }]
                  : []),
              ]}
              stats={[
                { label: 'LeetCode active days', value: lc.activeDays },
                { label: 'LeetCode submissions', value: lc.total.toLocaleString('en-US') },
                { label: 'Longest streak', value: plural(lc.longest, 'day') },
              ]}
            />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
