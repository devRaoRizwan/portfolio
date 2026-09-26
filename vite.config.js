import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `vite preview` falls back to the home page for unknown paths. Serve each
// prerendered page from its own folder, as the Vercel rewrites do in production.
const prerenderedPages = {
  name: 'prerendered-pages',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && /^\/projects\/[\w-]+\/?(\?.*)?$/.test(req.url)) {
        const [path, query = ''] = req.url.split('?')
        req.url = `${path.replace(/\/$/, '')}/index.html${query ? `?${query}` : ''}`
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderedPages],
})
