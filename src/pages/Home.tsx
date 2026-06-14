import { useEffect, useRef, useState, useCallback } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MoonScene from '../sections/MoonScene'
import ShatteredText from '../sections/ShatteredText'
import Message from '../sections/Message'
import Gallery from '../sections/Gallery'
import Timeline from '../sections/Timeline'
import LoveLetter from '../sections/LoveLetter'
import LoadingScreen from '../sections/LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (isLoading) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after a moment
    setTimeout(() => {
      ScrollTrigger.refresh()
      setIsReady(true)
    }, 100)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isLoading])

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Custom cursor effect
  useEffect(() => {
    if (isLoading) return

    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    cursor.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(212, 175, 55, 0.6);
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.15s ease-out, opacity 0.3s ease;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(cursor)

    const cursorTrail = document.createElement('div')
    cursorTrail.className = 'custom-cursor-trail'
    cursorTrail.style.cssText = `
      position: fixed;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid rgba(212, 175, 55, 0.2);
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.4s ease-out, opacity 0.4s ease;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(cursorTrail)

    let mouseX = 0
    let mouseY = 0
    let trailX = 0
    let trailY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.1
      trailY += (mouseY - trailY) * 0.1
      cursorTrail.style.left = `${trailX}px`
      cursorTrail.style.top = `${trailY}px`
      requestAnimationFrame(animateTrail)
    }

    window.addEventListener('mousemove', handleMouseMove)
    const trailAnimation = requestAnimationFrame(animateTrail)

    // Hide cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      cursor.style.display = 'none'
      cursorTrail.style.display = 'none'
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(trailAnimation)
      cursor.remove()
      cursorTrail.remove()
    }
  }, [isLoading])

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main Content */}
      <div
        ref={scrollContainerRef}
        className="relative"
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* Fixed 3D Moon Background - always visible */}
        <MoonScene />

        {/* Scrollable content layers */}
        <div className="relative" style={{ zIndex: 20 }}>
          {/* Section 1: Shattered Hero Text */}
          <ShatteredText />

          {/* Spacer to allow scroll explosion to complete */}
          <div className="h-[20vh]" />

          {/* Section 2: Birthday Message */}
          <Message />

          {/* Spacer so the gallery starts after the birthday message */}
          <div className="h-[80vh]" aria-hidden="true" />

          {/* Section 3: Memory Gallery */}
          <Gallery />

          {/* Section 4: Timeline */}
          <Timeline />

          {/* Section 5: Love Letter */}
          <LoveLetter />

          {/* Bottom spacer */}
          <div className="h-[30vh]" />
        </div>

        {/* Global gradient overlay for depth */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(5,5,8,0.4) 100%)',
            zIndex: 15,
          }}
        />
      </div>
    </>
  )
}
