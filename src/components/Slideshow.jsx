import { useEffect, useRef, useState } from 'react'

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Screenshots of a project. A native scroll-snap strip, so it swipes on phones
// and arrow keys scroll it.
//
// With `autoplay` (ms) it moves on by itself, even under the mouse. It holds
// still only while a keyboard user has focus in it, while the tab is hidden, and
// always for people who ask for reduced motion. The dots and swiping are the
// only manual controls; using them restarts the timer.
export default function Slideshow({ slides, label, autoplay = 0 }) {
  const strip = useRef(null)
  const [index, setIndex] = useState(0)
  const [canPlay, setCanPlay] = useState(false)
  // Bumped on every manual step, so the timer restarts instead of jumping right after a click.
  const [touched, setTouched] = useState(0)
  const indexRef = useRef(0)
  const holding = useRef(false)
  // Focus that follows a click or tap is not a keyboard user, so it must not hold the timer.
  const pointedAt = useRef(0)

  const go = (to) => {
    const node = strip.current
    if (!node) return
    const next = (to + slides.length) % slides.length
    node.scrollTo({ left: next * node.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' })
    indexRef.current = next
    setIndex(next)
  }

  const step = (to) => {
    go(to)
    setTouched((n) => n + 1)
  }

  const onScroll = () => {
    const node = strip.current
    if (!node) return
    indexRef.current = Math.round(node.scrollLeft / node.clientWidth)
    setIndex(indexRef.current)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(index - 1) }
  }

  // Decided after hydration, so the prerendered markup never depends on it.
  useEffect(() => {
    setCanPlay(autoplay > 0 && slides.length > 1 && !reducedMotion())
  }, [autoplay, slides.length])

  useEffect(() => {
    if (!canPlay) return
    const timer = setInterval(() => {
      if (holding.current || document.hidden) return
      go(indexRef.current + 1)
    }, autoplay)
    return () => clearInterval(timer)
  }, [canPlay, autoplay, touched])

  return (
    <div
      className="relative bg-[#0e0e13]"
      onFocus={(e) => {
        holding.current = Date.now() - pointedAt.current > 500 && e.target.matches(':focus-visible')
      }}
      onBlur={() => {
        holding.current = false
      }}
      onPointerDown={() => {
        pointedAt.current = Date.now()
        setTouched((n) => n + 1)
      }}
    >
      <div
        ref={strip}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="flex aspect-[1908/926] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            srcSet={slide.srcSet}
            sizes="(min-width: 1100px) 1100px, 100vw"
            alt={slide.alt}
            aria-label={`${i + 1} of ${slides.length}`}
            width={slide.width}
            height={slide.height}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full flex-none snap-start object-contain"
          />
        ))}
      </div>

      {slides.length > 1 && (
        // Phones put the dots under the image so they never cover a small screenshot;
        // wider screens float them on a dark pill, readable on light screenshots too.
        <div className="flex justify-center py-2 sm:absolute sm:bottom-3 sm:left-1/2 sm:-translate-x-1/2 sm:py-0">
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 sm:gap-1.5 sm:rounded-full sm:bg-black/45 sm:backdrop-blur-sm">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => step(i)}
                aria-label={`Screenshot ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                // The visible dot is tiny; the ::after gives it a finger-sized hit area.
                className={`relative h-1.5 rounded-full transition-all after:absolute after:-inset-2.5 after:content-[''] ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
