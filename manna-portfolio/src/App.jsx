import Hero from './components/Hero'
import Info from './components/Info'
import CatImage from './components/CatImage'
import MusicPlayer from './components/MusicPlayer'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="w-full">
      <Hero />
      <Info />
      <CatImage />
      <MusicPlayer />
      <Footer />
    </main>
  )
}
