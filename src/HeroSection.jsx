import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import heroVideo from './assets/hero.mp4'

const NAV_LINKS = ['Home', 'Plants', 'About']

const TECH = [
  { name: 'TensorFlow', icon: '⚡' },
  { name: 'MobileNet V2', icon: '🧠' },
  { name: 'OpenCV', icon: '👁' },
  { name: 'React', icon: '⚛' },
]

const PLANT_DATABASE = [
  {
    name: 'Tulsi',
    scientific: 'Ocimum tenuiflorum',
    emoji: '🌿',
    family: 'Lamiaceae',
    habitat: 'Tropical Asia',
    description: 'Known as "Holy Basil", Tulsi is one of the most sacred plants in India. Used for thousands of years in Ayurvedic medicine for its healing properties.',
    uses: ['Boosts immunity', 'Relieves respiratory ailments', 'Reduces stress & anxiety', 'Anti-inflammatory'],
    partsUsed: 'Leaves, Seeds, Roots',
  },
  {
    name: 'Aloe Vera',
    scientific: 'Aloe barbadensis',
    emoji: '🪴',
    family: 'Asphodelaceae',
    habitat: 'Arabian Peninsula',
    description: 'A succulent plant species known for its thick, fleshy leaves containing a clear gel. Used extensively in cosmetics, food, and traditional medicine worldwide.',
    uses: ['Skin healing & burns', 'Digestive health', 'Anti-bacterial properties', 'Hair nourishment'],
    partsUsed: 'Leaves (Gel)',
  },
  {
    name: 'Neem',
    scientific: 'Azadirachta indica',
    emoji: '🌳',
    family: 'Meliaceae',
    habitat: 'Indian Subcontinent',
    description: 'Called "Village Pharmacy" in India, every part of the Neem tree has been used in traditional medicine for over 2,000 years.',
    uses: ['Blood purifier', 'Anti-fungal treatment', 'Dental care', 'Skin disorders'],
    partsUsed: 'Leaves, Bark, Seeds',
  },
  {
    name: 'Turmeric',
    scientific: 'Curcuma longa',
    emoji: '✨',
    family: 'Zingiberaceae',
    habitat: 'Southeast Asia',
    description: 'A golden spice that has been used in Ayurveda for centuries. Curcumin, its active compound, has powerful anti-inflammatory and antioxidant effects.',
    uses: ['Anti-inflammatory', 'Antioxidant powerhouse', 'Joint pain relief', 'Wound healing'],
    partsUsed: 'Rhizome (Root)',
  },
  {
    name: 'Ashwagandha',
    scientific: 'Withania somnifera',
    emoji: '🌱',
    family: 'Solanaceae',
    habitat: 'India, Africa',
    description: 'An ancient adaptogenic herb, Ashwagandha is one of the most important herbs in Ayurveda. Known as "Indian Ginseng" for its rejuvenating properties.',
    uses: ['Stress reduction', 'Improved sleep quality', 'Energy & stamina', 'Cognitive function'],
    partsUsed: 'Roots, Leaves',
  },
  {
    name: 'Lavender',
    scientific: 'Lavandula angustifolia',
    emoji: '💜',
    family: 'Lamiaceae',
    habitat: 'Mediterranean',
    description: 'A fragrant herb with a long history of medicinal use. The essential oils are widely used in aromatherapy and traditional medicine for relaxation.',
    uses: ['Calming & sleep aid', 'Anxiety relief', 'Antiseptic properties', 'Headache relief'],
    partsUsed: 'Flowers, Leaves',
  },
]

/* ── Liquid glass helper ── */
const liquidGlass = (opacity = 0.5, blur = 24) => ({
  background: `rgba(255,255,255,${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
})

/* ── Text shadow for readability on video ── */
const heroTextShadow = '0 0 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4), 0 2px 40px rgba(0,0,0,0.3), 0 0 80px rgba(0,0,0,0.2)'
const heroTextShadowLight = '0 0 6px rgba(0,0,0,0.5), 0 0 16px rgba(0,0,0,0.35), 0 2px 32px rgba(0,0,0,0.25)'

export default function HeroSection({ onScan, featuresRef, scannerRef }) {
  const videoRef = useRef(null)
  const plantsRef = useRef(null)
  const [expandedPlant, setExpandedPlant] = useState(null)

  const handleNavClick = (link) => {
    switch (link) {
      case 'Home':
        window.scrollTo({ top: 0, behavior: 'smooth' })
        break
      case 'Plants':
        if (plantsRef?.current) {
          plantsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
        break
      case 'About':
        if (featuresRef?.current) {
          featuresRef.current.scrollIntoView({ behavior: 'smooth' })
        }
        break
      default:
        break
    }
  }

  const handleScan = () => {
    if (onScan) onScan()
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', overflowX: 'hidden' }}>

      {/* ═══ HERO — clean video, text on top with shadows ═══ */}
      <section className="hero-section" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        {/* Video — completely clean, no overlays */}
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

        {/* ── Liquid Glass Navbar — small, doesn't block video ── */}
        <motion.nav
          className="hero-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', top: '20px', left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex', alignItems: 'center',
            gap: '4px',
            padding: '6px 8px',
            ...liquidGlass(0.25, 20),
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '999px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'pointer',
              padding: '6px 14px 6px 10px',
              borderRadius: '999px',
              marginRight: '4px',
            }}
          >
            <span style={{ fontSize: '16px' }}>🌿</span>
            <span style={{
              fontFamily: "var(--font-display, 'Instrument Serif', serif)",
              fontSize: '1.05rem', fontWeight: 400,
              fontStyle: 'italic',
              color: '#fff', letterSpacing: '-0.02em',
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}>
              Medi
            </span>
          </div>

          {/* Nav pills */}
          {NAV_LINKS.map((link) => (
            <motion.button
              className="nav-link"
              key={link}
              onClick={() => handleNavClick(link)}
              whileHover={{ background: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.8rem', fontWeight: 500,
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '999px',
                transition: 'all 0.2s',
                textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            >
              {link}
            </motion.button>
          ))}

          {/* CTA */}
          <motion.button
            onClick={handleScan}
            whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(5,150,105,0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '8px 18px',
              background: 'rgba(5,150,105,0.85)',
              border: '1px solid rgba(110,231,160,0.3)',
              borderRadius: '999px',
              color: '#fff',
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.25s',
              marginLeft: '4px',
              boxShadow: '0 2px 12px rgba(5,150,105,0.2)',
            }}
          >
            <span style={{
              width: '6px', height: '6px',
              background: '#a7f3d0',
              borderRadius: '50%',
            }} />
            Scan
          </motion.button>
        </motion.nav>

        {/* ── Hero Text — directly on video ── */}
        <div className="hero-content" style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          zIndex: 2,
        }}>
          {/* Badge */}
          <motion.div {...fadeUp(0.5)} className="hero-badge" style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 20px 8px 10px',
              ...liquidGlass(0.2, 16),
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '999px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}>
              <span style={{
                background: 'rgba(5,150,105,0.8)',
                color: '#fff',
                fontSize: '0.6rem', fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '999px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
              }}>v2.0</span>
              <span style={{
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.78rem', color: '#fff',
                fontWeight: 500,
                textShadow: heroTextShadowLight,
              }}>
                Deep Learning · 95% Accuracy
              </span>
            </div>
          </motion.div>

          {/* Main headline — white on video */}
          <motion.h1
            {...fadeUp(0.65)}
            style={{
              fontFamily: "var(--font-display, 'Instrument Serif', serif)",
              fontSize: 'clamp(3.2rem, 8vw, 7rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              maxWidth: '850px',
              textShadow: heroTextShadow,
            }}
          >
            Nature's Medicine,<br />
            <span style={{ color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3), 0 0 60px rgba(16,185,129,0.3)' }}>Decoded by AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.8)}
            style={{
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
              fontSize: 'clamp(0.92rem, 1.5vw, 1.1rem)',
              color: '#fff',
              maxWidth: '480px',
              lineHeight: 1.7,
              marginTop: '28px',
              fontWeight: 600,
              textShadow: heroTextShadowLight,
            }}
          >
            Upload a photo and let our deep learning model reveal the
            medicinal secrets hidden in every leaf.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            {...fadeUp(0.95)}
            className="hero-cta-row"
            style={{
              display: 'flex', gap: '12px', alignItems: 'center',
              marginTop: '44px', flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            {/* Primary */}
            <motion.button
              onClick={handleScan}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 16px 48px rgba(5,150,105,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '16px 36px',
                background: 'rgba(5,150,105,0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#fff',
                border: '1px solid rgba(110,231,160,0.3)',
                borderRadius: '999px',
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 8px 32px rgba(5,150,105,0.25)',
                letterSpacing: '0.01em',
                transition: 'box-shadow 0.4s',
              }}
            >
              Identify a Plant
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                fontSize: '10px',
              }}>↗</span>
            </motion.button>

            {/* Secondary — glass */}
            <motion.button
              onClick={() => {
                if (featuresRef?.current) {
                  featuresRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              whileHover={{ background: '#f0fdf4', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '16px 28px',
                background: 'rgba(255,255,255,0.92)',
                border: '1px solid rgba(255,255,255,0.95)',
                borderRadius: '999px',
                color: '#059669',
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.88rem', fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* ── Bottom tech strip — subtle glass ── */}
        <motion.div
          className="tech-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            zIndex: 2,
            background: 'rgba(255,255,255,0.92)',
            borderTop: '1px solid rgba(209,250,229,0.5)',
            padding: '14px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <p className="tech-label" style={{
            fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
            fontSize: '0.65rem',
            color: '#059669',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Powered by
          </p>
          <div className="tech-items" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {TECH.map((t, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.78rem',
                fontWeight: 500,
                color: '#047857',
                letterSpacing: '0.02em',
              }}>
                <span style={{ fontSize: '12px' }}>{t.icon}</span>
                {t.name}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ PLANTS — white bg, green text, liquid glass cards ═══ */}
      <section
        ref={plantsRef}
        className="plants-section"
        style={{
          background: '#ffffff',
          padding: '120px 48px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '64px',
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: 'center', maxWidth: '550px' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '0.7rem', fontWeight: 700,
              color: '#059669', letterSpacing: '0.3em',
              textTransform: 'uppercase', marginBottom: '20px',
            }}
          >
            Plant Encyclopedia
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display, 'Instrument Serif', serif)",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: '#064e3b', lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Discover Medicinal<br />
            <span style={{ color: '#10b981' }}>Plants Around You</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '0.92rem', color: '#047857',
              marginTop: '16px', lineHeight: 1.7,
            }}
          >
            Explore our curated collection of powerful medicinal plants and their traditional healing properties.
          </motion.p>
        </div>

        {/* Plant cards — liquid glass on white bg */}
        <div className="plant-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px', width: '100%', maxWidth: '1060px',
        }}>
          {PLANT_DATABASE.map((plant, i) => (
            <motion.div
              key={plant.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setExpandedPlant(expandedPlant === plant.name ? null : plant.name)}
              style={{
                background: expandedPlant === plant.name
                  ? 'rgba(236,253,245,0.7)'
                  : 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: expandedPlant === plant.name
                  ? '1px solid rgba(52,211,153,0.4)'
                  : '1px solid rgba(0,0,0,0.06)',
                borderRadius: '24px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: expandedPlant === plant.name
                  ? '0 12px 40px rgba(5,150,105,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
                  : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(5,150,105,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
                e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'
              }}
              onMouseLeave={e => {
                if (expandedPlant !== plant.name) {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
                }
              }}
            >
              {/* Glass shine */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                pointerEvents: 'none', borderRadius: '24px',
              }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative' }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: 'rgba(209,250,229,0.5)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(167,243,208,0.4)',
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', flexShrink: 0,
                }}>
                  {plant.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: "var(--font-display, 'Instrument Serif', serif)",
                    fontSize: '1.35rem', fontWeight: 400, fontStyle: 'italic',
                    color: '#064e3b', marginBottom: '4px',
                  }}>{plant.name}</h3>
                  <p style={{
                    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: '0.76rem', color: '#059669', fontStyle: 'italic',
                  }}>{plant.scientific}</p>
                </div>
                <motion.span
                  animate={{ rotate: expandedPlant === plant.name ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: '#10b981', fontSize: '14px', marginTop: '4px' }}
                >▾</motion.span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px', position: 'relative' }}>
                {[
                  { label: plant.family, icon: '🌱' },
                  { label: plant.habitat, icon: '🌍' },
                ].map((tag, j) => (
                  <span key={j} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 12px',
                    background: 'rgba(236,253,245,0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(167,243,208,0.35)',
                    borderRadius: '999px',
                    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: '0.68rem', fontWeight: 500, color: '#065f46',
                  }}>
                    <span style={{ fontSize: '10px' }}>{tag.icon}</span>
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Expanded content */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedPlant === plant.name ? 'auto' : 0,
                  opacity: expandedPlant === plant.name ? 1 : 0,
                  marginTop: expandedPlant === plant.name ? 20 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden', position: 'relative' }}
              >
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(167,243,208,0.5), transparent)',
                  marginBottom: '18px',
                }} />

                <p style={{
                  fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: '0.86rem', color: '#047857', lineHeight: 1.8, marginBottom: '18px',
                }}>{plant.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{
                    fontFamily: "var(--font-mono, 'Space Grotesk', monospace)",
                    fontSize: '0.6rem', fontWeight: 600, color: '#059669',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>Parts Used</span>
                  <span style={{
                    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: '0.8rem', color: '#065f46',
                  }}>{plant.partsUsed}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px' }}>💊</span>
                  <span style={{
                    fontFamily: "var(--font-mono, 'Space Grotesk', monospace)",
                    fontSize: '0.6rem', fontWeight: 600, color: '#059669',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>Medicinal Uses</span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(167,243,208,0.4), transparent)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {plant.uses.map((use, k) => (
                    <div key={k} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 14px',
                      background: 'rgba(240,253,244,0.5)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(209,250,229,0.4)',
                      borderRadius: '12px',
                    }}>
                      <span style={{ width: '5px', height: '5px', background: '#10b981', borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                        fontSize: '0.82rem', color: '#065f46',
                      }}>{use}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES — white bg, green text, glass cards ═══ */}
      <section
        ref={featuresRef}
        className="features-section"
        style={{
          background: '#f8faf9',
          padding: '140px 48px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '80px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '550px' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '0.7rem', fontWeight: 700,
              color: '#059669', letterSpacing: '0.3em',
              textTransform: 'uppercase', marginBottom: '20px',
            }}
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display, 'Instrument Serif', serif)",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: '#064e3b', lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Ancient Knowledge,<br />
            <span style={{ color: '#10b981' }}>Modern Intelligence</span>
          </motion.h2>
        </div>

        {/* Feature cards */}
        <div className="feature-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '16px', width: '100%', maxWidth: '1000px',
        }}>
          {[
            { icon: '📸', num: '01', title: 'Capture', desc: 'Photograph any plant leaf, stem, or flower. Our model thrives with everyday smartphone photos.' },
            { icon: '🧠', num: '02', title: 'Analyse', desc: 'MobileNet V2 cross-references 10,000+ species with 95% accuracy in under 2 seconds.' },
            { icon: '💊', num: '03', title: 'Discover', desc: 'Receive detailed medicinal properties, traditional uses, dosage info, and safety warnings.' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '24px',
                padding: '36px 32px',
                cursor: 'default',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(5,150,105,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
                e.currentTarget.style.borderColor = 'rgba(52,211,153,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
              }}
            >
              {/* Glass shine */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                pointerEvents: 'none', borderRadius: '24px',
              }} />

              <span style={{
                fontFamily: "var(--font-mono, 'Space Grotesk', monospace)",
                fontSize: '0.65rem', fontWeight: 600, color: '#10b981',
                letterSpacing: '0.1em', marginBottom: '20px', display: 'block', position: 'relative',
              }}>{card.num}</span>

              <div style={{
                width: '48px', height: '48px',
                background: 'rgba(236,253,245,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(167,243,208,0.35)',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '24px', position: 'relative',
              }}>{card.icon}</div>

              <h3 style={{
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
                fontSize: '1.5rem', fontWeight: 400, fontStyle: 'italic',
                color: '#064e3b', marginBottom: '12px', position: 'relative',
              }}>{card.title}</h3>

              <p style={{
                fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.88rem', color: '#047857', lineHeight: 1.7,
                fontWeight: 400, position: 'relative',
              }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Scan CTA */}
        <motion.button
          onClick={handleScan}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04, boxShadow: '0 16px 48px rgba(5,150,105,0.25)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '18px 48px',
            background: 'rgba(5,150,105,0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid rgba(110,231,160,0.3)',
            borderRadius: '999px',
            fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
            fontSize: '0.92rem', fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(5,150,105,0.2)',
            transition: 'all 0.4s',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
        >
          Start Identifying Plants
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '22px', height: '22px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%', fontSize: '11px', color: '#fff',
          }}>→</span>
        </motion.button>
      </section>
    </div>
  )
}
