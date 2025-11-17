import { useState, useMemo, useEffect } from 'react'
import Window from './Window'
import Windows7Spinner from './Windows7Spinner'
import defaultBackground from '../assets/sfondo.jpg'

// Carica dinamicamente tutti i file jpg dalla cartella sfondo
const backgroundImages = import.meta.glob('../assets/sfondo/*.jpg', { eager: true }) as Record<string, { default: string }>

interface ImagesWindowProps {
  onClose: () => void
  onBackgroundChange: (background: string) => void
  currentBackground: string
  isSlideshowEnabled?: boolean
  slideshowIntervalSeconds?: number
  onSlideshowChange?: (enabled: boolean, seconds: number) => void
  onMinimize?: () => void
}

export default function ImagesWindow({ 
  onClose, 
  onBackgroundChange, 
  currentBackground,
  isSlideshowEnabled = false,
  slideshowIntervalSeconds = 5,
  onSlideshowChange,
  onMinimize
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

  const backgrounds = useMemo(() => {
    const sfondi = [
      { name: 'Sfondo Default', url: defaultBackground },
    ]
    
    // Ordina i file per nome (numerico)
    const sortedFiles = Object.entries(backgroundImages)
      .map(([path, module]) => {
        const fileName = path.split('/').pop()?.replace('.jpg', '') || ''
        const numMatch = fileName.match(/\d+/)
        const num = numMatch ? parseInt(numMatch[0]) : 999
        return {
          path,
          url: module.default,
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
      .map((file) => ({
        name: `Sfondo ${file.name}`,
        url: file.url
      }))
    
    sfondi.push(...sortedFiles)
    return sfondi
  }, [])

  const [selectedBackground, setSelectedBackground] = useState(0)
  
  // Aggiorna lo stato quando cambia currentBackground
  useEffect(() => {
    const index = backgrounds.findIndex(bg => bg.url === currentBackground)
    if (index >= 0) {
      setSelectedBackground(index)
    }
  }, [currentBackground, backgrounds])

  const handleApply = () => {
    if (selectedBackground >= 0 && selectedBackground < backgrounds.length) {
      onBackgroundChange(backgrounds[selectedBackground].url)
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
          {backgrounds.map((bg, index) => (
            <div
              key={index}
              onClick={() => setSelectedBackground(index)}
              style={{
                aspectRatio: '4/3',
                background: bg.url.startsWith('linear-gradient') ? bg.url : `url(${bg.url})`,
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
              }}
              onMouseLeave={(e) => {
                if (selectedBackground !== index) {
                  e.currentTarget.style.borderColor = '#c0c0c0'
                }
              }}
            >
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
              }}>
                {bg.name}
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

