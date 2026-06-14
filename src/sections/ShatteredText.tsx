import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LetterData {
  char: string
  x: number
  y: number
  rotation: number
  opacity: number
  scale: number
  id: number
}

export default function ShatteredText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])

  // Generate scattered letter positions
  const letters = useMemo(() => {
    const words = ['HAPPY', 'BIRTHDAY', 'LUNA', '21']
    const allLetters: LetterData[] = []
    let id = 0

    words.forEach((word, wordIndex) => {
      const chars = word.split('')
      chars.forEach((char, charIndex) => {
        // Create a scattered but aesthetically pleasing layout
        // Words are roughly positioned in quadrants but with randomness
        const baseX = 20 + (wordIndex % 2) * 40 + charIndex * 6
        const baseY = 25 + Math.floor(wordIndex / 2) * 30

        // Add randomness
        const randomX = (Math.random() - 0.5) * 30
        const randomY = (Math.random() - 0.5) * 20
        const rotation = (Math.random() - 0.5) * 30 // -15 to 15 degrees

        allLetters.push({
          char,
          x: Math.max(5, Math.min(85, baseX + randomX)),
          y: Math.max(10, Math.min(80, baseY + randomY)),
          rotation,
          opacity: 0.4 + Math.random() * 0.5,
          scale: 0.8 + Math.random() * 0.5,
          id: id++,
        })
      })
    })

    return allLetters
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const letterEls = lettersRef.current.filter(Boolean) as HTMLSpanElement[]

    // Entrance animation - letters pop in with elastic effect
    const entranceTl = gsap.timeline()
    entranceTl.fromTo(
      letterEls,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: (i) => letters[i].scale,
        opacity: (i) => letters[i].opacity,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        stagger: {
          amount: 0.8,
          from: 'center',
        },
      }
    )

    // Scroll-driven explosion animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=1000',
        scrub: true,
        pin: true,
      },
    })

    // Calculate explosion vectors - push letters away from center
    letterEls.forEach((el, i) => {
      const letter = letters[i]
      const centerX = 50
      const centerY = 50
      const dx = letter.x - centerX
      const dy = letter.y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy) || 1

      // Explosion vector - push outward
      const explodeX = (dx / dist) * 60
      const explodeY = (dy / dist) * 60
      const extraRotation = (Math.random() - 0.5) * 90

      scrollTl.to(
        el,
        {
          x: explodeX + 'vw',
          y: explodeY + 'vh',
          rotation: letter.rotation + extraRotation,
          opacity: 0,
          scale: letter.scale * 2,
          ease: 'none',
          duration: 1,
        },
        0
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
      entranceTl.kill()
      scrollTl.kill()
    }
  }, [letters])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 20, background: 'transparent' }}
    >
      {letters.map((letter, i) => (
        <span
          key={letter.id}
          ref={(el) => { lettersRef.current[i] = el }}
          className="absolute font-cinzel font-bold text-white select-none"
          style={{
            left: `${letter.x}%`,
            top: `${letter.y}%`,
            transform: `translate(-50%, -50%) rotate(${letter.rotation}deg) scale(0)`,
            opacity: 0,
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)',
            letterSpacing: '0.15em',
            willChange: 'transform, opacity',
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  )
}
