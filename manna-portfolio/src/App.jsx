import ThreeBackground from './components/ThreeBackground'
import Particles from './components/Particles'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import CatImage from './components/CatImage'
import Skills from './components/Skills'
import Contact from './components/Contact'
import MusicPlayer from './components/MusicPlayer'
import ForeheadXO from './components/ForeheadXO'

export default function App() {
  return (
    <>
      <ThreeBackground />
      <Particles />
      <Navbar />
      
      <main className="w-full">
        <div className="section-wrapper">
          <Hero />
        </div>
        
        <About />
        
        <div className="section-wrapper">
          <CatImage />
        </div>
        
        <ForeheadXO />
        
        <Skills />
        <Contact />
      </main>
      
      <MusicPlayer />
    </>
  )
}
