# Rao Rizwan Portfolio

Personal portfolio for Rao Rizwan, a backend engineer working with Python,
Django, REST APIs, Celery, PostgreSQL, and cloud infrastructure.

**Live site:** [devraorizwan.online](https://devraorizwan.online)

## Built With

- React 18
- Vite 6
- Tailwind CSS v4
- Vercel

No icon library, no animation library, no UI kit. Icons are inline SVG or brand
marks served from `public/tech`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Available Commands

```bash
npm run dev      # Start the development server
npm run build    # Production build, then prerender to static HTML
npm run preview  # Serve the production build
```

## Project Structure

```text
public/       Images, logos, tech icons, fonts, and the resume PDF
private/      Local source files, ignored by Git
src/          React components, styles, and portfolio content
prerender.js  Injects server rendered HTML into dist/index.html
index.html    SEO metadata and application entry point
vercel.json   Headers, caching, and SPA rewrites
```

## Updating Content

Everything readable on the page lives in [`src/content.js`](src/content.js) as
plain data. Adding a project means adding an object to an array; no component
needs opening.

| Export | Drives |
|---|---|
| `profile` | Name, role, bio, core stack, email, links, photo |
| `work` | Experience cards, each with a prose summary and a diagram |
| `projects` | Project cards, each with a cover, a stack list and a diagram |
| `toolbelt` | The Stack grid |
| `aitools` | The AI tools grid |
| `background` | Education and community |

Images and other public assets belong in `public/`:

```text
public/images/example.webp -> /images/example.webp
```

## Prerendering

The build renders the app to static HTML and injects it into `dist/index.html`,
so the served page contains real content instead of an empty `<div id="root">`.
This matters for search engines and for first paint on slow connections.

```text
vite build                          client bundle
vite build --ssr src/entry-server   server bundle
node prerender.js                   inject HTML, delete the server bundle
```

Two consequences worth knowing:

1. **The build runs your components.** A runtime error fails the build instead
   of reaching a visitor's browser.
2. **Anything that must be visible without JavaScript cannot depend on an
   effect.** Scroll reveals check element position directly rather than waiting
   on `IntersectionObserver`, otherwise hydrated markup stays at `opacity: 0`.

## Diagrams

Each role and project carries a `diagram` object rendered by
[`src/components/Diagram.jsx`](src/components/Diagram.jsx). Two shapes:

- **`flow`** — labelled lanes of nodes running left to right
- **`split`** — sources converging into a chain, then fanning back out

A node looks like this:

```js
{ icon: 'ui:server', label: 'DRF API', sub: 'Validate, enqueue' }
```

`tech:` icons resolve to brand marks in `public/tech`. `ui:` icons are drawn
inline in `Diagram.jsx`.

Diagrams use **container queries**, so they lay themselves out according to the
card they sit in rather than the viewport width. On phones the nodes are hidden
and only the summary line shows, which keeps the mobile page from tripling in
length.

**One diagram, one icon style.** The experience diagrams use `ui:` throughout;
the JobHarvester diagram uses `tech:` throughout.

## Glass

`.glass`, `.glass-inset` and `.glass-chip` in `src/index.css` are the three
surface weights. The page is white with black text, so the effect comes from
light rather than colour: a sheen raking across each panel, a rim light on every
edge, and layered shadows underneath.

This depends on the panels being genuinely transparent, which depends on the
grey fields behind them (`.mesh` in `src/App.jsx`). **If you lighten those
fields, the glass flattens into plain white boxes.** They are load bearing.

The fields stop animating below `lg` — four blurred layers moving forever is
real battery cost on a phone.

## Accessibility

- Skip link, visible focus rings, keyboard navigable
- `prefers-reduced-motion` stops the drifting fields, the reveals, and the
  counters
- Every text colour clears 4.5:1 contrast against the glass
- Printing strips the glass, the fields and the navigation

## Deployment

Import the repository into Vercel and use the defaults:

1. Build command `npm run build`
2. Output directory `dist`

`vercel.json` sets immutable caching on hashed assets, security headers, and a
rewrite so unknown paths serve the page instead of a 404.

## Notes

- Fonts are self-hosted in `public/fonts` as variable woff2 files, so there is
  no third party request in the critical path.
- Analytics is `@vercel/analytics`, which is cookieless and only reports once
  deployed to Vercel.
- Private source files and local environment files are excluded through
  `.gitignore`. No API keys or environment variables are required.
