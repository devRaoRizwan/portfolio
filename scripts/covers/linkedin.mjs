// Renders the LinkedIn profile banner (1584x396, at 2x for a sharp upload) in
// the site's light look, with the project covers as a tilted wall behind it.
// LinkedIn puts the profile photo over the bottom-left corner, so the text
// starts at ~420px and the banner carries no photo of its own.
//
// Run: npm i --no-save playwright && node scripts/covers/linkedin.mjs
import { readFileSync } from 'node:fs'
import { resolve, extname } from 'node:path'
import { chromium } from 'playwright'
import { profile } from '../../src/content.js'

const W = 1584
const H = 396

const MIME = { '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' }
const dataUri = (path) => `data:${MIME[extname(path)]};base64,${readFileSync(resolve(path)).toString('base64')}`
const inter = dataUri('public/fonts/inter.woff2')
const mono = dataUri('public/fonts/jetbrains-mono.woff2')
const slugs = ['bomwatcher', 'sitescopia', 'jobharvester', 'jobbr']
const covers = slugs.map((s) => dataUri(`public/images/covers/${s}-800.webp`))
// Offset each column so the wall doesn't read as a plain grid.
const columns = [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => covers[(i + j) % covers.length]))
const stack = [['Python', 'python'], ['Flask', 'flask'], ['FastAPI', 'fastapi'], ['Django', 'django'], ['MongoDB', 'mongodb'], ['AWS', 'amazonwebservices']]
const tech = stack.map(([, t]) => t).map((t) => dataUri(`public/tech/${t}.svg`))

const html = `<!doctype html><html><head><style>
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${inter}) format('woff2'); }
  @font-face { font-family: Mono; font-weight: 400 500; src: url(${mono}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden; position: relative;
    font-family: Inter, sans-serif; color: #0a0a0a;
    background:
      radial-gradient(620px 360px at 8% 0%, #d4d4dc, transparent 70%),
      radial-gradient(500px 300px at 40% 120%, #dcdce3, transparent 70%),
      #f4f4f7;
  }
  body::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to right, transparent 0%, #000 25%, #000 55%, transparent 75%);
  }

  /* Tilted wall of covers, fading out toward the text. */
  .wall {
    position: absolute; left: 1000px; top: -220px; width: 1000px; height: 840px;
    display: flex; gap: 18px;
    transform: perspective(1600px) rotateX(18deg) rotateY(-22deg) rotateZ(12deg);
    mask-image: linear-gradient(to right, transparent 0%, #000 30%);
  }
  .col { display: flex; flex-direction: column; gap: 18px; width: 300px; flex: none; }
  .col:nth-child(even) { margin-top: -70px; }
  .col img {
    width: 100%; display: block; border-radius: 14px;
    box-shadow: 0 20px 40px -18px rgba(10,10,10,0.5), 0 0 0 1px rgba(10,10,10,0.06);
  }
  .veil {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(90deg, #f4f4f7 0%, #f4f4f7 60%, rgba(244,244,247,0.8) 66%, rgba(244,244,247,0) 78%);
  }

  .wrap { position: absolute; left: 430px; top: 50%; transform: translateY(-50%); width: 760px; }
  .kicker { font-family: Mono, monospace; font-size: 16px; font-weight: 500; color: #565656; letter-spacing: 0.04em; }
  h1 { margin-top: 16px; font-size: 40px; white-space: nowrap; line-height: 1.04; font-weight: 700; letter-spacing: -0.04em; }
  h1 em { font-style: normal; color: #7a7a85; }
  .stack { margin-top: 22px; display: flex; gap: 8px; }
  .stack span {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: Mono, monospace; font-size: 14px; color: #3a3a3a; padding: 6px 11px 6px 8px; border-radius: 10px;
    background: rgba(255,255,255,0.85); border: 1px solid #fff; box-shadow: 0 1px 2px rgba(10,10,10,0.08);
  }
  .stack img { width: 18px; height: 18px; }
  .foot { margin-top: 20px; white-space: nowrap; font-family: Mono, monospace; font-size: 17px; color: #565656; }
  .web { display: inline-flex; align-items: center; gap: 9px; font-weight: 500; color: #1d4ed8; }
  .web svg { width: 19px; height: 19px; }
  .web u { text-decoration-thickness: 1.5px; text-underline-offset: 4px; text-decoration-color: rgba(29,78,216,0.4); }
  </style></head><body>
  <div class="wall">${columns.map((col) => `<div class="col">${col.map((c) => `<img src="${c}">`).join('')}</div>`).join('')}</div>
  <div class="veil"></div>
  <div class="wrap">
    <p class="kicker">${profile.role.toUpperCase()} · ${profile.location.toUpperCase()}</p>
    <h1>Hi, I'm Rao. I break things in staging<br><em>so your users never have to.</em></h1>
    <div class="stack">${stack.map(([t], i) => `<span><img src="${tech[i]}">${t}</span>`).join('')}</div>
    <p class="foot"><span class="web"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg><u>www.devraorizwan.online</u></span></p>
  </div>
  </body></html>`

const browser = await chromium.launch()
const tab = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await tab.setContent(html, { waitUntil: 'load' })
await tab.evaluate(() => document.fonts.ready)
await tab.screenshot({ path: resolve('public/images/linkedin-banner.png'), type: 'png' })
console.log('[covers] linkedin-banner.png')
await browser.close()
