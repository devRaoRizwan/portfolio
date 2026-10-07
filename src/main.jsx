import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { profile } from './content'
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

// For the engineers who open devtools on a portfolio. Hi.
console.log(
  `%c${profile.name}%c\nYou opened devtools on a portfolio, so we probably think alike.\n` +
    `The source is plain React, prerendered at build time: ${profile.github}\n` +
    `Hiring for backend work? ${profile.email}`,
  'font: 600 16px Inter, sans-serif; color: #047857',
  'font: 13px/1.6 Inter, sans-serif; color: inherit'
)
