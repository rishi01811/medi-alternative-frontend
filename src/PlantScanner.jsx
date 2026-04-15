import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const IDLE = 'idle'
const PREVIEW = 'preview'
const SCANNING = 'scanning'
const RESULT = 'result'
const REJECTED = 'rejected'
const ERROR = 'error'

const fontBody = "'Plus Jakarta Sans', system-ui, sans-serif"
const fontDisplay = "'Instrument Serif', Georgia, serif"
const fontMono = "'Space Grotesk', monospace"
const accent = '#059669'

/* ── Liquid glass helpers ── */
const liquidGlass = (opacity = 0.5, blur = 24) => ({
  background: `rgba(255,255,255,${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
})

const glassInset = 'inset 0 1px 0 rgba(255,255,255,0.8)'

export default function PlantScanner({ open, onClose }) {
  const [stage, setStage] = useState(IDLE)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const reset = () => {
    setStage(IDLE)
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const onDrop = useCallback((accepted) => {
    if (!accepted.length) return
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStage(PREVIEW)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleScan = async () => {
    if (!file) return
    setStage(SCANNING)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })
      const data = res.data
      setResult(data)
      setStage(data.is_plant ? RESULT : REJECTED)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong')
      setStage(ERROR)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scanner-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '12px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            className="scanner-modal"
            key="scanner-modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              width: '100%', maxWidth: '580px',
              maxHeight: '88vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              ...liquidGlass(0.7, 40),
              border: '1px solid rgba(255,255,255,0.65)',
              borderRadius: '28px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Glass shine on modal */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 40%, rgba(255,255,255,0.15) 100%)',
              borderRadius: '28px',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* ── Header ── */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(209,250,229,0.4)',
              ...liquidGlass(0.65, 30),
              boxShadow: glassInset,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  ...liquidGlass(0.5, 16),
                  border: '1px solid rgba(167,243,208,0.4)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  boxShadow: glassInset,
                }}>🔬</div>
                <div>
                  <h2 style={{
                    fontFamily: fontDisplay,
                    fontSize: '1.15rem', fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#064e3b', margin: 0,
                  }}>Plant Scanner</h2>
                  <p style={{
                    fontFamily: fontBody,
                    fontSize: '0.65rem', color: '#059669',
                    margin: 0, letterSpacing: '0.12em',
                    textTransform: 'uppercase', fontWeight: 600,
                  }}>AI-Powered</p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1, background: 'rgba(236,253,245,0.7)' }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '32px', height: '32px',
                  ...liquidGlass(0.4, 12),
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                  color: '#6b7280',
                  fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: glassInset,
                }}
              >✕</motion.button>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: '20px 24px 28px', position: 'relative', zIndex: 1 }}>

              {/* ════ IDLE ════ */}
              {stage === IDLE && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div
                    {...getRootProps()}
                    style={{
                      border: `1.5px dashed ${isDragActive ? '#10b981' : 'rgba(209,250,229,0.7)'}`,
                      borderRadius: '22px',
                      padding: '52px 28px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      ...liquidGlass(isDragActive ? 0.55 : 0.3, 16),
                      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '18px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <input {...getInputProps()} />

                    {/* Upload icon */}
                    <motion.div
                      animate={isDragActive ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: '72px', height: '72px',
                        ...liquidGlass(0.5, 20),
                        border: `1px solid ${isDragActive ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.6)'}`,
                        borderRadius: '22px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px',
                        transition: 'border-color 0.3s',
                        boxShadow: glassInset,
                      }}
                    >
                      {isDragActive ? '🌿' : '📸'}
                    </motion.div>

                    <div>
                      <p style={{
                        fontFamily: fontDisplay,
                        fontSize: '1.2rem', fontWeight: 400,
                        fontStyle: 'italic',
                        color: '#064e3b', marginBottom: '8px',
                      }}>
                        {isDragActive ? 'Release to upload' : 'Drop your plant image'}
                      </p>
                      <p style={{
                        fontFamily: fontBody,
                        fontSize: '0.84rem', color: '#6b7280',
                        fontWeight: 400,
                      }}>
                        Drag & drop or{' '}
                        <span style={{
                          color: accent,
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(167,243,208,0.6)',
                          paddingBottom: '1px',
                        }}>browse files</span>
                      </p>
                    </div>

                    {/* Format badges — glass pills */}
                    <div style={{
                      display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center',
                      marginTop: '4px',
                    }}>
                      {['JPG', 'PNG', 'WEBP'].map(fmt => (
                        <span key={fmt} style={{
                          padding: '4px 12px',
                          ...liquidGlass(0.4, 8),
                          border: '1px solid rgba(167,243,208,0.35)',
                          borderRadius: '999px',
                          fontSize: '0.62rem', fontWeight: 600,
                          color: '#059669',
                          letterSpacing: '0.1em',
                          fontFamily: fontMono,
                        }}>{fmt}</span>
                      ))}
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.62rem', fontWeight: 500,
                        color: '#9ca3af',
                        fontFamily: fontMono,
                      }}>≤ 10MB</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════ PREVIEW ════ */}
              {stage === PREVIEW && preview && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div style={{
                    position: 'relative', borderRadius: '20px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  }}>
                    <img
                      src={preview}
                      alt="Plant preview"
                      style={{
                        width: '100%', maxHeight: '320px',
                        objectFit: 'contain',
                        display: 'block',
                        background: '#f8faf9',
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      ...liquidGlass(0.65, 16),
                      borderTop: '1px solid rgba(255,255,255,0.5)',
                      padding: '12px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{
                        fontFamily: fontBody,
                        fontSize: '0.75rem', color: '#047857',
                        maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', fontWeight: 500,
                      }}>{file?.name}</span>
                      <span style={{
                        fontFamily: fontMono,
                        fontSize: '0.65rem', color: '#9ca3af',
                      }}>{file ? `${(file.size / 1024).toFixed(0)} KB` : ''}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <motion.button
                      onClick={reset}
                      whileHover={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(209,250,229,0.6)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: 1, padding: '13px 16px',
                        ...liquidGlass(0.4, 12),
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '14px',
                        color: '#6b7280',
                        fontFamily: fontBody,
                        fontSize: '0.84rem', fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        boxShadow: glassInset,
                      }}
                    >
                      Change
                    </motion.button>
                    <motion.button
                      onClick={handleScan}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 12px 40px rgba(5,150,105,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: 2, padding: '13px 24px',
                        background: 'rgba(5,150,105,0.88)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(110,231,160,0.3)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontFamily: fontBody,
                        fontSize: '0.88rem', fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.3s',
                      }}
                    >
                      <span style={{
                        width: '6px', height: '6px',
                        background: '#a7f3d0',
                        borderRadius: '50%',
                      }} />
                      Identify Plant
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ════ SCANNING ════ */}
              {stage === SCANNING && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '28px',
                    padding: '44px 0',
                  }}
                >
                  {preview && (
                    <motion.div
                      animate={{ boxShadow: ['0 0 12px rgba(5,150,105,0.1)', '0 0 28px rgba(5,150,105,0.18)', '0 0 12px rgba(5,150,105,0.1)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '88px', height: '88px', borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #34d399',
                      }}
                    >
                      <img src={preview} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                      }} />
                    </motion.div>
                  )}

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    style={{
                      width: '40px', height: '40px',
                      border: '2px solid rgba(209,250,229,0.5)',
                      borderTopColor: accent,
                      borderRadius: '50%',
                    }}
                  />

                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      fontFamily: fontDisplay,
                      fontSize: '1.1rem', fontWeight: 400, fontStyle: 'italic',
                      color: '#064e3b', marginBottom: '6px',
                    }}>Analysing...</p>
                    <p style={{
                      fontFamily: fontBody,
                      fontSize: '0.78rem', color: '#6b7280',
                    }}>Running neural network inference</p>
                  </div>

                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '6px',
                    width: '100%', maxWidth: '260px',
                  }}>
                    {['Processing image', 'Running MobileNet V2', 'Matching species'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.4 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 14px',
                          ...liquidGlass(0.4, 12),
                          border: '1px solid rgba(255,255,255,0.5)',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          color: '#047857',
                          fontFamily: fontBody, fontWeight: 500,
                          boxShadow: glassInset,
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                          style={{
                            width: '5px', height: '5px',
                            background: accent,
                            borderRadius: '50%',
                          }}
                        />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ════ RESULT ════ */}
              {stage === RESULT && result && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div style={{
                    ...liquidGlass(0.5, 20),
                    border: '1px solid rgba(167,243,208,0.5)',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: `0 4px 20px rgba(5,150,105,0.06), ${glassInset}`,
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(236,253,245,0.4) 0%, transparent 50%)',
                      pointerEvents: 'none',
                    }} />

                    {preview && (
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        overflow: 'hidden', flexShrink: 0,
                        border: '1px solid rgba(167,243,208,0.5)',
                      }}>
                        <img src={preview} alt="" style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                        }} />
                      </div>
                    )}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <p style={{
                        fontFamily: fontMono,
                        fontSize: '0.58rem', fontWeight: 600,
                        color: accent, letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: '4px',
                      }}>✓ Identified</p>
                      <h3 style={{
                        fontFamily: fontDisplay,
                        fontSize: '1.4rem', fontWeight: 400,
                        fontStyle: 'italic',
                        color: '#064e3b', margin: 0, lineHeight: 1.2,
                      }}>{result.prediction?.plant_name}</h3>
                      {result.plant_info?.scientific_name && (
                        <p style={{
                          fontFamily: fontBody,
                          fontSize: '0.78rem', color: '#059669',
                          fontStyle: 'italic', marginTop: '3px',
                        }}>{result.plant_info.scientific_name}</p>
                      )}
                    </div>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      ...liquidGlass(0.5, 12),
                      border: '2px solid rgba(52,211,153,0.4)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: glassInset,
                    }}>
                      <span style={{
                        fontFamily: fontMono,
                        fontSize: '1rem', fontWeight: 700,
                        color: '#065f46', lineHeight: 1,
                      }}>{result.prediction?.confidence?.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
                  }}>
                    {[
                      { label: 'Family', value: result.plant_info?.family || 'N/A', icon: '🌱' },
                      { label: 'Habitat', value: result.plant_info?.habitat || 'N/A', icon: '🏔' },
                      { label: 'Parts Used', value: result.plant_info?.parts_used || 'N/A', icon: '🍃' },
                    ].map(s => (
                      <div key={s.label} style={{
                        ...liquidGlass(0.35, 12),
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '14px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        boxShadow: glassInset,
                      }}>
                        <span style={{ fontSize: '14px', display: 'block', marginBottom: '6px' }}>{s.icon}</span>
                        <p style={{
                          fontFamily: fontMono,
                          fontSize: '0.55rem', color: '#9ca3af',
                          fontWeight: 600, letterSpacing: '0.1em',
                          textTransform: 'uppercase', marginBottom: '3px',
                        }}>{s.label}</p>
                        <p style={{
                          fontFamily: fontBody,
                          fontSize: '0.72rem', color: '#065f46',
                          fontWeight: 600,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {result.plant_info?.description && (
                    <div>
                      <SectionLabel icon="📖" text="About" />
                      <p style={{
                        fontFamily: fontBody,
                        fontSize: '0.84rem', color: '#047857',
                        lineHeight: 1.8,
                      }}>{result.plant_info.description}</p>
                    </div>
                  )}

                  {result.plant_info?.medicinal_uses?.length > 0 && (
                    <div>
                      <SectionLabel icon="💊" text="Medicinal Uses" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {result.plant_info.medicinal_uses.map((use, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: '10px',
                              padding: '10px 12px',
                              ...liquidGlass(0.3, 8),
                              border: '1px solid rgba(255,255,255,0.45)',
                              borderRadius: '12px',
                              transition: 'all 0.2s',
                              boxShadow: glassInset,
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(236,253,245,0.6)'
                              e.currentTarget.style.borderColor = 'rgba(167,243,208,0.5)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
                            }}
                          >
                            <span style={{
                              width: '4px', height: '4px',
                              background: accent,
                              borderRadius: '50%',
                              marginTop: '8px',
                              flexShrink: 0,
                            }} />
                            <span style={{
                              fontFamily: fontBody,
                              fontSize: '0.82rem', color: '#065f46',
                              lineHeight: 1.6,
                            }}>{use}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.top_3_predictions?.length > 1 && (
                    <div>
                      <SectionLabel icon="📊" text="Top Predictions" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.top_3_predictions.map((pred, i) => (
                          <div key={i}>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              marginBottom: '5px',
                            }}>
                              <span style={{
                                fontFamily: fontBody,
                                fontSize: '0.78rem', color: '#065f46',
                                fontWeight: 500,
                              }}>{pred.plant_name}</span>
                              <span style={{
                                fontFamily: fontMono,
                                fontSize: '0.72rem', color: accent,
                                fontWeight: 600,
                              }}>{pred.confidence.toFixed(1)}%</span>
                            </div>
                            <div style={{
                              height: '4px',
                              ...liquidGlass(0.3, 4),
                              borderRadius: '999px',
                              overflow: 'hidden',
                            }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pred.confidence}%` }}
                                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                  height: '100%', borderRadius: '999px',
                                  background: i === 0
                                    ? 'linear-gradient(90deg, #10b981, #059669)'
                                    : i === 1
                                    ? '#34d399'
                                    : '#a7f3d0',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{
                    padding: '10px 14px',
                    ...liquidGlass(0.4, 8),
                    border: '1px solid rgba(253,230,138,0.5)',
                    borderRadius: '10px',
                    fontSize: '0.68rem',
                    color: '#92400e',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    fontFamily: fontBody,
                  }}>
                    ⚠ AI prediction. Always consult a qualified herbalist for identification.
                  </div>

                  <LiquidButton onClick={reset} label="Scan Another Plant" icon="↻" variant="ghost" />
                </motion.div>
              )}

              {/* ════ REJECTED ════ */}
              {stage === REJECTED && result && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '20px',
                    padding: '36px 0', textAlign: 'center',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: '48px' }}
                  >🍂</motion.div>

                  <h3 style={{
                    fontFamily: fontDisplay,
                    fontSize: '1.3rem', fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#b45309',
                  }}>Not Recognized</h3>

                  <p style={{
                    fontFamily: fontBody,
                    fontSize: '0.86rem', color: '#6b7280',
                    maxWidth: '320px', lineHeight: 1.7,
                  }}>{result.rejection_reason}</p>

                  <div style={{
                    display: 'flex', gap: '24px',
                    padding: '14px 28px',
                    ...liquidGlass(0.45, 12),
                    border: '1px solid rgba(253,230,138,0.5)',
                    borderRadius: '16px',
                    boxShadow: glassInset,
                  }}>
                    {[
                      { label: 'Confidence', value: `${result.confidence?.toFixed(1)}%` },
                      { label: 'Entropy', value: result.entropy_ratio?.toFixed(3) },
                    ].map((s, i) => (
                      <div key={s.label} style={{
                        textAlign: 'center',
                        paddingLeft: i > 0 ? '24px' : 0,
                        borderLeft: i > 0 ? '1px solid rgba(253,230,138,0.4)' : 'none',
                      }}>
                        <p style={{
                          fontFamily: fontMono,
                          fontSize: '0.55rem', color: '#9ca3af',
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          fontWeight: 600, marginBottom: '3px',
                        }}>{s.label}</p>
                        <p style={{
                          fontFamily: fontMono,
                          fontSize: '0.95rem', fontWeight: 700, color: '#b45309',
                        }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    width: '100%', textAlign: 'left',
                    padding: '14px 16px',
                    ...liquidGlass(0.35, 12),
                    border: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: '14px',
                    boxShadow: glassInset,
                  }}>
                    <p style={{
                      fontFamily: fontBody,
                      fontSize: '0.7rem', fontWeight: 700,
                      color: accent, marginBottom: '10px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>Tips for better results</p>
                    <ul style={{
                      listStyle: 'none', padding: 0, margin: 0,
                      display: 'flex', flexDirection: 'column', gap: '5px',
                    }}>
                      {[
                        'Use a clear, well-lit photo',
                        'Focus on leaves or flowers',
                        'Avoid blurry images',
                        'Fill the frame with the plant',
                      ].map((tip, i) => (
                        <li key={i} style={{
                          fontFamily: fontBody,
                          fontSize: '0.78rem', color: '#047857',
                          paddingLeft: '16px', position: 'relative',
                          lineHeight: 1.5,
                        }}>
                          <span style={{
                            position: 'absolute', left: 0,
                            width: '4px', height: '4px',
                            background: '#10b981',
                            borderRadius: '50%',
                            top: '8px',
                          }} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <LiquidButton onClick={reset} label="Try Another Image" variant="accent" />
                </motion.div>
              )}

              {/* ════ ERROR ════ */}
              {stage === ERROR && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '18px',
                    padding: '40px 0', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '44px' }}>🥀</div>
                  <h3 style={{
                    fontFamily: fontDisplay,
                    fontSize: '1.2rem', fontWeight: 400,
                    fontStyle: 'italic', color: '#dc2626',
                  }}>Something Went Wrong</h3>
                  <p style={{
                    fontFamily: fontBody,
                    fontSize: '0.84rem', color: '#6b7280',
                    maxWidth: '300px', lineHeight: 1.7,
                  }}>{error}</p>
                  <LiquidButton onClick={reset} label="Try Again" variant="accent" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Reusable Section Label ── */
function SectionLabel({ icon, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      marginBottom: '10px',
    }}>
      <span style={{ fontSize: '11px' }}>{icon}</span>
      <span style={{
        fontFamily: fontMono,
        fontSize: '0.6rem', fontWeight: 600,
        color: accent, letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>{text}</span>
      <div style={{
        flex: 1, height: '1px',
        background: 'linear-gradient(to right, rgba(209,250,229,0.5), transparent)',
      }} />
    </div>
  )
}

/* ── Reusable Liquid Glass Button ── */
function LiquidButton({ onClick, label, icon, variant = 'ghost' }) {
  const isAccent = variant === 'accent'
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        boxShadow: isAccent
          ? '0 12px 40px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
          : '0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: '100%', padding: '13px',
        background: isAccent ? 'rgba(5,150,105,0.88)' : 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${isAccent ? 'rgba(110,231,160,0.3)' : 'rgba(255,255,255,0.6)'}`,
        borderRadius: '14px',
        color: isAccent ? '#fff' : '#047857',
        fontFamily: fontBody,
        fontSize: '0.85rem', fontWeight: 600,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'all 0.3s',
        boxShadow: isAccent
          ? '0 4px 16px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
          : `0 2px 12px rgba(0,0,0,0.04), ${glassInset}`,
      }}
    >
      {icon && <span style={{ fontSize: '14px' }}>{icon}</span>}
      {label}
    </motion.button>
  )
}
