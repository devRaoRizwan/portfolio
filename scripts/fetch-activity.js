// Pulls GitHub contributions and LeetCode stats into src/activity.json so the
// Activity section is prerendered with real numbers. Runs before dev and build.
// A failed fetch keeps whatever snapshot is already on disk.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { profile } from '../src/content.js'

// Usernames come from the profile URLs so every link lives in content.js.
const lastSegment = (url) => new URL(url).pathname.split('/').filter(Boolean).pop()
const GITHUB_USER = lastSegment(profile.github)
const LEETCODE_USER = lastSegment(profile.leetcode)
const OUT = resolve('src/activity.json')

const previous = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, 'utf-8'))
  : { github: null, leetcode: null }

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

async function leetcode() {
  const query = `query ($u: String!) {
    matchedUser(username: $u) {
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      userCalendar { streak totalActiveDays submissionCalendar }
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
    recent: data.recentAcSubmissionList.map((s) => ({
      title: s.title,
      url: `https://leetcode.com/problems/${s.titleSlug}/`,
      date: new Date(s.timestamp * 1000).toISOString().slice(0, 10),
    })),
  }
}

const [gh, lc] = await Promise.allSettled([github(), leetcode()])
const pick = (result, name, fallback) => {
  if (result.status === 'fulfilled') return result.value
  console.warn(`[activity] ${name} fetch failed, keeping previous snapshot: ${result.reason.message}`)
  return fallback
}

const activity = {
  fetchedAt: new Date().toISOString(),
  github: pick(gh, 'GitHub', previous.github),
  leetcode: pick(lc, 'LeetCode', previous.leetcode),
}
writeFileSync(OUT, JSON.stringify(activity) + '\n')
console.log(
  `[activity] GitHub ${activity.github?.total ?? '-'} contributions, LeetCode ${activity.leetcode?.solved.all ?? '-'} solved`
)
