import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

const getAssetUrl = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${p}`

const moonColorUrl = getAssetUrl('/images/moon_color.jpg')
const moonDisplacementUrl = getAssetUrl('/images/moon_displacement.jpg')

// Fresnel glow shader for the moon's rim lighting
const MoonMaterial = () => {
  const colorMap = useLoader(THREE.TextureLoader, moonColorUrl)
  const displacementMap = useLoader(THREE.TextureLoader, moonDisplacementUrl)

  const uniforms = useMemo(
    () => ({
      uTexture: { value: colorMap },
      uDisplacement: { value: displacementMap },
      uSunDirection: { value: new THREE.Vector3(1, 0.3, 0.5).normalize() },
      uTime: { value: 0 },
    }),
    [colorMap, displacementMap]
  )

  const vertexShader = `
    uniform sampler2D uDisplacement;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      float displacement = texture2D(uDisplacement, uv).r * 0.15;
      vDisplacement = displacement;
      
      vec3 newPosition = position + normal * displacement;
      vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec3 uSunDirection;
    uniform float uTime;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    void main() {
      vec3 color = texture2D(uTexture, vUv).rgb;
      
      // Lighting calculation
      vec3 normal = normalize(vNormal);
      float lightIntensity = dot(normal, uSunDirection);
      lightIntensity = smoothstep(-0.2, 1.0, lightIntensity);
      
      // Shadow color (dark side of moon)
      vec3 shadowColor = color * 0.05;
      
      // Lit color
      vec3 litColor = color * (0.3 + 0.7 * lightIntensity);
      
      // Fresnel rim glow
      vec3 viewDirection = normalize(-vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, normal), 3.0);
      vec3 fresnelColor = vec3(0.85, 0.75, 0.5) * fresnel * 0.6;
      
      // Subtle atmosphere glow on the lit edge
      float atmosphereGlow = pow(max(0.0, dot(viewDirection, uSunDirection)), 2.0) * fresnel;
      vec3 atmosphereColor = vec3(0.9, 0.8, 0.5) * atmosphereGlow * 0.3;
      
      vec3 finalColor = mix(shadowColor, litColor, lightIntensity) + fresnelColor + atmosphereColor;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
    />
  )
}

// The Moon mesh
function Moon() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      // Very slow rotation
      meshRef.current.rotation.y += 0.0005
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 128, 128]} />
      <MoonMaterial />
    </mesh>
  )
}

// Ambient star particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 500

  const { geometry, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
      vel[i * 3] = (Math.random() - 0.5) * 0.001
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.001
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geometry: geo, velocities: vel }
  }, [])

  useFrame(() => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        posArray[i * 3] += velocities[i * 3]
        posArray[i * 3 + 1] += velocities[i * 3 + 1]
        posArray[i * 3 + 2] += velocities[i * 3 + 2]

        // Wrap around
        if (Math.abs(posArray[i * 3]) > 15) posArray[i * 3] *= -0.5
        if (Math.abs(posArray[i * 3 + 1]) > 15) posArray[i * 3 + 1] *= -0.5
        if (Math.abs(posArray[i * 3 + 2]) > 15) posArray[i * 3 + 2] *= -0.5
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#e8e8f0"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Scene content
function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight position={[5, 2, 3]} intensity={0.8} />
      <Moon />
      <FloatingParticles />
      <Stars
        radius={50}
        depth={80}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  )
}

// Main exported component
export default function MoonScene() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          background: '#050508',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
