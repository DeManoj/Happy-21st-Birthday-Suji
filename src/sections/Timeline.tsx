import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Milestone {
  year: string
  title: string
  description: string
  side: 'left' | 'right'
}

const milestones: Milestone[] = [
  {
    year: 'November 26',
    title: 'Destined to Meet',
    description: 'A LinkedIn message changed everything. Two souls who needed each other, brought together as if fate had always planned it.',
    side: 'left',
  },
  {
    year: 'December 3',
    title: 'First Date — Pulchowki',
    description: 'The first hug, the cold wind against our faces, and resting in the sunlight on a bike seat. I held you close and knew I never wanted to let go.',
    side: 'right',
  },
  {
    year: 'December 13',
    title: 'Kulekhani Adventure',
    description: 'A one-and-a-half-hour journey turned into three — getting lost never felt so right. Your stories, your talks, every detail made me fall deeper and harder for you.',
    side: 'left',
  },
  {
    year: 'Sonam Loshar',
    title: 'A Moment at Home',
    description: 'You visited me on Sonam Loshar, and in that moment, I found everything I had been searching for. I still long for it — to hold you, to live it all over again.',
    side: 'right',
  },
  {
    year: 'Always',
    title: 'My Promise to You',
    description: 'You are my life. No matter how hard I try, I cannot stay away from you. I loved you from the first day, and I promise — my love will never change.',
    side: 'left',
  },
]

function TimelineItem({
  milestone,
}: {
  milestone: Milestone
}) {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    const fromX = milestone.side === 'left' ? -80 : 80

    gsap.fromTo(
      item,
      {
        x: fromX,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'top center',
          scrub: true,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === item) st.kill()
      })
    }
  }, [milestone.side])

  const isLeft = milestone.side === 'left'

  return (
    <div
      ref={itemRef}
      className={`relative flex items-center w-full mb-16 ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Content card */}
      <div
        className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}
      >
        <div className="relative group">
          <span
            className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold block mb-2"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #e8d5a3 50%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {milestone.year}
          </span>
          <h4 className="font-cormorant text-xl sm:text-2xl text-white/90 font-medium mb-2 italic">
            {milestone.title}
          </h4>
          <p className="font-inter text-sm sm:text-base text-white/50 leading-relaxed max-w-xs ml-auto mr-auto">
            {milestone.description}
          </p>

          {/* Decorative line */}
          <div
            className={`absolute top-1/2 ${
              isLeft ? '-right-8' : '-left-8'
            } w-8 h-px bg-gradient-to-r ${
              isLeft ? 'from-amber-300/40 to-transparent' : 'from-transparent to-amber-300/40'
            }`}
          />
        </div>
      </div>

      {/* Center dot */}
      <div className="w-2/12 flex justify-center">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-amber-300/80 shadow-lg shadow-amber-300/30" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-amber-300/40 animate-ping" />
        </div>
      </div>

      {/* Empty space for the other side */}
      <div className="w-5/12" />
    </div>
  )
}

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-32 px-4"
      style={{ zIndex: 30 }}
    >
      {/* Section header */}
      <div className="text-center mb-20">
        <h3
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-medium tracking-widest mb-4"
          style={{
            background: 'linear-gradient(135deg, #e8e8f0 0%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Our Journey
        </h3>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent mx-auto" />
      </div>

      {/* Timeline container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical line */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.4), transparent)',
            transformOrigin: 'top',
          }}
        />

        {/* Timeline items */}
        {milestones.map((milestone, i) => (
          <TimelineItem key={i} milestone={milestone} />
        ))}
      </div>

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.8) 0%, transparent 70%)',
          zIndex: -1,
        }}
      />
    </div>
  )
}
