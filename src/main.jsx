import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Prerendered HTML is hydrated; a bare shell is mounted fresh.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}

// Marks the page while it scrolls so the background mesh can pause (see index.css).
let scrollTimer
window.addEventListener(
  'scroll',
  () => {
    document.documentElement.classList.add('scrolling')
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => document.documentElement.classList.remove('scrolling'), 150)
  },
  { passive: true }
)
