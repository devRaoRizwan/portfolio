// Renders every project cover from one template so the Projects grid reads as
// a set, plus the site's social preview (og.png) in the same fonts. Output is 1400x612 (the card's 16:7 frame); everything that matters
// sits in the top 500px because phones crop the card to 16:6 from the top.
//
// Run: npm i --no-save playwright && node scripts/covers/render.mjs
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

const page = (c) => {
  const logo = dataUri(c.logo)
  return `<!doctype html><html><head><style>
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${inter}) format('woff2'); }
  @font-face { font-family: Mono; font-weight: 400 500; src: url(${mono}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden; position: relative;
    font-family: Inter, sans-serif; color: #fff;
    background:
      radial-gradient(900px 520px at 88% 30%, ${c.glow}66, transparent 70%),
      radial-gradient(700px 420px at 0% 0%, ${c.glow}33, transparent 70%),
      #0b0d12;
  }
  body::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, #000 40%, transparent 100%);
  }
  .wrap { position: absolute; inset: 88px 80px auto 80px; }
  .hero img { width: 100%; height: 100%; display: block; }
  h1 { font-size: 66px; line-height: 1.04; font-weight: 700; letter-spacing: -0.035em; max-width: 780px; }
  h1 em { font-style: normal; color: ${c.accent}; }
  p { margin-top: 26px; max-width: 640px; font-size: 22px; line-height: 1.45; color: rgba(255,255,255,0.7); }
  .foot { position: absolute; left: 80px; right: 80px; top: 440px; display: flex; align-items: center; justify-content: space-between; }
  .chips { display: flex; gap: 12px; }
  .chip {
    font-size: 18px; font-weight: 600; color: ${c.accent};
    padding: 10px 18px; border-radius: 999px;
    border: 1px solid ${c.accent}55; background: ${c.accent}14;
  }
  .domain { font-family: Mono, monospace; font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.85); }
  .hero {
    position: absolute; right: 120px; top: 100px; width: 270px; height: 270px;
    border-radius: 64px; overflow: hidden;
    box-shadow: 0 30px 80px -20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.08);
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

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const tab = await browser.newPage({ viewport: { width: W, height: H } })
for (const c of covers) {
  await tab.setContent(page(c), { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  const png = await tab.screenshot({ type: 'png' })

  // Playwright only writes PNG or JPEG, so let Chromium re-encode as WebP.
  const webp = await tab.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    const canvas = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height })
    canvas.getContext('2d').drawImage(img, 0, 0)
    return canvas.toDataURL('image/webp', 0.86).split(',')[1]
  }, `data:image/png;base64,${png.toString('base64')}`)

  writeFileSync(resolve(OUT, `${c.slug}.webp`), Buffer.from(webp, 'base64'))
  console.log(`[covers] ${c.slug}.webp`)
}

// Social preview: the light look of the site itself, 1200x630 PNG.
const { profile } = await import('../../src/content.js')
const photo = dataUri('public/images/rao.webp')
const og = `<!doctype html><html><head><style>
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${inter}) format('woff2'); }
  @font-face { font-family: Mono; font-weight: 400 500; src: url(${mono}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    font-family: Inter, sans-serif; color: #0a0a0a;
    background:
      radial-gradient(640px 480px at 10% 0%, #c9c9d1, transparent 70%),
      radial-gradient(560px 460px at 100% 30%, #bcbcc6, transparent 70%),
      radial-gradient(600px 400px at 40% 110%, #d6d6de, transparent 70%),
      #f4f4f7;
  }
  .wrap { position: absolute; left: 84px; top: 170px; width: 640px; }
  h1 { font-size: 92px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
  .role { margin-top: 18px; font-family: Mono, monospace; font-size: 28px; color: #565656; }
  .stack { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 10px; }
  .stack span {
    font-family: Mono, monospace; font-size: 20px; color: #3a3a3a; padding: 8px 14px; border-radius: 12px;
    background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 1px 2px rgba(10,10,10,0.06);
  }
  .domain { position: absolute; left: 84px; bottom: 64px; font-family: Mono, monospace; font-size: 22px; font-weight: 500; }
  .photo {
    position: absolute; right: 96px; top: 150px; width: 320px; height: 320px; border-radius: 50%; overflow: hidden;
    border: 6px solid rgba(255,255,255,0.9); box-shadow: 0 30px 60px -20px rgba(10,10,10,0.35);
  }
  .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  </style></head><body>
  <div class="wrap">
    <h1>${profile.name}</h1>
    <p class="role">${profile.role}</p>
    <div class="stack">${profile.coreStack.map((t) => `<span>${t}</span>`).join('')}</div>
  </div>
  <div class="photo"><img src="${photo}"></div>
  <span class="domain">devraorizwan.online</span>
  </body></html>`
const ogTab = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await ogTab.setContent(og, { waitUntil: 'load' })
await ogTab.evaluate(() => document.fonts.ready)
await ogTab.screenshot({ path: resolve('public/images/og.png'), type: 'png' })
console.log('[covers] og.png')

await browser.close()
