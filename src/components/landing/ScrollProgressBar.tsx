'use client'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  if (reduced) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-[#D4A843] transition-none origin-left"
        style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
      />
    </div>
  )
}
