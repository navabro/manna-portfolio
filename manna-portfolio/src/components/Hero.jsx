import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// --- OPTIMIZED GEOMETRIES & MATERIALS (Shared) ---
const petalGeo = new THREE.PlaneGeometry(0.1, 0.07)
const petalMat = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8,
})

const branchMat = new THREE.MeshLambertMaterial({ color: '#2d1a1a' })
const blossomGeo = new THREE.SphereGeometry(0.12, 6, 6)
const blossomMat = new THREE.MeshLambertMaterial({ color: '#ffd6e7' })

// --- THREE.JS COMPONENTS ---

function Petals({ count = 20, scrollProgress }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colors = useMemo(() => ['#ffd6e7', '#ffe4f0', '#ffffff'].map(c => new THREE.Color(c)), [])

  const petalData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 10, Math.random() * 10 - 5, (Math.random() - 0.5) * 5),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      speed: Math.random() * 0.008 + 0.004,
      rotSpeed: [Math.random() * 0.015, Math.random() * 0.015, Math.random() * 0.015],
      phase: Math.random() * Math.PI * 2
    }))
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const scroll = scrollProgress.get()
    
    petalData.forEach((petal, i) => {
      // Drift down + scroll reaction
      petal.position.y -= petal.speed * (1 + scroll * 1.2)
      petal.position.x += Math.sin(time + petal.phase) * 0.0015

      if (petal.position.y < -5) {
        petal.position.y = 5
        petal.position.x = (Math.random() - 0.5) * 10
      }

      petal.rotation.x += petal.rotSpeed[0]
      petal.rotation.y += petal.rotSpeed[1]
      petal.rotation.z += petal.rotSpeed[2]

      dummy.position.copy(petal.position)
      dummy.rotation.copy(petal.rotation)
      dummy.scale.setScalar(0.5 + Math.sin(time * 0.4 + petal.phase) * 0.08)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, colors[i % colors.length])
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[petalGeo, petalMat, count]} />
  )
}

const Branch = () => {
  const blossomPositions = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => [
      (Math.random() - 0.5) * 2 + (i % 2 === 0 ? 0.7 : -0.4),
      Math.random() * 1.8 + 0.6,
      (Math.random() - 0.5) * 0.8
    ]), []
  )

  return (
    <group rotation={[0.2, -0.4, 0.1]}>
      {/* Main Limb */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0.2]} geometry={new THREE.CylinderGeometry(0.07, 0.1, 4, 6)} material={branchMat} />
      
      {/* Side Branches */}
      <group position={[0.4, 0.4, 0]} rotation={[0, 0, -0.7]}>
        <mesh geometry={new THREE.CylinderGeometry(0.03, 0.06, 1.8, 6)} material={branchMat} />
      </group>
      <group position={[-0.3, 1.1, 0.2]} rotation={[0.2, 0, 1]}>
        <mesh geometry={new THREE.CylinderGeometry(0.02, 0.05, 1.4, 6)} material={branchMat} />
      </group>

      {/* Blossoms */}
      {blossomPositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={blossomGeo} material={blossomMat} />
      ))}
    </group>
  )
}

function HeroScene({ scrollProgress }) {
  const { camera, gl } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const groupRef = useRef()

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const progress = scrollProgress.get()

    // Smooth Camera Zoom (Lerp)
    const targetZ = 6 - progress * 2.5
    camera.position.z += (targetZ - camera.position.z) * 0.05

    // Smooth Mouse Parallax (Lerp)
    camera.position.x += (mouse.current.x * 0.25 - camera.position.x) * 0.03
    camera.position.y += (mouse.current.y * 0.25 - camera.position.y) * 0.03

    // Scene Sway & Scroll Tilt
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.04
      groupRef.current.rotation.x = progress * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} color="#ffe4f0" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Branch />
      <Petals count={20} scrollProgress={scrollProgress} />
    </group>
  )
}

// --- MAIN HERO COMPONENT ---

export default function Hero() {
  const [greeting, setGreeting] = useState({ mal: '', eng: '' })
  const containerRef = useRef(null)
  
  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const textY = useTransform(scrollY, [0, 300], [0, -50])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting({ mal: 'സുപ്രഭാതം മന്ന അമ്മായി 🌸', eng: 'Good Morning' })
    else if (hour >= 12 && hour < 17) setGreeting({ mal: 'ഉച്ചസ്നേഹം മന്ന അമ്മായി ☀️', eng: 'Good Afternoon' })
    else if (hour >= 17 && hour < 21) setGreeting({ mal: 'ശുഭ സന്ധ്യ മന്ന അമ്മായി 🌙', eng: 'Good Evening' })
    else setGreeting({ mal: 'ശുഭ രാത്രി മന്ന അമ്മായി 🌟', eng: 'Good Night' })

    // Optional: Pause animation when tab not visible
    const handleVisibilityChange = () => {
      // R3F handles this mostly, but we can emit a custom event if needed
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-[160vh] z-10">
      {/* Optimized Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-[70svh] md:h-screen overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{ 
            antialias: false, 
            alpha: true, 
            powerPreference: "high-performance" 
          }}
          dpr={Math.min(window.devicePixelRatio, 1.5)}
          onCreated={({ gl }) => {
            gl.setClearColor(0x1a0a14, 1)
          }}
        >
          <fogExp2 attach="fog" args={['#1a0a14', 0.04]} />
          <HeroScene scrollProgress={scrollYProgress} />
        </Canvas>
      </div>

      {/* Overlay UI (Scrolls with page) */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-x-0 top-0 h-screen pointer-events-none flex flex-col items-center justify-center px-6 z-20"
      >
        <div className="flex flex-col items-center text-center max-w-[800px] w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <p className="font-malayalam italic text-[0.9rem] md:text-[1.1rem] text-[var(--text-muted)] mb-1">
              {greeting.mal}
            </p>
            <p className="text-[0.8rem] uppercase tracking-widest text-[var(--pink-soft)]">
              {greeting.eng}
            </p>
          </motion.div>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-16 h-[1px] bg-[var(--pink-soft)] opacity-30 mb-8" 
          />

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="font-display font-[300] tracking-tight leading-none mb-6 text-[3rem] md:text-[6rem]"
          >
            <span className="text-[var(--pink-soft)]">Manna ✦</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-[0.8rem] md:text-[0.95rem] tracking-[0.2em] uppercase text-[var(--text-muted)]"
          >
            Law Student · Ammayi · Malayali manga🌴
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 opacity-50">
        <span className="text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--pink-soft)] to-transparent" />
      </div>
    </section>
  )
}
