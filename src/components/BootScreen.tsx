import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import bootupSound from '../assets/sound/bootup.mp3'
import bootBackground from '../assets/sfondo-avvio.jpeg'

interface BootScreenProps {
  onComplete: (userName: string) => void
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)
  const soundRef = useRef<Howl | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [userName, setUserName] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  // Inizializza l'audio con Howler
  useEffect(() => {
    const sound = new Howl({
      src: [bootupSound],
      volume: 0.5,
      preload: true,
      html5: false, // Usa Web Audio API quando disponibile
    })
    
    soundRef.current = sound

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current.unload()
      }
    }
  }, [])

  // Gestione progresso e riproduzione audio
  useEffect(() => {
    const duration = 8000 // 8 secondi
    const interval = 50 // Aggiorna ogni 50ms per animazione fluida
    const increment = 100 / (duration / interval)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setProgress(100)
          setIsComplete(true)
          return 100
        }
        return newProgress
      })
    }, interval)

    // Fallback: dopo 8 secondi completa comunque
    const timeout = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setIsComplete(true)
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        backgroundImage: `url(${bootBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000,
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        color: '#e0e0e0',
      }}
    >
      {/* Overlay scuro per leggibilità */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Logo/Icona */}
      <div style={{ marginBottom: '40px', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ marginBottom: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          <i className="fab fa-windows" style={{ fontSize: 'clamp(48px, 10vw, 64px)', color: '#ffffff' }}></i>
        </div>
        <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Portfolio OS
        </div>
        <div style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#b0b0b0', opacity: 0.9 }}>
          Versione 7.0
        </div>
      </div>

      {/* Spinner */}
      {!isComplete && (
        <div style={{ marginBottom: '30px' }}>
          <div className="spinner animate" aria-label="Caricamento sistema..." style={{ width: 'clamp(24px, 6vw, 32px)', height: 'clamp(24px, 6vw, 32px)' }} />
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ width: 'min(400px, 90vw)', marginBottom: '20px', padding: '0 20px' }}>
        <div role="progressbar" className="animate" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%' }}>
          <div style={{ width: `${progress}%`, height: 'clamp(20px, 4vw, 24px)' }} />
        </div>
        <div style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#d0d0d0', marginTop: '8px', textAlign: 'center', fontWeight: '500' }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Loading Text */}
      {!isComplete && (
        <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#c0c0c0', textAlign: 'center', padding: '0 20px', fontWeight: '400' }}>
          Sistema operativo in avvio...
        </div>
      )}

      {/* Input Nome Utente */}
      {isComplete && !showWelcome && (
        <div style={{ marginTop: '30px', textAlign: 'center', width: 'min(400px, 90vw)', padding: '0 20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="userNameInput"
              style={{ 
                display: 'block', 
                fontSize: 'clamp(13px, 3vw, 15px)', 
                color: '#ffffff', 
                marginBottom: '8px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              Inserisci il tuo nome:
            </label>
            <input
              id="userNameInput"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userName.trim()) {
                  setShowWelcome(true)
                }
              }}
              placeholder="Nome utente"
              autoFocus
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 12px)',
                fontSize: 'clamp(13px, 3vw, 15px)',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                border: '2px inset #c0c0c0',
                backgroundColor: '#ffffff',
                color: '#000000',
                outline: 'none',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)',
              }}
            />
          </div>
          <button
            onClick={() => {
              if (userName.trim()) {
                setShowWelcome(true)
              }
            }}
            disabled={!userName.trim()}
            style={{
              padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)',
              fontSize: 'clamp(13px, 3vw, 15px)',
              fontWeight: 'bold',
              background: userName.trim() 
                ? 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)'
                : 'linear-gradient(to bottom, #b0b0b0 0%, #989898 50%, #808080 100%)',
              color: '#000000',
              border: '1px outset #e0e0e0',
              borderRadius: '0',
              cursor: userName.trim() ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition: 'all 0.15s',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              opacity: userName.trim() ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (userName.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 50%, #c0c0c0 100%)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (userName.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)'
              }
            }}
            onMouseDown={(e) => {
              if (userName.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #b8b8b8 0%, #d0d0d0 50%, #e8e8e8 100%)'
                e.currentTarget.style.border = '1px inset #c0c0c0'
                e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3)'
              }
            }}
            onMouseUp={(e) => {
              if (userName.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)'
                e.currentTarget.style.border = '1px outset #e0e0e0'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)'
              }
            }}
          >
            Entra
          </button>
        </div>
      )}

      {/* Messaggio Benvenuto */}
      {showWelcome && (
        <div style={{ marginTop: '30px', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ 
            fontSize: 'clamp(16px, 4vw, 20px)', 
            color: '#ffffff', 
            marginBottom: '20px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            Benvenuto, {userName || 'Guest'}!
          </div>
          <button
            onClick={async () => {
              // Riproduci il suono con Howler
              if (soundRef.current) {
                try {
                  soundRef.current.stop() // Ferma se già in riproduzione
                  soundRef.current.seek(0) // Torna all'inizio
                  soundRef.current.play()
                } catch (err) {
                  console.log('Errore riproduzione audio:', err)
                }
              }
              // Completa dopo un breve delay
              setTimeout(() => {
                onComplete(userName || 'Guest')
              }, 300)
            }}
            style={{
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)',
              color: '#000000',
              border: '1px outset #e0e0e0',
              borderRadius: '0',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition: 'all 0.15s',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 50%, #c0c0c0 100%)'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #b8b8b8 0%, #d0d0d0 50%, #e8e8e8 100%)'
              e.currentTarget.style.border = '1px inset #c0c0c0'
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)'
              e.currentTarget.style.border = '1px outset #e0e0e0'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            Avvia il Portfolio
          </button>
        </div>
      )}
      </div>
    </div>
  )
}
