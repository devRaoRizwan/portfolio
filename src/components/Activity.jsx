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

const shortDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

function githubStats(days) {
  let longest = 0
  let run = 0
  let best = days[0]
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
    if (d.count > best.count) best = d
  }
  return {
    active: days.filter((d) => d.count > 0).length,
    longest,
    best,
  }
}

// GitHub's own linguist colours, so the bar reads like the one on a repo page.
const LANGUAGE_COLORS = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  'Jupyter Notebook': '#DA5B0B',
}
const languageColor = (name) => LANGUAGE_COLORS[name] ?? '#8b8b8b'

function Languages({ data }) {
  return (
    <div className="mb-5">
      <p className="eyebrow mb-2.5">Top languages</p>
      <div className="flex h-2 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        {data.list.map((l) => (
          <span key={l.name} style={{ width: `${(l.count / data.repos) * 100}%`, background: languageColor(l.name) }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.list.map((l) => (
          <li key={l.name} className="flex items-center gap-1.5 text-[12px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: languageColor(l.name) }} />
            <span className="font-medium text-ink">{l.name}</span>
            {l.count} {l.count === 1 ? 'repo' : 'repos'}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RecentRepos({ repos }) {
  return (
    <div className="mb-5">
      <p className="eyebrow mb-2.5">Recently worked on</p>
      <ul className="divide-y divide-[var(--color-line)]">
        {repos.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between gap-3 py-2.5 text-[13px] text-ink-soft hover:text-ink"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: languageColor(r.language) }} />
                <span className="truncate font-mono">{r.name}</span>
              </span>
              <span className="tabular shrink-0 font-mono text-[11px] text-faint">{shortDate(r.pushed)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div>
      <p className="tabular text-[15px] font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-muted">{label}</p>
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

function CardHead({ eyebrow, logo, value, caption, href, icon, linkLabel }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <Logo src={logo} name={eyebrow} className="h-12 w-12" />
        <div className="min-w-0">
          <p className="eyebrow mb-2">{eyebrow}</p>
          <p className="tabular text-[1.6rem] font-semibold leading-none tracking-tight text-ink sm:text-[2.1rem]">
            {value}
          </p>
          <p className="mt-2 text-[13px] text-muted">{caption}</p>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="no-print glass-chip glass-hover inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-ink"
      >
        {icon}
        {linkLabel}
      </a>
    </div>
  )
}

function GithubCard({ data, repos }) {
  const stats = githubStats(data.days)
  const bestDay = shortDate(stats.best.date)
  return (
    <article className="glass flex h-full flex-col rounded-[22px] p-5 sm:p-6">
      <CardHead
        eyebrow="GitHub"
        logo="/tech/github.svg"
        value={data.total.toLocaleString('en-US')}
        caption="Contributions in the last year"
        href={data.url}
        icon={<IconGithub width={15} height={15} />}
        linkLabel="Profile"
      />
      <div className="glass-inset mt-6 rounded-2xl p-3 sm:p-4">
        <Heatmap
          days={data.days}
          levelOf={(day) => day?.level ?? 0}
          noun="contribution"
          label={`${data.total} GitHub contributions in the last year`}
        />
      </div>
      <div className="mb-5 mt-3 flex justify-end">
        <Legend />
      </div>
      {repos?.languages.list.length > 0 && <Languages data={repos.languages} />}
      {repos?.recent.length > 0 && <RecentRepos repos={repos.recent} />}
      <div className="mt-auto grid grid-cols-3 gap-3 border-t border-[var(--color-line)] pt-5">
        <MiniStat value={stats.active} label="Days with commits" />
        <MiniStat value={`${stats.longest} days`} label="Longest streak" />
        <MiniStat value={stats.best.count} label={`Busiest day, ${bestDay}`} />
      </div>
    </article>
  )
}

function LeetcodeCard({ data }) {
  const { solved } = data
  const tiers = [
    { key: 'easy', label: 'Easy', shade: '#1cbaba' },
    { key: 'medium', label: 'Medium', shade: '#ffb800' },
    { key: 'hard', label: 'Hard', shade: '#f63737' },
  ]

  return (
    <article className="glass flex h-full flex-col rounded-[22px] p-5 sm:p-6">
      <CardHead
        eyebrow="LeetCode"
        logo="/tech/leetcode.svg"
        value={solved.all}
        caption={`Problems solved over ${data.activeDays} active days`}
        href={data.url}
        icon={<IconCode width={15} height={15} />}
        linkLabel="Profile"
      />

      <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-[rgba(10,10,10,0.06)]" aria-hidden>
        {tiers.map((t) => (
          <span key={t.key} style={{ width: `${(solved[t.key] / (solved.all || 1)) * 100}%`, background: t.shade }} />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3">
        {tiers.map((t) => (
          <div key={t.key}>
            <dt className="flex items-center gap-1.5 text-[12px] text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: t.shade }} />
              {t.label}
            </dt>
            <dd className="tabular mt-0.5 text-[15px] font-semibold text-ink">
              {solved[t.key]}
              <span className="font-normal text-faint"> / {data.available[t.key]}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="glass-inset mt-5 rounded-2xl p-3 sm:p-4">
        <Heatmap
          days={data.days}
          levelOf={(_, count) => leetcodeLevel(count)}
          noun="submission"
          label={`LeetCode submissions over the last year, ${data.activeDays} active days`}
        />
      </div>

      {data.topics?.length > 0 && (
        <>
          <p className="eyebrow mb-2.5 mt-5">Topic skills</p>
          <ul className="flex flex-wrap gap-1.5">
            {data.topics.slice(0, 8).map((t) => (
              <li key={t.url}>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass-chip glass-hover inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:px-2.5 sm:py-1 text-ink-soft hover:text-ink"
                >
                  {t.name}
                  <span className="tabular font-mono text-[11px] text-faint">{t.solved}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {data.recent.length > 0 && (
        <>
          <p className="eyebrow mb-2.5 mt-5">Recently solved</p>
          <ul className="flex flex-wrap gap-1.5">
            {data.recent.map((p) => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass-chip glass-hover inline-flex rounded-lg px-3 py-2 font-mono text-xs sm:px-2.5 sm:py-1 text-ink-soft hover:text-ink"
                >
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}

export default function Activity() {
  const { github, repos, leetcode } = activity
  if (!github && !leetcode) return null

  return (
    <Section id="activity" title="Activity">
      <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
        {github && (
          <Reveal className="h-full">
            <GithubCard data={github} repos={repos} />
          </Reveal>
        )}
        {leetcode && (
          <Reveal delay={80} className="h-full">
            <LeetcodeCard data={leetcode} />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
