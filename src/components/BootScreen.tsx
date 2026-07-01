import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import bootupSound from '../assets/sound/bootup.mp3'
import bootBackground from '../assets/sfondo-avvio.jpeg'
import Windows7Spinner from './Windows7Spinner'
import bsLogo from '../assets/BS.png'

interface BootScreenProps {
  onComplete: (userName: string) => void
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)
  const soundRef = useRef<Howl | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [userName, setUserName] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const sound = new Howl({
      src: [bootupSound],
      volume: 0.5,
      preload: true,
      html5: false,
    })
    
    soundRef.current = sound

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current.unload()
      }
    }
  }, [])

  // Gestione progresso della barra di avvio
  useEffect(() => {
    const duration = 3000 // 3 secondi per apprezzare l'animazione di avvio
    const interval = 50
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

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  // Esegui l'accesso quando l'utente conferma il nome
  const handleLogin = () => {
    const finalName = userName.trim() || 'Ospite'
    setShowWelcome(true)

    // Avvia il suono di logon di Windows 7
    if (soundRef.current) {
      try {
        soundRef.current.stop()
        soundRef.current.seek(0)
        soundRef.current.play()
      } catch (err) {
        console.log('Errore audio logon:', err)
      }
    }

    // Passa alla dashboard dopo 2.5 secondi (fine della traccia sonora)
    setTimeout(() => {
      onComplete(finalName)
    }, 2500)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        zIndex: 20000,
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Iniezione Stili CSS Animazione Boot e Pulsanti */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orb-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 15px rgba(255,255,255,0.8)); }
        }
        .boot-orb-container {
          position: relative;
          width: 80px;
          height: 80px;
          animation: orb-rotate 4s linear infinite;
        }
        .boot-orb {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          filter: blur(1px);
        }
        .orb-red { background: #ff4b4b; top: 12px; left: 33px; box-shadow: 0 0 10px #ff4b4b; }
        .orb-green { background: #4bff4b; bottom: 12px; left: 33px; box-shadow: 0 0 10px #4bff4b; }
        .orb-blue { background: #4b4bff; top: 33px; left: 12px; box-shadow: 0 0 10px #4b4bff; }
        .orb-yellow { background: #ffff4b; top: 33px; right: 12px; box-shadow: 0 0 10px #ffff4b; }
        
        .logo-pulse {
          animation: orb-pulse 2s ease-in-out infinite;
        }
        
        .logon-input::placeholder {
          color: #a0aec0;
          font-style: italic;
        }
      `}} />

      {/* 1. SCHERMATA DI AVVIO NATIVA (Boot Loader) */}
      {!isComplete && (
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px'
        }}>
          {/* Orb animate di avvio di Windows 7 */}
          <div className="logo-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="boot-orb-container">
              <div className="boot-orb orb-red" />
              <div className="boot-orb orb-green" />
              <div className="boot-orb orb-blue" />
              <div className="boot-orb orb-yellow" />
            </div>
            <div style={{ marginTop: '20px', color: '#fff', fontSize: '13px', letterSpacing: '2px', fontWeight: '500' }}>
              PORTFOLIO OS
            </div>
          </div>

          {/* Barra di progresso sottile */}
          <div style={{ width: '220px', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', border: '1px solid #444' }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(to right, #52c41a, #a0d911)',
              boxShadow: '0 0 8px #52c41a',
              transition: 'width 0.1s ease-out'
            }} />
          </div>

          <div style={{ color: '#888', fontSize: '12px' }}>
            Avvio di Windows...
          </div>
        </div>
      )}

      {/* 2. SCHERMATA DI LOGON / BENVENUTO (Logon Screen) */}
      {isComplete && (
        <div
          style={{
            height: '100%',
            backgroundImage: `url(${bootBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Overlay di vetro e luce */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1
          }} />

          {/* Card Centrale di Logon */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '280px'
          }}>
            
            {/* Foto Profilo Utente */}
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '8px',
              border: '3px solid rgba(255,255,255,0.7)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.1)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src={bsLogo} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            {/* Nome utente / Stato di Welcome */}
            {!showWelcome ? (
              <>
                <div style={{
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '500',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  marginBottom: '15px'
                }}>
                  Biagio Scaglia
                </div>

                {/* Password Input Box (Simulata per il Nome Utente) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  background: '#fff',
                  border: '1px solid #7f9db9',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2) inset, 0 1px 0 rgba(255,255,255,0.2)',
                  padding: '2px',
                  boxSizing: 'border-box'
                }}>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin()
                      }
                    }}
                    placeholder="Scrivi il tuo nome..."
                    className="logon-input"
                    autoFocus
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      padding: '6px 10px',
                      fontSize: '13px',
                      color: '#333',
                      fontFamily: 'Segoe UI, Tahoma, sans-serif'
                    }}
                  />
                  {/* Pulsante freccia blu login */}
                  <button
                    onClick={handleLogin}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: 'linear-gradient(to bottom, #a0c0e0 0%, #3a75a7 50%, #21598a 100%)',
                      border: '1px solid #1d4b75',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      transition: 'all 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom, #b8d2ec 0%, #4686be 50%, #2c6da3 100%)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom, #a0c0e0 0%, #3a75a7 50%, #21598a 100%)'}
                  >
                    <i className="fas fa-arrow-right" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
                
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  Premi Invio per accedere
                </div>
              </>
            ) : (
              /* Messaggio di Benvenuto in Logon */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  color: '#fff',
                  fontSize: '22px',
                  fontWeight: '300',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span>Benvenuto</span>
                  <Windows7Spinner size={24} />
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                  {userName.trim() || 'Ospite'}
                </div>
              </div>
            )}

          </div>

          {/* Footer Logon Screen */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            zIndex: 2,
            textAlign: 'center',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            opacity: 0.95
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.5px' }}>
              Windows 7
            </div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px', opacity: 0.7 }}>
              Professional
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
