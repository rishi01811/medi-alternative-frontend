import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroVideo from './assets/hero.mp4'

export default function IntroScreen({ onEnter }) {
  const [tapped, setTapped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 1000)
    return () => clearTimeout(t)
  }, [])

  const handleTap = () => {
    if (tapped) return
    setTapped(true)
    setTimeout(onEnter, 1000)
  }

  return (
    <AnimatePresence>
      {!tapped ? (
        <motion.div
          key="splash"
          onClick={handleTap}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            cursor: 'pointer', overflow: 'hidden',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Clean video — no overlays */}
          <video
            ref={videoRef}
            src={heroVideo}
            autoPlay muted loop playsInline
            preload="auto"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />

          {/* Text directly on video — readable via text-shadow */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '20px',
            zIndex: 2,
          }}>
            {/* Logo icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: '48px' }}
            >
              🌿
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 'clamp(5rem, 14vw, 10rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#fff',
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                textAlign: 'center',
                textShadow: '0 0 10px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.4), 0 4px 60px rgba(0,0,0,0.3), 0 0 100px rgba(0,0,0,0.2)',
              }}
            >
              Medi
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8rem',
                color: '#fff',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textShadow: '0 0 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.35), 0 2px 40px rgba(0,0,0,0.25)',
              }}
            >
              Medicinal Plant Intelligence
            </motion.p>
          </div>

          {/* Tap hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute', bottom: '48px',
                  width: '100%', textAlign: 'center',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '12px',
                  zIndex: 2,
                }}
              >
                <motion.div
                  animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '1.5px', height: '36px',
                    background: 'linear-gradient(to bottom, transparent, #fff)',
                  }}
                />
                <motion.p
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.7rem',
                    color: '#fff',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  Click to enter
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
