import { useState, useEffect } from 'react'
import Window from './Window'

interface BrowserWindowProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

export default function BrowserWindow({ onClose, onMinimize, icon }: BrowserWindowProps) {
  const [url, setUrl] = useState('https://biagio-scaglia.github.io/')
  const [currentUrl, setCurrentUrl] = useState('https://biagio-scaglia.github.io/')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const isEmbeddable = (targetUrl: string) => {
    const cleanUrl = targetUrl.toLowerCase().trim()
    return cleanUrl.includes('biagio-scaglia.github.io') || cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')
  }

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavigate = () => {
    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('localhost') && !targetUrl.startsWith('127.0.0.1')) {
      targetUrl = 'https://' + targetUrl
    }
    setCurrentUrl(targetUrl)
    setUrl(targetUrl)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate()
    }
  }

  const quickLinks = [
    { name: 'Portfolio 🔗', url: 'https://biagio-scaglia.github.io/', isExternal: false },
    { name: 'Google', url: 'https://www.google.com', isExternal: false },
    { name: 'GitHub', url: 'https://github.com/biagio-scaglia', isExternal: true },
    { name: 'Mozilla', url: 'https://www.mozilla.org', isExternal: false },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/biagio-scaglia/', isExternal: true },
  ]

  return (
    <Window
      title="Mozilla Firefox"
      width={windowWidth <= 480 ? Math.min(400, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(700, window.innerWidth - 40) : 900}
      height={windowWidth <= 480 ? Math.min(500, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(600, window.innerHeight - 80) : 700}
      defaultPosition={{ x: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 150, y: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 100 }}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
    >
      <div style={{ 
        padding: windowWidth <= 480 ? '10px' : '15px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        gap: '10px'
      }}>
        {/* Barra degli strumenti del browser */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '8px', 
          padding: '10px',
          background: '#f0f0f0',
          borderRadius: '4px'
        }}>
          {/* Barra indirizzo */}
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <button
              onClick={() => handleNavigate()}
              style={{
                padding: windowWidth <= 480 ? '6px 8px' : '6px 12px',
                background: '#e0e0e0',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                whiteSpace: 'nowrap'
              }}
            >
              {windowWidth <= 480 ? '🔄' : '🔄 Aggiorna'}
            </button>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Inserisci URL..."
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: windowWidth <= 480 ? '16px' : '12px',
                border: '2px inset #c0c0c0',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                minWidth: '0'
              }}
            />
            <button
              onClick={handleNavigate}
              style={{
                padding: windowWidth <= 480 ? '6px 8px' : '6px 12px',
                background: '#e0e0e0',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                whiteSpace: 'nowrap'
              }}
            >
              Vai →
            </button>
          </div>

          {/* Link rapidi */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {quickLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  if (link.isExternal) {
                    // Apri il profilo reale in una nuova scheda
                    window.open(link.url, '_blank')
                    // Mostra anche nel browser simulato
                    setUrl(link.url)
                    setCurrentUrl(link.url)
                  } else {
                    // Solo mostra nel browser simulato
                    setUrl(link.url)
                    setCurrentUrl(link.url)
                  }
                }}
                style={{
                  padding: '4px 8px',
                  background: link.isExternal ? '#0078d4' : '#e0e0e0',
                  color: link.isExternal ? '#fff' : '#000',
                  border: '1px solid #c0c0c0',
                  cursor: 'pointer',
                  fontSize: windowWidth <= 480 ? '10px' : '11px',
                  borderRadius: '2px',
                  fontWeight: link.isExternal ? 'bold' : 'normal'
                }}
                title={link.isExternal ? `Apri ${link.name} in una nuova scheda` : `Mostra ${link.name}`}
              >
                {link.name} {link.isExternal && '🔗'}
              </button>
            ))}
          </div>
        </div>

        {/* Area contenuto browser */}
        <div style={{ 
          flex: 1, 
          border: '2px solid #c0c0c0',
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#ffffff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {isEmbeddable(currentUrl) ? (
            <iframe
              src={currentUrl}
              title="Browser Content"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#fff'
              }}
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              height: '100%',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: windowWidth <= 480 ? '48px' : '64px', marginBottom: '20px' }}>
                  🦊
                </div>
                <h2 style={{ 
                  fontSize: windowWidth <= 480 ? '18px' : '24px', 
                  marginBottom: '10px',
                  color: '#333'
                }}>
                  Mozilla Firefox
                </h2>
                <p style={{ 
                  fontSize: windowWidth <= 480 ? '12px' : '14px', 
                  color: '#666',
                  marginBottom: '20px'
                }}>
                  Browser simulato
                </p>
                <div style={{ 
                  padding: '15px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  fontSize: windowWidth <= 480 ? '11px' : '12px',
                  color: '#333',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <p style={{ margin: '0 0 10px 0' }}>
                    <strong>URL corrente:</strong>
                  </p>
                  <p style={{ 
                    margin: 0, 
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    color: '#0078d4'
                  }}>
                    {currentUrl}
                  </p>
                </div>
                <div style={{ 
                  marginTop: '30px',
                  padding: '15px',
                  background: '#fff3cd',
                  borderRadius: '4px',
                  fontSize: windowWidth <= 480 ? '11px' : '12px',
                  color: '#856404',
                  maxWidth: '500px',
                  margin: '30px auto 0'
                }}>
                  ⚠️ Questo è un browser simulato. Non è possibile navigare su siti reali che bloccano il caricamento in iframe.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra di stato */}
        <div style={{ 
          padding: '6px 10px',
          background: '#f0f0f0',
          borderRadius: '4px',
          fontSize: windowWidth <= 480 ? '10px' : '11px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Pronto | {currentUrl}
        </div>
      </div>
    </Window>
  )
}

