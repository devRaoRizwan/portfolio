// Renders every project cover from one template so the Projects grid reads as
// a set, plus the site's social preview (og.png) in the same fonts. Output is 1400x612 (the card's 16:7 frame); everything that matters
// sits in the top 500px because phones crop the card to 16:6 from the top.
//
// Each cover comes in two themes: dark (the project page slideshow) and light
// (the home page card, as <slug>-light.webp).
//
// Run: npm i --no-save playwright && node scripts/covers/render.mjs
//      add --light to render only the light covers and leave everything else alone
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, extname } from 'node:path'
import { chromium } from 'playwright'

const W = 1400
const H = 612
const OUT = resolve('public/images/covers')

const covers = [
  {
    slug: 'bomwatcher',
    name: 'BOMWatcher',
    logo: 'public/logos/projects/bomwatcher.svg',
    accent: '#4FD1C1',
    glow: '#0F766E',
    ink: '#0F766E',
    headline: ['Know every dependency', 'and <em>AI model</em> your', 'code ships with'],
    sub: 'AI Bill of Materials for your GitHub repos, generated on your own GitHub Actions.',
    chips: ['CycloneDX 1.6', 'Code never leaves GitHub'],
    domain: 'bomwatcher.vercel.app',
  },
  {
    slug: 'sitescopia',
    name: 'SiteScopia',
    logo: 'public/logos/projects/sitescopia.svg',
    accent: '#38BDF8',
    glow: '#1E3A8A',
    ink: '#0369A1',
    headline: ['See what your', 'page is <em>really</em>', '<em>telling you</em>'],
    sub: 'Evidence-led website analysis for SEO, accessibility, security, performance and domain signals.',
    chips: ['38 checks · 7 categories', 'Evidence in every result'],
    domain: 'sitescopia.online',
  },
  {
    slug: 'jobharvester',
    name: 'JobHarvester',
    logo: 'public/logos/projects/jobharvester.webp',
    accent: '#FF4D79',
    glow: '#831843',
    ink: '#E11D48',
    headline: ['A smarter way to', 'discover the <em>right</em>', '<em>opportunities</em>'],
    sub: 'Tech jobs from Lahore companies, crawled on a schedule and searchable in one place.',
    chips: ['Scheduled crawlers', 'Django REST API'],
    domain: 'job-harvester-demo.vercel.app',
  },
  {
    slug: 'jobbr',
    name: 'Jobbr',
    logo: 'public/logos/projects/jobbr.svg',
    accent: '#A78BFA',
    glow: '#4C1D95',
    ink: '#6D28D9',
    headline: ['One job board API', 'for <em>two very</em>', '<em>different users</em>'],
    sub: 'Employers and job seekers share the data. JWT and role-based access keep them apart.',
    chips: ['JWT auth', 'Role-based access'],
    domain: 'github.com/devRaoRizwan/jobbr',
  },
]

const MIME = { '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' }
const dataUri = (path) => `data:${MIME[extname(path)]};base64,${readFileSync(resolve(path)).toString('base64')}`
const inter = dataUri('public/fonts/inter.woff2')
const mono = dataUri('public/fonts/jetbrains-mono.woff2')

// Light keeps the same layout; the bright accents become deeper inks so the
// highlighted words and chips still read on white.
const THEMES = {
  dark: (c) => ({
    text: '#fff',
    sub: 'rgba(255,255,255,0.7)',
    domain: 'rgba(255,255,255,0.85)',
    em: c.accent,
    grid: 'rgba(255,255,255,0.035)',
    background: `radial-gradient(900px 520px at 88% 30%, ${c.glow}66, transparent 70%),
      radial-gradient(700px 420px at 0% 0%, ${c.glow}33, transparent 70%),
      #0b0d12`,
    tileShadow: `0 30px 80px -20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.08)`,
  }),
  light: (c) => ({
    text: '#0a0a0a',
    sub: '#4a4a52',
    domain: '#3a3a3a',
    em: c.ink,
    grid: 'rgba(10,10,10,0.045)',
    background: `radial-gradient(900px 520px at 88% 30%, ${c.accent}40, transparent 70%),
      radial-gradient(700px 420px at 0% 0%, ${c.accent}1f, transparent 70%),
      #f7f7f9`,
    tileShadow: `0 30px 70px -24px ${c.glow}99, 0 0 0 1px rgba(10,10,10,0.06)`,
  }),
}

const page = (c, theme) => {
  const logo = dataUri(c.logo)
  const t = THEMES[theme](c)
  return `<!doctype html><html><head><style>
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${inter}) format('woff2'); }
  @font-face { font-family: Mono; font-weight: 400 500; src: url(${mono}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden; position: relative;
    font-family: Inter, sans-serif; color: ${t.text};
    background: ${t.background};
  }
  body::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(${t.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${t.grid} 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, #000 40%, transparent 100%);
  }
  .wrap { position: absolute; inset: 88px 80px auto 80px; }
  .hero img { width: 100%; height: 100%; display: block; }
  h1 { font-size: 66px; line-height: 1.04; font-weight: 700; letter-spacing: -0.035em; max-width: 780px; }
  h1 em { font-style: normal; color: ${t.em}; }
  p { margin-top: 26px; max-width: 640px; font-size: 22px; line-height: 1.45; color: ${t.sub}; }
  .foot { position: absolute; left: 80px; right: 80px; top: 440px; display: flex; align-items: center; justify-content: space-between; }
  .chips { display: flex; gap: 12px; }
  .chip {
    font-size: 18px; font-weight: 600; color: ${t.em};
    padding: 10px 18px; border-radius: 999px;
    border: 1px solid ${t.em}55; background: ${t.em}14;
  }
  .domain { font-family: Mono, monospace; font-size: 20px; font-weight: 500; color: ${t.domain}; }
  .hero {
    position: absolute; right: 120px; top: 100px; width: 270px; height: 270px;
    border-radius: 64px; overflow: hidden;
    box-shadow: ${t.tileShadow};
  }
  </style></head><body>
  <div class="wrap">
    <h1>${c.headline.join('<br>')}</h1>
    <p>${c.sub}</p>
  </div>
  <div class="hero"><img src="${logo}"></div>
  <div class="foot">
    <div class="chips">${c.chips.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
    <span class="domain">${c.domain}</span>
  </div>
  </body></html>`
}

const lightOnly = process.argv.includes('--light')
const themes = lightOnly ? ['light'] : ['dark', 'light']

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const tab = await browser.newPage({ viewport: { width: W, height: H } })
for (const c of covers) for (const theme of themes) {
  const name = theme === 'dark' ? c.slug : `${c.slug}-light`
  await tab.setContent(page(c, theme), { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  const png = await tab.screenshot({ type: 'png' })

  // Playwright only writes PNG or JPEG, so let Chromium re-encode as WebP.
  const webp = await tab.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    const encode = (width) => {
      const height = Math.round((img.height * width) / img.width)
      const canvas = Object.assign(document.createElement('canvas'), { width, height })
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)
      return canvas.toDataURL('image/webp', 0.86).split(',')[1]
    }
    return { 1400: encode(img.width), 800: encode(800) }
  }, `data:image/png;base64,${png.toString('base64')}`)

  writeFileSync(resolve(OUT, `${name}.webp`), Buffer.from(webp['1400'], 'base64'))
  writeFileSync(resolve(OUT, `${name}-800.webp`), Buffer.from(webp['800'], 'base64'))
  console.log(`[covers] ${name}.webp, ${name}-800.webp`)
}

if (lightOnly) {
  await browser.close()
  process.exit(0)
}

// Social preview, 1200x630 PNG: same look as the LinkedIn banner
// (scripts/covers/linkedin.mjs), light background with the covers as a tilted wall.
const { profile } = await import('../../src/content.js')
const wallCovers = covers.map((c) => dataUri(`public/images/covers/${c.slug}-800.webp`))
const wall = [0, 1, 2, 3, 4].map((i) => [0, 1, 2, 3, 4].map((j) => wallCovers[(i + j) % wallCovers.length]))
const stack = [['Python', 'python'], ['Flask', 'flask'], ['FastAPI', 'fastapi'], ['Django', 'django'], ['MongoDB', 'mongodb'], ['AWS', 'amazonwebservices']]
const og = `<!doctype html><html><head><style>
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${inter}) format('woff2'); }
  @font-face { font-family: Mono; font-weight: 400 500; src: url(${mono}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    font-family: Inter, sans-serif; color: #0a0a0a;
    background:
      radial-gradient(620px 420px at 0% 0%, #d4d4dc, transparent 70%),
      radial-gradient(520px 360px at 30% 115%, #dcdce3, transparent 70%),
      #f4f4f7;
  }
  body::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to right, #000 0%, #000 45%, transparent 70%);
  }
  .wall {
    position: absolute; left: 740px; top: -120px; width: 1100px; height: 1400px; transform-origin: 30% 30%;
    display: flex; gap: 18px;
    transform: perspective(1600px) rotateX(18deg) rotateY(-22deg) rotateZ(12deg);
  }
  .col { display: flex; flex-direction: column; gap: 18px; width: 320px; flex: none; }
  .col:nth-child(even) { margin-top: -90px; }
  .col img {
    width: 100%; display: block; border-radius: 14px;
    box-shadow: 0 20px 40px -18px rgba(10,10,10,0.5), 0 0 0 1px rgba(10,10,10,0.06);
  }
  .veil {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, #f4f4f7 0%, #f4f4f7 65%, rgba(244,244,247,0.8) 71%, rgba(244,244,247,0) 84%);
  }
  .wrap { position: absolute; left: 80px; top: 50%; transform: translateY(-50%); width: 720px; }
  .kicker { font-family: Mono, monospace; font-size: 20px; font-weight: 500; color: #565656; letter-spacing: 0.04em; }
  h1 { margin-top: 20px; font-size: 54px; white-space: nowrap; line-height: 1.04; font-weight: 700; letter-spacing: -0.04em; }
  h1 em { font-style: normal; color: #7a7a85; }
  .stack { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 10px; max-width: 720px; }
  .stack span {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: Mono, monospace; font-size: 17px; color: #3a3a3a; padding: 8px 12px 8px 9px; border-radius: 12px;
    background: rgba(255,255,255,0.85); border: 1px solid #fff; box-shadow: 0 1px 2px rgba(10,10,10,0.08);
  }
  .stack img { width: 22px; height: 22px; }
  .foot { margin-top: 30px; font-family: Mono, monospace; font-size: 22px; }
  .web { display: inline-flex; align-items: center; gap: 10px; font-weight: 500; color: #1d4ed8; }
  .web svg { width: 24px; height: 24px; }
  .web u { text-decoration-thickness: 2px; text-underline-offset: 5px; text-decoration-color: rgba(29,78,216,0.4); }
  </style></head><body>
  <div class="wall">${wall.map((col) => `<div class="col">${col.map((c) => `<img src="${c}">`).join('')}</div>`).join('')}</div>
  <div class="veil"></div>
  <div class="wrap">
    <p class="kicker">${profile.name.toUpperCase()} · ${profile.role.toUpperCase()}</p>
    <h1>Hi, I'm Rao.<br>I break things in staging<br><em>so your users never have to.</em></h1>
    <div class="stack">${stack.map(([t, icon]) => `<span><img src="${dataUri(`public/tech/${icon}.svg`)}">${t}</span>`).join('')}</div>
    <p class="foot"><span class="web"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg><u>www.devraorizwan.online</u></span></p>
  </div>
  </body></html>`
const ogTab = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await ogTab.setContent(og, { waitUntil: 'load' })
await ogTab.evaluate(() => document.fonts.ready)
await ogTab.screenshot({ path: resolve('public/images/og.png'), type: 'png' })
console.log('[covers] og.png')

await browser.close()
