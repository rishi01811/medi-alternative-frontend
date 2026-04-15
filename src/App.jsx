import { useState, useRef } from 'react'
import IntroScreen from './IntroScreen.jsx'
import HeroSection from './HeroSection.jsx'
import PlantScanner from './PlantScanner.jsx'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [scannerOpen, setScannerOpen] = useState(false)
  const featuresRef = useRef(null)
  const scannerRef = useRef(null)

  const handleScan = () => {
    setScannerOpen(true)
  }

  return (
    <>
      {showIntro && (
        <IntroScreen onEnter={() => setShowIntro(false)} />
      )}
      <HeroSection
        onScan={handleScan}
        featuresRef={featuresRef}
        scannerRef={scannerRef}
      />
      <PlantScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </>
  )
}
