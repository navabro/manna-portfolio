import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'

function CatGeometry() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.12
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.18
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#ffc8dc" roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial color="#ffc8dc" roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Left ear */}
      <mesh position={[-0.38, 1.32, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.18, 0.36, 3]} />
        <meshStandardMaterial color="#e8a0b4" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Right ear */}
      <mesh position={[0.38, 1.32, 0]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.18, 0.36, 3]} />
        <meshStandardMaterial color="#e8a0b4" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Left cheek */}
      <mesh position={[-0.22, 0.62, 0.52]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color="#f9c8d8" roughness={0.55} metalness={0.08} />
      </mesh>

      {/* Right cheek */}
      <mesh position={[0.22, 0.62, 0.52]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color="#f9c8d8" roughness={0.55} metalness={0.08} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.7, 0.6]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#e8a0b4" roughness={0.6} />
      </mesh>

      {/* Bow */}
      <mesh position={[0, 1.42, 0.28]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.15, 0.055, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#e05f7a" roughness={0.45} />
      </mesh>

      {/* Tail */}
      <mesh position={[0.82, -0.85, -0.2]} rotation={[0.4, 0, 1.1]}>
        <torusGeometry args={[0.42, 0.09, 10, 20, Math.PI * 1.3]} />
        <meshStandardMaterial color="#f9c8d8" roughness={0.55} metalness={0.08} />
      </mesh>
    </group>
  )
}

function Particles() {
  const count = 26
  const data = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 4 - 2,
        ],
        scale: 0.04 + Math.random() * 0.055,
        offset: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  const refs = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.position.y = data[i].pos[1] + Math.sin(t * 0.4 + data[i].offset) * 0.28
    })
  })

  return (
    <>
      {data.map((d, i) => (
        <mesh
          key={i}
          ref={el => (refs.current[i] = el)}
          position={d.pos}
          scale={d.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffb6c1" roughness={0.5} transparent opacity={0.45} />
        </mesh>
      ))}
    </>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fff5f8 0%, #fff0f5 50%, #fde8ef 100%)' }}
    >
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 46 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={2.8} color="#ffffff" />
          <pointLight position={[3, 4, 4]} intensity={2.2} color="#ffe0ea" />
          <pointLight position={[-4, -2, 3]} intensity={1.2} color="#ffccd8" />
          <directionalLight position={[0, 5, 5]} intensity={1.0} color="#fff5f8" />
          <CatGeometry />
          <Particles />
        </Canvas>
      </div>

      {/* Soft vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(255,240,245,0.55) 100%)',
        }}
      />

      {/* Hero Text */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 select-none"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="text-xs font-bold tracking-[0.38em] uppercase mb-5"
          style={{ color: '#d4607a' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          ✦ &nbsp;Welcome&nbsp; ✦
        </motion.p>

        <motion.h1
          className="font-extrabold leading-none mb-3"
          style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: 'clamp(2.8rem, 8vw, 5.8rem)',
            background: 'linear-gradient(135deg, #c4536a 0%, #e05f7a 55%, #e8748a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Manna Mary
        </motion.h1>

        <motion.p
          className="text-base font-semibold mt-1"
          style={{ color: '#8a5a60' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.8 }}
        >
          Mannammayi &nbsp;·&nbsp; Law Student &nbsp;·&nbsp; Rank Holder
        </motion.p>

        <motion.div
          className="mt-9"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <a
            href="#info"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white text-sm tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #e8748a, #d4607a)',
              boxShadow: '0 6px 20px rgba(212,96,122,0.26)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(212,96,122,0.36)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,96,122,0.26)'
            }}
          >
            Discover me ↓
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll line */}
      <motion.div
        className="absolute bottom-7 z-10 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span
          className="text-[10px] font-bold tracking-[0.28em] uppercase"
          style={{ color: '#d4607a' }}
        >
          scroll
        </span>
        <motion.div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, #d4607a, transparent)',
          }}
          animate={{ scaleY: [1, 0.25, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
