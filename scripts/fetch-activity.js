// Pulls GitHub contributions and languages, LeetCode stats and the JobHarvester
// listing count into src/activity.json so the site is prerendered with real numbers. Runs before dev and build.
// A failed fetch keeps whatever snapshot is already on disk.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { profile } from '../src/content.js'

// Usernames come from the profile URLs so every link lives in content.js.
const lastSegment = (url) => new URL(url).pathname.split('/').filter(Boolean).pop()
const GITHUB_USER = lastSegment(profile.github)
const LEETCODE_USER = lastSegment(profile.leetcode)
const JOBHARVESTER_API = 'https://jobharvester-backend-3bto.onrender.com/api/v1/jobs/?page=1'
const OUT = resolve('src/activity.json')

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf-8')) : {}

async function github() {
  const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`)
  const html = await res.text()

  // Each day is a <td> with a date and level; its count lives in a <tool-tip for=id>.
  const counts = {}
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^(\d+) contribution/)
    counts[id] = n ? Number(n[1]) : 0
  }
  const days = []
  for (const [td] of html.matchAll(/<td[^>]*data-date="[^"]+"[^>]*>/g)) {
    const date = td.match(/data-date="([^"]+)"/)[1]
    const id = td.match(/id="([^"]+)"/)?.[1]
    const level = Number(td.match(/data-level="(\d)"/)?.[1] ?? 0)
    days.push({ date, count: counts[id] ?? 0, level })
  }
  if (!days.length) throw new Error('GitHub markup changed, no days found')
  days.sort((a, b) => a.date.localeCompare(b.date))

  return {
    user: GITHUB_USER,
    url: profile.github,
    total: days.reduce((sum, d) => sum + d.count, 0),
    days,
  }
}

// Weighted by repo rather than by bytes: a few large frontends would otherwise
// outweigh the many Python repos that make up most of the work.
async function languages() {
  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
    headers,
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)
  const repos = (await res.json()).filter((r) => !r.fork && r.language)

  const counts = {}
  for (const r of repos) counts[r.language] = (counts[r.language] ?? 0) + 1
  return {
    repos: repos.length,
    list: Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  }
}

// Render's free tier sleeps, so the first request can take close to a minute.
async function jobharvester() {
  const res = await fetch(JOBHARVESTER_API, { signal: AbortSignal.timeout(75000) })
  if (!res.ok) throw new Error(`JobHarvester responded ${res.status}`)
  const { count } = await res.json()
  if (typeof count !== 'number') throw new Error('JobHarvester response has no count')
  return { listings: count }
}

async function leetcode() {
  const query = `query ($u: String!) {
    matchedUser(username: $u) {
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      userCalendar { streak totalActiveDays submissionCalendar }
      tagProblemCounts {
        fundamental { tagName tagSlug problemsSolved }
        intermediate { tagName tagSlug problemsSolved }
        advanced { tagName tagSlug problemsSolved }
      }
    }
    allQuestionsCount { difficulty count }
    recentAcSubmissionList(username: $u, limit: 5) { title titleSlug timestamp }
  }`
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query, variables: { u: LEETCODE_USER } }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`LeetCode responded ${res.status}`)
  const { data, errors } = await res.json()
  if (errors || !data?.matchedUser) throw new Error(errors?.[0]?.message ?? 'No LeetCode user')

  const byDifficulty = (list) => Object.fromEntries(list.map((d) => [d.difficulty, d.count]))
  const solved = byDifficulty(data.matchedUser.submitStatsGlobal.acSubmissionNum)
  const available = byDifficulty(data.allQuestionsCount)
  const cal = data.matchedUser.userCalendar

  // The calendar is keyed by unix seconds at UTC midnight.
  const topics = Object.values(data.matchedUser.tagProblemCounts)
    .flat()
    .filter((t) => t.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved || a.tagName.localeCompare(b.tagName))
    .map((t) => ({
      name: t.tagName,
      solved: t.problemsSolved,
      url: `https://leetcode.com/tag/${t.tagSlug}/`,
    }))

  const days = Object.entries(JSON.parse(cal.submissionCalendar || '{}'))
    .map(([ts, count]) => ({ date: new Date(ts * 1000).toISOString().slice(0, 10), count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    user: LEETCODE_USER,
    url: profile.leetcode,
    solved: { all: solved.All, easy: solved.Easy, medium: solved.Medium, hard: solved.Hard },
    available: { easy: available.Easy, medium: available.Medium, hard: available.Hard },
    streak: cal.streak,
    activeDays: cal.totalActiveDays,
    days,
    topics,
    recent: data.recentAcSubmissionList.map((s) => ({
      title: s.title,
      url: `https://leetcode.com/problems/${s.titleSlug}/`,
      date: new Date(s.timestamp * 1000).toISOString().slice(0, 10),
    })),
  }
}

const sources = { github, languages, leetcode, jobharvester }
const results = await Promise.allSettled(Object.values(sources).map((fetchOne) => fetchOne()))

const activity = { fetchedAt: new Date().toISOString() }
Object.keys(sources).forEach((name, i) => {
  const result = results[i]
  if (result.status === 'fulfilled') {
    activity[name] = result.value
  } else {
    console.warn(`[activity] ${name} fetch failed, keeping previous snapshot: ${result.reason.message}`)
    activity[name] = previous[name] ?? null
  }
})
writeFileSync(OUT, JSON.stringify(activity) + '\n')
console.log(
  `[activity] GitHub ${activity.github?.total ?? '-'} contributions, ` +
    `top language ${activity.languages?.list[0]?.name ?? '-'}, ` +
    `LeetCode ${activity.leetcode?.solved.all ?? '-'} solved, ` +
    `JobHarvester ${activity.jobharvester?.listings ?? '-'} listings`
)
