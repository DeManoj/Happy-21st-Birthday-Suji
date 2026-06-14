import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Message() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const sub = subRef.current
    const decor = decorRef.current
    if (!section || !heading || !sub || !decor) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    })

    tl.fromTo(
      heading,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out', duration: 1 }
    )
    tl.fromTo(
      sub,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out', duration: 1 },
      0.3
    )
    tl.fromTo(
      decor,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, ease: 'power2.out', duration: 0.8 },
      0.5
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center py-32"
      style={{ zIndex: 30, minHeight: '80vh' }}
    >
      <div className="text-center px-4 max-w-3xl mx-auto">
        <div
          ref={decorRef}
          className="w-24 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent mx-auto mb-8"
          style={{ transformOrigin: 'center' }}
        />
        <h2
          ref={headingRef}
          className="font-cinzel text-4xl sm:text-5xl md:text-7xl font-semibold mb-6 glow-gold"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #e8d5a3 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.08em',
          }}
        >
          Happy Birthday Suji
        </h2>
        <p
          ref={subRef}
          className="font-cormorant text-xl sm:text-2xl md:text-3xl text-white/70 italic tracking-wide"
        >
          21 Years of Light
        </p>
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-amber-300/40"
            >
              <path
                d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Background gradient fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.7) 0%, transparent 70%)',
          zIndex: -1,
        }}
      />
    </div>
  )
}
