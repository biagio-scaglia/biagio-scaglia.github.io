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
      <div style={{ padding: windowWidth <= 480 ? '15px' : '20px' }}>
        <h2 style={{ marginTop: 0, fontSize: windowWidth <= 480 ? '16px' : '18px', marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>Scegli uno sfondo</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: windowWidth <= 480 
            ? 'repeat(2, 1fr)' 
            : windowWidth <= 768 
              ? 'repeat(3, 1fr)' 
              : 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: windowWidth <= 480 ? '10px' : '16px', 
          marginBottom: windowWidth <= 480 ? '15px' : '20px' 
        }}>
          {loadedBackgrounds.map((bg, index) => (
            <div
              key={index}
              onClick={() => setSelectedBackground(index)}
              style={{
                aspectRatio: '4/3',
                background: bg.type === 'image' && !bg.url.startsWith('linear-gradient') ? `url(${bg.url})` : bg.url.startsWith('linear-gradient') ? bg.url : '#000',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: selectedBackground === index ? '3px solid #0078d4' : '2px solid #c0c0c0',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (selectedBackground !== index) {
                  e.currentTarget.style.borderColor = '#0078d4'
                }
                // Avvia la preview del video quando si passa sopra
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
                  e.currentTarget.style.borderColor = '#c0c0c0'
                }
                // Ferma la preview del video quando si esce
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
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    const video = e.currentTarget
                    video.currentTime = 0
                    video.play().catch(() => {})
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget
                    video.pause()
                    video.currentTime = 0
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
                      <Windows7Spinner size={32} />
                    </div>
                  )}
                  <img
                    src={bg.url.startsWith('linear-gradient') ? undefined : bg.url}
                    alt={bg.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
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
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                padding: windowWidth <= 480 ? '4px' : '6px',
                fontSize: windowWidth <= 480 ? '10px' : '11px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                {bg.type === 'video' && (
                  <i className="fas fa-video" style={{ fontSize: windowWidth <= 480 ? '9px' : '10px' }}></i>
                )}
                <span>{bg.name}</span>
              </div>
              {selectedBackground === index && (
                <div style={{
                  position: 'absolute',
                  top: windowWidth <= 480 ? '6px' : '8px',
                  right: windowWidth <= 480 ? '6px' : '8px',
                  background: '#0078d4',
                  borderRadius: '50%',
                  width: windowWidth <= 480 ? '20px' : '24px',
                  height: windowWidth <= 480 ? '20px' : '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}>
                  <i className="fas fa-check" style={{ fontSize: windowWidth <= 480 ? '10px' : '12px' }}></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Slideshow Settings */}
        <div style={{ 
          marginBottom: windowWidth <= 480 ? '15px' : '20px',
          padding: windowWidth <= 480 ? '12px' : '16px',
          background: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: windowWidth <= 480 ? '12px' : '16px', fontSize: windowWidth <= 480 ? '14px' : '16px' }}>
            Slideshow Sfondi
          </h3>
          
          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="slideshow-enabled"
              checked={localSlideshowEnabled}
              onChange={(e) => setLocalSlideshowEnabled(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="slideshow-enabled" style={{ fontSize: windowWidth <= 480 ? '12px' : '13px', cursor: 'pointer' }}>
              Attiva slideshow automatico
            </label>
          </div>

          {localSlideshowEnabled && (
            <div style={{ marginTop: windowWidth <= 480 ? '10px' : '12px' }}>
              <label htmlFor="slideshow-seconds" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: windowWidth <= 480 ? '12px' : '13px' 
              }}>
                Secondi tra le immagini: {localSlideshowSeconds}
              </label>
              <input
                type="range"
                id="slideshow-seconds"
                min="2"
                max="30"
                value={localSlideshowSeconds}
                onChange={(e) => setLocalSlideshowSeconds(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: windowWidth <= 480 ? '10px' : '11px',
                color: '#666',
                marginTop: '4px'
              }}>
                <span>2s</span>
                <span>30s</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: windowWidth <= 480 ? '8px' : '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ fontSize: windowWidth <= 480 ? '12px' : '14px', padding: windowWidth <= 480 ? '8px 16px' : '10px 20px' }}>Annulla</button>
          <button onClick={handleApply} style={{ fontSize: windowWidth <= 480 ? '12px' : '14px', padding: windowWidth <= 480 ? '8px 16px' : '10px 20px' }}>Applica</button>
        </div>
      </div>
    </Window>
  )
}

