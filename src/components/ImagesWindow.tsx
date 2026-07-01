import { useState, useEffect, useRef } from 'react'
import Window from './Window'
import Windows7Spinner from './Windows7Spinner'
import defaultBackground from '../assets/sfondo.jpg'
import sfondoVideo from '../assets/sfondo/sfondo video.mp4'

// Carica dinamicamente tutti i file jpg dalla cartella sfondo (lazy loading)
const backgroundImages = import.meta.glob('../assets/sfondo/*.jpg', { eager: false }) as Record<string, () => Promise<{ default: string }>>

interface BackgroundItem {
  name: string
  url: string
  type: 'image' | 'video'
}

interface ImagesWindowProps {
  onClose: () => void
  onBackgroundChange: (background: string, type?: 'image' | 'video') => void
  currentBackground: string
  isSlideshowEnabled?: boolean
  slideshowIntervalSeconds?: number
  onSlideshowChange?: (enabled: boolean, seconds: number) => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

export default function ImagesWindow({ 
  onClose, 
  onBackgroundChange, 
  currentBackground,
  isSlideshowEnabled = false,
  slideshowIntervalSeconds = 5,
  onSlideshowChange,
  onMinimize,
  icon,
}: ImagesWindowProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [localSlideshowEnabled, setLocalSlideshowEnabled] = useState(isSlideshowEnabled)
  const [localSlideshowSeconds, setLocalSlideshowSeconds] = useState(slideshowIntervalSeconds)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [loadedBackgrounds, setLoadedBackgrounds] = useState<BackgroundItem[]>([
    { name: 'Sfondo Default', url: defaultBackground, type: 'image' },
    { name: 'Sfondo Video Animato', url: sfondoVideo, type: 'video' }
  ])
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})

  // Carica le prime 5 immagini immediatamente, le altre on-demand
  useEffect(() => {
    const sortedFiles = Object.entries(backgroundImages)
      .map(([path, loader]) => {
        const fileName = path.split('/').pop()?.replace('.jpg', '') || ''
        const numMatch = fileName.match(/\d+/)
        const num = numMatch ? parseInt(numMatch[0]) : 999
        return {
          path,
          loader,
          name: fileName,
          num
        }
      })
      .filter((file) => {
        // Rimuovi file con "Starter" nel nome
        return !file.name.toLowerCase().includes('starter')
      })
      .sort((a, b) => {
        // Ordina prima per numero, poi alfabeticamente
        if (a.num !== b.num) return a.num - b.num
        return a.name.localeCompare(b.name)
      })
    
        sortedFiles.slice(0, 5).forEach(async (file) => {
      try {
        const module = await file.loader()
        setLoadedBackgrounds((prev) => {
          if (!prev.find(bg => bg.name === `Sfondo ${file.name}`)) {
            return [...prev, { name: `Sfondo ${file.name}`, url: module.default, type: 'image' as const }]
          }
          return prev
        })
      } catch (error) {
        console.warn(`Failed to load background: ${file.path}`, error)
      }
    })
  }, [])

  // Carica le immagini rimanenti quando necessario
  useEffect(() => {
    const loadRemainingImages = async () => {
      const sortedFiles = Object.entries(backgroundImages)
        .map(([path, loader]) => {
          const fileName = path.split('/').pop()?.replace('.jpg', '') || ''
          const numMatch = fileName.match(/\d+/)
          const num = numMatch ? parseInt(numMatch[0]) : 999
          return { path, loader, name: fileName, num }
        })
        .filter((file) => !file.name.toLowerCase().includes('starter'))
        .sort((a, b) => {
          if (a.num !== b.num) return a.num - b.num
          return a.name.localeCompare(b.name)
        })
      
      // Carica le immagini rimanenti (dalla 6 in poi)
      for (const file of sortedFiles.slice(5)) {
        try {
          const module = await file.loader()
          setLoadedBackgrounds((prev) => {
            if (!prev.find(bg => bg.name === `Sfondo ${file.name}`)) {
              return [...prev, { name: `Sfondo ${file.name}`, url: module.default, type: 'image' as const }]
            }
            return prev
          })
        } catch (error) {
          console.warn(`Failed to load background: ${file.path}`, error)
        }
      }
    }
    
    // Carica le immagini rimanenti dopo un breve delay
    const timer = setTimeout(loadRemainingImages, 1000)
    return () => clearTimeout(timer)
  }, [])

  const [selectedBackground, setSelectedBackground] = useState(0)
  
  // Aggiorna lo stato quando cambia currentBackground
  useEffect(() => {
    const index = loadedBackgrounds.findIndex(bg => bg.url === currentBackground)
    if (index >= 0) {
      setSelectedBackground(index)
    }
  }, [currentBackground, loadedBackgrounds])

  const handleApply = () => {
    if (selectedBackground >= 0 && selectedBackground < loadedBackgrounds.length) {
      const selectedBg = loadedBackgrounds[selectedBackground]
      onBackgroundChange(selectedBg.url, selectedBg.type)
    }
    if (onSlideshowChange) {
      onSlideshowChange(localSlideshowEnabled, localSlideshowSeconds)
    }
    onClose()
  }

  useEffect(() => {
    setLocalSlideshowEnabled(isSlideshowEnabled)
    setLocalSlideshowSeconds(slideshowIntervalSeconds)
  }, [isSlideshowEnabled, slideshowIntervalSeconds])

  return (
    <Window
      title="Immagini - Cambio Sfondo"
      width={700}
      height={500}
      defaultPosition={{ x: 150, y: 100 }}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
    >
      <div style={{ padding: windowWidth <= 480 ? '15px' : '20px', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
        <h2 style={{ marginTop: 0, fontSize: windowWidth <= 480 ? '15px' : '16px', color: '#2b6cb0', borderBottom: '1px solid #edf2f7', paddingBottom: '6px', marginBottom: '15px' }}>
          <i className="fas fa-desktop" style={{ marginRight: '6px' }}></i> Sfondo del Desktop
        </h2>
        
        {/* Griglia Anteprime Sfondo */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: windowWidth <= 480 
            ? 'repeat(2, 1fr)' 
            : windowWidth <= 768 
              ? 'repeat(3, 1fr)' 
              : 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '12px', 
          marginBottom: '20px',
          maxHeight: '220px',
          overflowY: 'auto',
          padding: '4px'
        }}>
          {loadedBackgrounds.map((bg, index) => (
            <div
              key={index}
              onClick={() => setSelectedBackground(index)}
              style={{
                aspectRatio: '16/10',
                background: '#1a202c', // Dark monitor frame background
                border: selectedBackground === index ? '3px solid #3182ce' : '1px solid #cbd5e0',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
                overflow: 'hidden',
                boxShadow: selectedBackground === index 
                  ? '0 0 0 1px #3182ce, 0 4px 6px rgba(49, 130, 206, 0.2)' 
                  : '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                if (selectedBackground !== index) {
                  e.currentTarget.style.borderColor = '#3182ce'
                }
                if (bg.type === 'video' && videoRefs.current[index]) {
                  const video = videoRefs.current[index]
                  if (video) {
                    video.currentTime = 0
                    video.play().catch(() => {})
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (selectedBackground !== index) {
                  e.currentTarget.style.borderColor = '#cbd5e0'
                }
                if (bg.type === 'video' && videoRefs.current[index]) {
                  const video = videoRefs.current[index]
                  if (video) {
                    video.pause()
                    video.currentTime = 0
                  }
                }
              }}
            >
              {bg.type === 'video' ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el
                  }}
                  src={bg.url}
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain', // No cropping for video preview
                    display: 'block',
                  }}
                />
              ) : (
                <>
                  {loadingImages[bg.url] && !bg.url.startsWith('linear-gradient') && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                    }}>
                      <Windows7Spinner size={20} />
                    </div>
                  )}
                  <img
                    src={bg.url.startsWith('linear-gradient') ? undefined : bg.url}
                    alt={bg.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain', // No cropping for image preview
                      display: bg.url.startsWith('linear-gradient') ? 'none' : (loadingImages[bg.url] ? 'none' : 'block'),
                    }}
                    onLoadStart={() => {
                      if (!bg.url.startsWith('linear-gradient')) {
                        setLoadingImages(prev => ({ ...prev, [bg.url]: true }))
                      }
                    }}
                    onLoad={() => {
                      if (!bg.url.startsWith('linear-gradient')) {
                        setLoadingImages(prev => ({ ...prev, [bg.url]: false }))
                      }
                    }}
                    onError={() => {
                      if (!bg.url.startsWith('linear-gradient')) {
                        setLoadingImages(prev => ({ ...prev, [bg.url]: false }))
                      }
                    }}
                  />
                </>
              )}
              
              {/* Overlay Name */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
                padding: '4px 6px',
                fontSize: '9px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {bg.type === 'video' && (
                  <i className="fas fa-video" style={{ fontSize: '8px', color: '#63b3ed' }}></i>
                )}
                <span>{bg.name.replace('Sfondo ', '')}</span>
              </div>

              {/* Checkmark badge */}
              {selectedBackground === index && (
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: '#3182ce',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '8px' }}></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Slideshow Settings Box */}
        <div style={{ 
          marginBottom: '20px',
          padding: '12px 15px',
          background: '#f7fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '13px', color: '#4a5568', fontWeight: 'bold' }}>
            <i className="fas fa-images" style={{ marginRight: '6px', color: '#4299e1' }}></i> Slideshow Automatico
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="slideshow-enabled"
              checked={localSlideshowEnabled}
              onChange={(e) => setLocalSlideshowEnabled(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="slideshow-enabled" style={{ fontSize: '12px', color: '#2d3748', cursor: 'pointer', fontWeight: '600' }}>
              Cambia sfondo automaticamente
            </label>
          </div>

          {localSlideshowEnabled && (
            <div style={{ marginTop: '12px', borderTop: '1px solid #edf2f7', paddingTop: '10px' }}>
              <label htmlFor="slideshow-seconds" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '11px',
                color: '#718096'
              }}>
                Frequenza di aggiornamento: <strong>{localSlideshowSeconds} secondi</strong>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '10px', color: '#a0aec0' }}>2s</span>
                <input
                  type="range"
                  id="slideshow-seconds"
                  min="2"
                  max="30"
                  value={localSlideshowSeconds}
                  onChange={(e) => setLocalSlideshowSeconds(parseInt(e.target.value))}
                  style={{ flex: 1, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '10px', color: '#a0aec0' }}>30s</span>
              </div>
            </div>
          )}
        </div>

        {/* Pulsanti Azione */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', userSelect: 'none' }}>
          <div onClick={onClose} style={{
            padding: '6px 16px',
            background: '#fff',
            border: '1px solid #cbd5e0',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#4a5568',
            cursor: 'pointer',
            transition: 'all 0.15s',
            textAlign: 'center',
            display: 'inline-block'
          }} onMouseEnter={(e) => e.currentTarget.style.background = '#edf2f7'} onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
            Annulla
          </div>
          
          <div onClick={handleApply} style={{
            padding: '6px 18px',
            background: '#3182ce',
            border: '1px solid #3182ce',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.15s',
            textAlign: 'center',
            display: 'inline-block'
          }} onMouseEnter={(e) => e.currentTarget.style.background = '#2b6cb0'} onMouseLeave={(e) => e.currentTarget.style.background = '#3182ce'}>
            Applica
          </div>
        </div>
      </div>
    </Window>
  )
}

