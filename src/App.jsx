import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import './styles/App.css'

const API_URL = "https://rishi01811-phytoscan-backend.hf.space"

// ─── Falling Leaves Background ───────────────────────────────────────────────
function LeafField() {
  const leaves = ['🍃', '🌿', '🍀', '☘️', '🌱']
  return (
    <div className="leaf-field" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="falling-leaf"
          style={{
            '--x': `${Math.random() * 100}%`,
            '--duration': `${12 + Math.random() * 16}s`,
            '--delay': `${Math.random() * 12}s`,
            '--size': `${14 + Math.random() * 18}px`,
          }}
        >
          {leaves[i % leaves.length]}
        </div>
      ))}
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="header-inner">
        <div className="logo-group">
          <div className="logo-icon">🌿</div>
          <div>
            <h1 className="logo-name">PhytoScan <span className="logo-ai">AI</span></h1>
            <p className="logo-tagline">Medicinal Plant Intelligence</p>
          </div>
        </div>

        <nav className="header-nav">
          <span className="nav-badge">
            <span className="status-dot" />
            Model Active
          </span>
          <span className="nav-model">MobileNetV2 v2.0</span>
        </nav>
      </div>
    </motion.header>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.8 }}
    >
      <motion.div
        className="hero-eyebrow"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        🌱 Deep Learning · Transfer Learning · MobileNetV2
      </motion.div>

      <motion.h2
        className="hero-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Identify Medicinal Plants
        <br />
        <em>with AI Precision</em>
      </motion.h2>

      <motion.p
        className="hero-desc"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7 }}
      >
        Upload any plant image and get instant identification with detailed medicinal
        properties, scientific classification, and traditional uses — powered by deep
        convolutional neural networks.
      </motion.p>

      <motion.div
        className="hero-stats"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        {[
          { icon: '🌿', value: '40+', label: 'Plant Species' },
          { icon: '🖼️', value: '6500+', label: 'Training Images' },
          { icon: '🎯', value: '95%+', label: 'Accuracy' },
          { icon: '⚡', value: '<200ms', label: 'Inference' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 + i * 0.08 }}
          >
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onImageSelect, isLoading }) {
  const [preview, setPreview] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onImageSelect(file)
  }, [onImageSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'] },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  return (
    <motion.div
      className="upload-section"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
    >
      <div
        {...getRootProps()}
        className={`upload-card ${isDragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
      >
        <input {...getInputProps()} />

        {/* Leaf corner decorations */}
        <span className="leaf-corner tl">🍃</span>
        <span className="leaf-corner tr">🍃</span>
        <span className="leaf-corner bl">🍃</span>
        <span className="leaf-corner br">🍃</span>

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Plant preview" className="preview-img" />
            {isLoading ? (
              <div className="scan-overlay-inner">
                <div className="scan-leaf">🔬</div>
                <p className="scanning-text">Analyzing Specimen...</p>
                <div className="scan-dots">
                  <div className="scan-dot" />
                  <div className="scan-dot" />
                  <div className="scan-dot" />
                </div>
              </div>
            ) : (
              <div className="preview-overlay">
                🌿 Drop a new image to re-analyze
              </div>
            )}
          </div>
        ) : (
          <div className="upload-content">
            <motion.div
              className="upload-icon-wrap"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌿
            </motion.div>
            <h3 className="upload-title">Drop a Plant Image Here</h3>
            <p className="upload-sub">
              Drag & drop or{' '}
              <span className="upload-link">click to browse</span>
              {' '}your files
            </p>
            <span className="upload-formats">JPG · PNG · WEBP · BMP</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  const steps = [
    { icon: '🖼️', text: 'Preprocessing image...' },
    { icon: '🧠', text: 'Running neural network...' },
    { icon: '🔍', text: 'Analyzing plant features...' },
    { icon: '📋', text: 'Generating results...' },
  ]
  return (
    <motion.div
      className="loading-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="loader-leaf">🌿</div>
      <div>
        <p className="loader-title">Identifying Plant...</p>
        <p className="loader-subtitle">Our AI is analyzing your image</p>
      </div>
      <div className="loading-steps">
        {steps.map((step, i) => (
          <motion.p
            key={step.text}
            className="loading-step"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: [0, 1, 0.4] }}
            transition={{ delay: i * 0.7, duration: 1.8, repeat: Infinity, repeatDelay: 1.2 }}
          >
            <span className="step-leaf">{step.icon}</span>
            {step.text}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────
function ConfidenceBar({ label, value, rank = 0 }) {
  const fillClass = rank === 0 ? '' : rank === 1 ? 'secondary' : 'tertiary'
  return (
    <div className="confidence-bar-wrap">
      <div className="bar-header">
        <span className="bar-name">{label}</span>
        <span className="bar-pct">{value.toFixed(1)}%</span>
      </div>
      <div className="bar-track">
        <motion.div
          className={`bar-fill ${fillClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.1 * rank, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  const { prediction, plant_info, top_3_predictions, inference_time_ms, image_info } = result

  const confidenceClass =
    prediction.confidence > 85 ? 'high' :
    prediction.confidence > 60 ? 'mid' : 'low'

  return (
    <motion.div
      className="result-card"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* ── Header ── */}
      <div className="result-header">
        <div className="result-title-group">
          <motion.span
            className="result-tag"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            🌿 Identified Specimen
          </motion.span>
          <motion.h3
            className="result-plant-name"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            {prediction.plant_name}
          </motion.h3>
          <motion.p
            className="result-scientific"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.36 }}
          >
            <em>{plant_info.scientific_name}</em> · {plant_info.family}
          </motion.p>
        </div>

        <motion.div
          className={`confidence-badge ${confidenceClass}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
        >
          <span className="confidence-value">{prediction.confidence.toFixed(0)}%</span>
          <span className="confidence-label">match</span>
        </motion.div>
      </div>

      {/* ── Quick Stats ── */}
      <motion.div
        className="quick-stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        {[
          { label: 'Inference', value: `${inference_time_ms}ms` },
          { label: 'Image', value: image_info.dimensions },
          { label: 'File', value: `${image_info.size_kb}KB` },
          { label: 'Habitat', value: plant_info.habitat.split(',')[0] },
        ].map((s) => (
          <div key={s.label} className="q-stat">
            <span className="q-stat-label">{s.label}</span>
            <span className="q-stat-value">{s.value}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Top Predictions ── */}
      <motion.div
        className="predictions-section"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="section-head">
          <span className="section-icon">🎯</span>
          Top Predictions
        </h4>
        {top_3_predictions.map((pred, i) => (
          <ConfidenceBar
            key={pred.plant_name}
            label={pred.plant_name}
            value={pred.confidence}
            rank={i}
          />
        ))}
      </motion.div>

      {/* ── About Plant ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="section-head">
          <span className="section-icon">📖</span>
          About This Plant
        </h4>
        <p className="desc-text">{plant_info.description}</p>
        <div className="plant-meta-row">
          <div className="meta-chip">
            <span className="meta-chip-label">Parts Used</span>
            <span className="meta-chip-value">{plant_info.parts_used}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-chip-label">Habitat</span>
            <span className="meta-chip-value">{plant_info.habitat.split(',')[0]}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Medicinal Uses ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h4 className="section-head">
          <span className="section-icon">🌿</span>
          Medicinal Uses
        </h4>
        <div className="uses-grid">
          {plant_info.medicinal_uses.map((use, i) => (
            <motion.div
              key={i}
              className="use-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.07 }}
            >
              <span className="use-bullet">🌱</span>
              <span className="use-text">{use}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Disclaimer ── */}
      <motion.p
        className="disclaimer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        ⚠️ For educational purposes only. Always consult a qualified healthcare
        practitioner before using any medicinal plant.
      </motion.p>
    </motion.div>
  )
}

// ─── Rejection Card ───────────────────────────────────────────────────────────
function RejectionCard({ data, onRetry }) {
  const { rejection_reason, rejection_detail, confidence, entropy_ratio } = data
  return (
    <motion.div
      className="rejection-card"
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="rejection-icon">🍂</div>

      <motion.h3
        className="rejection-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Not a Medicinal Plant
      </motion.h3>

      <motion.p
        className="rejection-reason"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
      >
        {rejection_reason}
      </motion.p>

      <motion.div
        className="rejection-stats"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="rej-stat">
          <span className="rej-stat-label">Confidence</span>
          <span className="rej-stat-value">{confidence?.toFixed(1)}%</span>
        </div>
        <div className="rej-stat">
          <span className="rej-stat-label">Entropy</span>
          <span className="rej-stat-value">{entropy_ratio?.toFixed(3)}</span>
        </div>
        <div className="rej-stat">
          <span className="rej-stat-label">Verdict</span>
          <span className="rej-stat-value">Rejected</span>
        </div>
      </motion.div>

      <motion.div
        className="rejection-tips"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
      >
        <p className="tips-title">For best results, upload:</p>
        <ul className="tips-list">
          <li>A clear photo of a single plant or leaf</li>
          <li>Good natural lighting with the plant in focus</li>
          <li>One of the 40+ supported medicinal plant species</li>
        </ul>
      </motion.div>

      <motion.button
        className="retry-btn"
        onClick={onRetry}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        🌿 Try Another Image
      </motion.button>
    </motion.div>
  )
}

// ─── Error Card ───────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }) {
  return (
    <motion.div
      className="error-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      <div className="error-icon">🥀</div>
      <h3 className="error-title">Analysis Failed</h3>
      <p className="error-message">{message}</p>
      <button className="retry-btn" onClick={onRetry}>🌱 Try Again</button>
    </motion.div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult]       = useState(null)
  const [rejection, setRejection] = useState(null)
  const [error, setError]         = useState(null)
  const resultRef = useRef(null)

  const handleImageSelect = useCallback(async (file) => {
    setIsLoading(true)
    setResult(null)
    setRejection(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })

      const data = response.data

      if (data.is_plant === false) {
        setRejection(data)
      } else {
        setResult(data)
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)

    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ECONNREFUSED'
          ? 'Cannot connect to the API server.'
          : null) ||
        err.message ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleReset = () => {
    setResult(null)
    setRejection(null)
    setError(null)
  }

  return (
    <div className="app">
      <LeafField />
      <Header />

      <main className="main-content">
        <Hero />

        <div className="upload-result-grid">
          <UploadZone onImageSelect={handleImageSelect} isLoading={isLoading} />

          <div ref={resultRef} className="result-area">
            <AnimatePresence mode="wait">
              {isLoading && <LoadingState key="loading" />}

              {error && !isLoading && (
                <ErrorCard key="error" message={error} onRetry={handleReset} />
              )}

              {rejection && !isLoading && (
                <RejectionCard key="rejection" data={rejection} onRetry={handleReset} />
              )}

              {result && !isLoading && (
                <ResultCard key="result" result={result} />
              )}

              {!isLoading && !result && !rejection && !error && (
                <motion.div
                  key="empty"
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="empty-illustration">
                    {[
                      { emoji: '🌿', d: '4s', delay: '0s' },
                      { emoji: '🍃', d: '5s', delay: '0.5s' },
                      { emoji: '🌱', d: '3.5s', delay: '1s' },
                    ].map((leaf, i) => (
                      <span
                        key={i}
                        className="empty-leaf"
                        style={{ '--d': leaf.d, '--delay': leaf.delay }}
                      >
                        {leaf.emoji}
                      </span>
                    ))}
                  </div>
                  <p className="empty-title">Upload a plant image to begin</p>
                  <p className="empty-sub">
                    Our AI will identify the plant and reveal its medicinal
                    properties, scientific name, and traditional uses.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">🌿 PhytoScan AI</span>
          <p className="footer-text">
            MobileNetV2 · TensorFlow · Built for medicinal plant research
          </p>
          <p className="footer-disclaimer">
            For educational purposes only. Not a substitute for professional
            medical advice. Always consult a qualified practitioner.
          </p>
        </div>
      </footer>
    </div>
  )
}
