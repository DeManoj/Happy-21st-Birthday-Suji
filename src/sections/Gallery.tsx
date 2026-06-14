import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PhotoItem {
  src: string
  caption: string
  description: string
  entrance: string
  fromX: number
  fromY: number
  fromScale: number
  fromRotation: number
}

const entranceTypes = ['from-moon', 'from-deep', 'from-left', 'from-right', 'from-top', 'spiral-in', 'zoom-in', 'tilt-in', 'fold-in', 'shatter-in'] as const

const basePhotos = [
  { src: './images/img_1.png', caption: 'The Innocence in You', description: 'Your innocence is what I adore most. I know your capabilities, yet the purity in your eyes and face always captivates me. How can someone be this beautifully capable and innocent?' },
  { src: './images/img_2.jpeg', caption: 'Your True Beauty', description: 'Even with filters trying to enhance your beauty, only I have witnessed your authentic radiance. No filter compares to what I see.' },
  { src: './images/img_3.jpeg', caption: 'Us as a Couple', description: 'Being together has always been my dream, and one day I want us to wake up in each other\'s arms.' },
  { src: './images/img_4.png', caption: 'The First Bouquet', description: 'The first flowers I ever gave you — you deserved that bouquet, and a thousand more.' },
  { src: './images/img_5.png', caption: 'Golden Hour', description: 'You were fast asleep, and I could have watched you forever. That is the beauty of you.' },
  { src: './images/img_6.png', caption: 'Marrying You', description: 'To marry you in this custom would be my greatest blessing.' },
  { src: './images/img_7.png', caption: 'Perfect You', description: 'Perfect you, not me — just saying.' },
  { src: './images/img_8.png', caption: 'AI Cannot Capture This', description: 'AI tried but still cannot capture your true beauty that I see in you.' },
  { src: './images/img_9.png', caption: 'Silly Jokes', description: 'My silly jokes still make you laugh — I guess I have talent after all.' },
  { src: './images/img_10.png', caption: 'Prettier Every Day', description: 'You grow more beautiful in my eyes each day. Ugly isn\'t a word that exists in our dictionary.' },
]

function createPhotoData(): PhotoItem[] {
  return basePhotos.map((p, i) => {
    const entrance = entranceTypes[i % entranceTypes.length]
    let fromX = 0, fromY = 0, fromScale = 0.3, fromRotation = (i * 47) % 360 - 180

    switch (entrance) {
      case 'from-moon':
        fromX = 0
        fromY = -250
        fromScale = 0.1
        fromRotation = 180
        break
      case 'from-deep':
        fromX = 0
        fromY = 300
        fromScale = 0.08
        fromRotation = -120
        break
      case 'from-left':
        fromX = -600
        fromY = ((i * 37) % 60) - 30
        fromRotation = -30
        break
      case 'from-right':
        fromX = 600
        fromY = ((i * 53) % 60) - 30
        fromRotation = 30
        break
      case 'from-top':
        fromX = ((i * 41) % 40) - 20
        fromY = -400
        fromScale = 0.15
        break
      case 'spiral-in':
        fromX = Math.cos(i * 2.3) * 350
        fromY = Math.sin(i * 2.3) * 350
        fromScale = 0.05
        fromRotation = (i * 83) % 360
        break
      case 'zoom-in':
        fromX = Math.sin(i * 1.7) * 40
        fromY = Math.cos(i * 1.7) * 40
        fromScale = 3
        fromRotation = 0
        break
      case 'tilt-in':
        fromX = 0
        fromY = 200
        fromScale = 0.3
        fromRotation = 50
        break
      case 'fold-in':
        fromX = (i % 2 === 0) ? -400 : 400
        fromY = ((i * 29) % 50) - 25
        fromScale = 0.3
        fromRotation = (i % 2 === 0) ? -20 : 20
        break
      case 'shatter-in':
        fromX = Math.sin(i * 3.1) * 250
        fromY = Math.cos(i * 2.7) * 250
        fromScale = 0.03
        fromRotation = (i * 67) % 360 - 180
        break
    }

    return { ...p, entrance, fromX, fromY, fromScale, fromRotation }
  })
}

const photos = createPhotoData()

const scrollVhPerPhoto = 416
const entranceScroll = scrollVhPerPhoto * 0.25
const holdScroll = scrollVhPerPhoto * 0.50
const exitScroll = scrollVhPerPhoto * 0.25
const galleryEndBufferVh = 30
const totalScrollDistance = photos.length * scrollVhPerPhoto
const gallerySectionHeightVh = totalScrollDistance + galleryEndBufferVh + 100

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const moon = moonRef.current
    const title = titleRef.current
    if (!section || !moon || !title) return

    const cards = section.querySelectorAll<HTMLElement>('.gallery-card')

    // Moon breathes
    const moonAnimations = [
      gsap.to(moon, {
        scale: 1.12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }),
      gsap.to(moon, {
        x: 35,
        y: 25,
        rotation: 15,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }),
    ]

    // Title animation
    const titleAnimation = gsap.fromTo(
      title,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom+=50%',
          end: 'top center',
          scrub: 0,
        },
      }
    )

    // Master timeline for sequential animations
    const galleryTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0,
        invalidateOnRefresh: true,
      },
    })

    // Store references for cleanup
    const animations = [...moonAnimations, titleAnimation, galleryTl]

    // Animate each photo in sequence
    photos.forEach((photo, index) => {
      const card = cards[index]
      if (!card) return

      const slotStart = index * scrollVhPerPhoto
      const entranceEnd = slotStart + entranceScroll
      const holdEnd = entranceEnd + holdScroll
      const exitX = photo.fromX * 0.35
      const exitY = photo.fromY * 0.35 - 250

      // Set initial state - hidden at entrance position
      gsap.set(card, {
        x: photo.fromX,
        y: photo.fromY,
        scale: photo.fromScale,
        opacity: 0,
        rotation: photo.fromRotation,
      })

      // Animate in with scroll
      galleryTl.to(
        card,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: entranceScroll,
          ease: 'none',
        },
        slotStart
      )

      // Hold the photo at center with scroll
      galleryTl.to(
        card,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: holdScroll,
          ease: 'none',
        },
        entranceEnd
      )

      // Animate out with scroll
      galleryTl.to(
        card,
        {
          x: exitX,
          y: exitY,
          scale: 0.45,
          opacity: 0,
          rotation: photo.fromRotation * 0.5,
          duration: exitScroll,
          ease: 'none',
        },
        holdEnd
      )
    })

    return () => {
      animations.forEach(animation => {
        if (animation.kill) {
          animation.kill()
        }
      })
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{ 
        backgroundColor: 'transparent', 
        minHeight: `${gallerySectionHeightVh}vh`, 
        padding: '20px',
        zIndex: 5
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
      {/* Title */}
      <div
        ref={titleRef}
        className="text-center pt-16"
        style={{ zIndex: 10 }}
      >
        <h3
          className="font-cinzel text-3xl sm:text-4xl font-bold tracking-widest"
          style={{
            background: 'linear-gradient(135deg, #e8e8f0 0%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Memories Like Moonlight
        </h3>
        <p className="font-cormorant text-lg text-amber-300 italic mt-2">
          Forever captured in time
        </p>
      </div>

      {/* Moon */}
      <div
        ref={moonRef}
        className="absolute left-1/2 top-[22vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 0, width: '80px', height: '80px' }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)',
            filter: 'blur(24px)',
          }}
        />
        <div
          className="relative w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(220,200,170,0.9) 30%, rgba(212,175,55,0.5) 70%, transparent 100%)',
            boxShadow: '0 0 90px rgba(212,175,55,0.5), 0 0 180px rgba(212,175,55,0.25)',
          }}
        >
          <div className="absolute rounded-full" style={{ width: '28%', height: '28%', top: '22%', left: '18%', background: 'rgba(160,140,120,0.25)', filter: 'blur(10px)' }} />
          <div className="absolute rounded-full" style={{ width: '18%', height: '18%', top: '50%', left: '45%', background: 'rgba(170,150,130,0.2)', filter: 'blur(7px)' }} />
          <div className="absolute rounded-full" style={{ width: '14%', height: '14%', top: '32%', left: '58%', background: 'rgba(150,130,110,0.18)', filter: 'blur(5px)' }} />
        </div>
      </div>

      {/* Gallery cards - sticky and animated in sequence */}
      <div className="gallery-cards-container h-screen">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="gallery-card absolute inset-0 flex justify-center items-center"
            style={{ zIndex: 10 }}
          >
            {/* Polaroid-style card with image border */}
            <div
              className="relative bg-white"
              style={{
                boxShadow: '0 25px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)',
                maxWidth: '480px',
                width: '94%',
                padding: '8px 8px 0 8px',
              }}
            >
              {/* Image with white border */}
              <div
                className="relative bg-white"
                style={{
                  border: '3px solid #fff',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-auto object-contain mx-auto"
                  style={{
                    filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.15))',
                    maxHeight: '320px',
                  }}
                  loading="lazy"
                />
              </div>

              {/* Caption at bottom */}
              <div
                className="px-4 py-3 text-center"
                style={{
                  background: '#fffdf7',
                  borderTop: '1px solid rgba(212,175,55,0.12)',
                }}
              >
                <h4
                  className="font-cinzel text-sm sm:text-base font-semibold tracking-wider mb-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #8b6914 0%, #d4af37 50%, #d4af37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {photo.caption}
                </h4>
                <p className="font-cormorant text-xs sm:text-sm text-stone-500 italic leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}