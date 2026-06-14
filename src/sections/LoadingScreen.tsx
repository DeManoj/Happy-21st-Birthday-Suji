import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const dot = dotRef.current
    const text = textRef.current
    if (!container || !dot || !text) return

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Pulsing dot animation
    gsap.to(dot, {
      scale: 1.5,
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // Exit animation after delay
    const exitTimer = setTimeout(() => {
      const tl = gsap.timeline()

      tl.to(dot, {
        scale: 50,
        opacity: 1,
        duration: 1,
        ease: 'power3.inOut',
      })
        .to(
          container,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              onComplete()
            },
          },
          '-=0.3'
        )
    }, 2500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: '#050508',
        zIndex: 1000,
      }}
    >
      {/* Pulsing dot */}
      <div
        ref={dotRef}
        className="w-4 h-4 rounded-full mb-8"
        style={{
          background: 'radial-gradient(circle, #e8e8f0 0%, rgba(232, 232, 240, 0.5) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(232, 232, 240, 0.3)',
        }}
      />

      {/* Loading text */}
      <p
        ref={textRef}
        className="font-cinzel text-xs tracking-[0.4em] text-white/40 uppercase"
      >
        Entering Manina&apos;s Universe
      </p>

      {/* Progress bar */}
      <div className="mt-6 w-32 h-px bg-white/10 overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)',
          }}
        />
      </div>

      {/* Subtle stars in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
