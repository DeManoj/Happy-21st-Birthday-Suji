import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LoveLetter() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const letter = letterRef.current
    const text = textRef.current
    const signature = signatureRef.current
    if (!section || !letter || !text || !signature) return

    // Letter envelope reveal
    gsap.fromTo(
      letter,
      {
        y: 100,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top center',
          scrub: true,
        },
      }
    )

    // Text lines reveal with stagger
    const lines = text.querySelectorAll('.letter-line')
    lines.forEach((line, i) => {
      gsap.fromTo(
        line,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: `top ${50 - i * 5}%`,
            end: `top ${30 - i * 5}%`,
            scrub: true,
          },
        }
      )
    })

    // Signature fade in
    gsap.fromTo(
      signature,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 40%',
          end: 'top 20%',
          scrub: true,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-32 px-4"
      style={{ zIndex: 30, minHeight: '100vh' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Letter card */}
        <div
          ref={letterRef}
          className="relative p-8 sm:p-12 md:p-16 rounded-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            boxShadow: '0 0 60px rgba(212, 175, 55, 0.05), inset 0 0 60px rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-amber-300/20" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-amber-300/20" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-amber-300/20" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-amber-300/20" />

             {/* To line */}
           <div className="mb-8">
             <span className="font-cormorant text-lg text-amber-300/60 italic">
               To my dearest Suji,
             </span>
           </div>

           {/* Letter body */}
           <div ref={textRef} className="space-y-4 mb-10">
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               Happy Birthday, My Love Suji ❤️
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               Today is all about celebrating you — the beautiful soul who has brought so much happiness, warmth, and meaning into my life. If there is one thing I am grateful for every single day, it is you. You are truly the best thing that has ever happened to me, and no matter how many years pass, I will never stop being thankful that I got the chance to know, love, and cherish someone as wonderful as you.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               As you turn 21, I cannot wait to see all the happiness, adventures, opportunities, and beautiful memories that this year brings into your life. You deserve every good thing this world has to offer. More than anything, I hope I get to witness your journey, celebrate your victories, laugh at your silly moments, and create countless memories alongside you.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               You mean so much more to me than you probably realize. Every time I spend time with you, my heart feels lighter and happier. No matter how busy life gets, I always find myself searching for more moments with you, because every moment with you feels special. Whether we are laughing together, talking about random things, sharing dreams about the future, or simply enjoying each other's company, those moments become some of my favorite memories.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               What I love most about us is that happiness feels so natural when I am with you. You make ordinary days feel extraordinary. Your smile brightens my mood, your voice comforts me, and your presence makes everything feel a little better. You have become such an important part of my life that imagining my happiest memories without you feels impossible.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               You are not just someone I love — you are my comfort, my happiness, my favorite person, and the one who makes my heart feel at home. You mean the world to me, Suji. In fact, you are a huge part of the world I dream about. Every beautiful future I imagine somehow has you in it.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               I don't know what fate has planned for us, but I do know this: I want to cherish every moment I get with you. Every conversation, every laugh, every memory, every little adventure. Because loving you has been one of the happiest experiences of my life, and I never want to take that for granted.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               On your 21st birthday, my wish for you is simple: may your life be filled with endless happiness, success, love, laughter, and beautiful adventures. May all your dreams come true, and may you always have reasons to smile the way you make me smile.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               Thank you for being you. Thank you for bringing so much joy into my life. Thank you for every memory we've shared and every memory we have yet to create.
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               Happy Birthday, my love. ❤️
             </p>
             <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
               I love you today, tomorrow, and for all the days to come. Forever and ever. ❤️✨🎂🎉
             </p>
           </div>

          {/* Letter body */}
          <div ref={textRef} className="space-y-4 mb-10">
            <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
              On this day, twenty-one years ago, the universe decided to create something magical. 
              It gathered stardust from distant galaxies, borrowed light from a thousand suns, 
              and shaped it into the most beautiful soul I have ever known.
            </p>
            <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
              Every moment with you feels like catching moonbeams in a jar — 
              precious, luminous, and impossibly wonderful. 
              You are the poetry my heart has been trying to write my entire life.
            </p>
            <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
              As you step into this new chapter, know that you are loved beyond measure. 
              You are my moon in the darkest night, my compass when I am lost, 
              and my home in this vast, beautiful universe.
            </p>
            <p className="letter-line font-cormorant text-lg sm:text-xl text-white/80 leading-relaxed">
              Happy 21st birthday, my love. May your year be filled with the same 
              wonder and joy that you bring to everyone around you.
            </p>
          </div>

          {/* Signature */}
          <div ref={signatureRef} className="text-right">
            <p className="font-cormorant text-lg text-amber-300/60 italic mb-1">
              Forever yours,
            </p>
            <p className="font-cinzel text-xl text-amber-300/80 tracking-wider">
              Your Love
            </p>
          </div>

          {/* Wax seal decoration */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-300/60">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-20">
          <p className="font-cinzel text-sm text-white/30 tracking-[0.3em]">
            SCROLL BACK UP TO EXPLORE AGAIN
          </p>
        </div>
      </div>

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.9) 0%, transparent 70%)',
          zIndex: -1,
        }}
      />
    </div>
  )
}
