import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

function SakuraScene() {
  const petalsRef = useRef()
  const starsRef = useRef()
  const groupRef = useRef()
  const { camera } = useThree()

  // State to track mouse position for parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  // State to track scroll
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates to -1 to +1
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 1. Generate Petals
  const petalCount = 300
  const petals = useMemo(() => {
    const arr = []
    const colors = ['#ffd6e7', '#ffe4f0', '#ffffff']
    for (let i = 0; i < petalCount; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 24, // x: -12 to 12
          (Math.random() - 0.5) * 12, // y: -6 to 6
          (Math.random() - 0.5) * 24  // z: -12 to 12
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        color: new THREE.Color(colors[i % colors.length]), // alternate between colors per literal index as requested
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.004 + 0.001,
          Math.random() * 0.004 + 0.001,
          Math.random() * 0.004 + 0.001
        ),
        offset: Math.random() * 100,
      })
    }
    return arr
  }, [])

  // 2. Generate Stars
  const starCount = 200
  const starsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 4) // RGBA for per-particle opacity
    const phases = new Float32Array(starCount)
    
    // #fff5f8 is equivalent to rgb(255, 245, 248) -> 1.0, 0.96, 0.97
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5
      colors[i * 4] = 1.0
      colors[i * 4 + 1] = 0.96
      colors[i * 4 + 2] = 0.97
      colors[i * 4 + 3] = 1.0 // Alpha
      phases[i] = Math.random() * Math.PI * 2
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 4))
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
    return geo
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Animate petals (InstancedMesh)
    if (petalsRef.current) {
      const dummy = new THREE.Object3D()
      petals.forEach((petal, i) => {
        // Drift down
        petal.position.y -= 0.002
        // Drift sideways
        petal.position.x += Math.sin(time + petal.offset) * 0.003
        
        // Reset if too low
        if (petal.position.y < -6) {
          petal.position.y = 6
          petal.position.x = (Math.random() - 0.5) * 24
          petal.position.z = (Math.random() - 0.5) * 24
        }

        // Rotate
        petal.rotation.x += petal.rotSpeed.x
        petal.rotation.y += petal.rotSpeed.y
        petal.rotation.z += petal.rotSpeed.z

        dummy.position.copy(petal.position)
        dummy.rotation.copy(petal.rotation)
        dummy.updateMatrix()
        petalsRef.current.setMatrixAt(i, dummy.matrix)
        petalsRef.current.setColorAt(i, petal.color)
      })
      petalsRef.current.instanceMatrix.needsUpdate = true
      petalsRef.current.instanceColor.needsUpdate = true
    }

    // Animate stars per-particle opacity
    if (starsGeo) {
      const colors = starsGeo.attributes.color
      const phases = starsGeo.attributes.phase
      for (let i = 0; i < starCount; i++) {
        // Math.abs(Math.sin(time * 0.8 + star.offset)) * 0.6 + 0.2
        const alpha = Math.abs(Math.sin(time * 0.8 + phases.array[i])) * 0.6 + 0.2
        colors.array[i * 4 + 3] = alpha
      }
      colors.needsUpdate = true
    }

    // Parallax Camera (lerp camera X/Y toward mouse * 0.3, lerp factor 0.03)
    const targetX = mouse.x * 0.3
    const targetY = mouse.y * 0.3
    camera.position.x += (targetX - camera.position.x) * 0.03
    camera.position.y += (targetY - camera.position.y) * 0.03

    // Scroll Reaction
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollY * 0.0003
    }
  })

  // Cleanup happens natively via @react-three/fiber unmounting the canvas
  // however, useFrame is automatically removed, and Geometries/Materials
  // define auto-dispose when React unmounts them if properly constructed inside jsx.
  // The manual `useMemo` Geometries must be disposed when the component unmounts.
  useEffect(() => {
    return () => {
      starsGeo.dispose()
    }
  }, [starsGeo])

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight color="#ffe8f0" intensity={0.8} />
      <directionalLight color="#ffcce0" intensity={0.6} position={[5, 10, 5]} />
      <pointLight color="#ff99bb" intensity={0.4} position={[-3, 2, 3]} />

      {/* Petals */}
      <instancedMesh ref={petalsRef} args={[null, null, petalCount]}>
        <planeGeometry args={[0.15, 0.1]} />
        <meshStandardMaterial 
          side={THREE.DoubleSide} 
          roughness={0.4} 
          transparent={true}
          opacity={0.75}
        />
      </instancedMesh>

      {/* Stars */}
      <points ref={starsRef} geometry={starsGeo}>
        <pointsMaterial 
          size={0.04} 
          transparent={true} 
          vertexColors={true}
          sizeAttenuation={true}
        />
      </points>
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-[#1a0a14]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
      >
        <color attach="background" args={['#1a0a14']} />
        <fogExp2 attach="fog" args={['#1a0a14', 0.04]} />
        <SakuraScene />
      </Canvas>
    </div>
  )
}
