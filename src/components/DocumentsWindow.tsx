import { useState, useEffect } from 'react'
import Window from './Window'
import Windows7Spinner from './Windows7Spinner'
import curriculumPDF from '../assets/Curriculum Vitae - Biagio Scaglia.pdf'
import fiammaImg from '../assets/fiamma.jpg'
import zoeImg from '../assets/zoe.jpg'
import bariImg from '../assets/Bari.jpg'

interface DocumentsWindowProps {
  onClose: () => void
  onMinimize?: () => void
}

export default function DocumentsWindow({ onClose, onMinimize }: DocumentsWindowProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleOpenPDF = () => {
    window.open(curriculumPDF, '_blank')
  }

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
  }

  const images = [
    { name: 'Fiamma', src: fiammaImg },
    { name: 'Zoe', src: zoeImg },
    { name: 'Bari', src: bariImg },
  ]

  return (
    <Window
      title="Documenti"
      width={700}
      height={600}
      defaultPosition={{ x: 150, y: 100 }}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div style={{ padding: windowWidth <= 480 ? '15px' : '20px' }}>
        <h2 style={{ marginTop: 0, fontSize: windowWidth <= 480 ? '16px' : '18px', marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>I miei documenti</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: windowWidth <= 480 ? '12px' : '16px' }}>
          {/* PDF Document */}
          <div
            onClick={handleOpenPDF}
            style={{
              padding: windowWidth <= 480 ? '12px' : '16px',
              border: '1px solid #c0c0c0',
              background: '#f0f0f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: windowWidth <= 480 ? '10px' : '12px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e8e8e8'
              e.currentTarget.style.borderColor = '#a0a0a0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0f0f0'
              e.currentTarget.style.borderColor = '#c0c0c0'
            }}
          >
            <i className="fas fa-file-pdf" style={{ fontSize: windowWidth <= 480 ? '24px' : '32px', color: '#d32f2f' }}></i>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: windowWidth <= 480 ? '12px' : '14px', marginBottom: '4px' }}>
                Curriculum Vitae - Biagio Scaglia
              </div>
              <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#666' }}>
                PDF Document
              </div>
            </div>
            <i className="fas fa-external-link-alt" style={{ fontSize: windowWidth <= 480 ? '12px' : '14px', color: '#666' }}></i>
          </div>

          {/* Immagini */}
          <div>
            <h3 style={{ fontSize: windowWidth <= 480 ? '13px' : '14px', marginBottom: windowWidth <= 480 ? '10px' : '12px', fontWeight: 'bold' }}>Immagini</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: windowWidth <= 480 
                ? 'repeat(2, 1fr)' 
                : windowWidth <= 768 
                  ? 'repeat(3, 1fr)' 
                  : 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: windowWidth <= 480 ? '8px' : '12px' 
            }}>
              {images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(img.src)}
                  style={{
                    border: '1px solid #c0c0c0',
                    background: '#f0f0f0',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#a0a0a0'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#c0c0c0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {loadingImages[img.src] && (
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
                    src={img.src}
                    alt={img.name}
                    style={{
                      width: '100%',
                      height: windowWidth <= 480 ? '100px' : '120px',
                      objectFit: 'cover',
                      display: loadingImages[img.src] ? 'none' : 'block',
                    }}
                    onLoadStart={() => {
                      setLoadingImages(prev => ({ ...prev, [img.src]: true }))
                    }}
                    onLoad={() => {
                      setLoadingImages(prev => ({ ...prev, [img.src]: false }))
                    }}
                    onError={() => {
                      setLoadingImages(prev => ({ ...prev, [img.src]: false }))
                    }}
                  />
                  <div style={{
                    padding: windowWidth <= 480 ? '6px' : '8px',
                    background: '#f0f0f0',
                    fontSize: windowWidth <= 480 ? '11px' : '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                    {img.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal per immagine selezionata */}
        {selectedImage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              cursor: 'pointer',
            }}
            onClick={() => setSelectedImage(null)}
          >
            {selectedImage && (
              <>
                {loadingImages[selectedImage] && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}>
                    <Windows7Spinner size={48} />
                  </div>
                )}
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    display: loadingImages[selectedImage] ? 'none' : 'block',
                  }}
                  onLoadStart={() => {
                    setLoadingImages(prev => ({ ...prev, [selectedImage]: true }))
                  }}
                  onLoad={() => {
                    setLoadingImages(prev => ({ ...prev, [selectedImage]: false }))
                  }}
                  onError={() => {
                    setLoadingImages(prev => ({ ...prev, [selectedImage]: false }))
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </Window>
  )
}

