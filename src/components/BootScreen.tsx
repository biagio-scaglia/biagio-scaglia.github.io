import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import bootupSound from '../assets/sound/bootup.mp3'
import bootBackground from '../assets/sfondo-avvio.jpeg'
import Windows7Spinner from './Windows7Spinner'
import userIcon from '../assets/icone/user.png'

interface BootScreenProps {
  onComplete: (userName: string) => void
}

type BiosTabType = 'main' | 'advanced' | 'security' | 'boot' | 'exit'

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [bootStage, setBootStage] = useState<'cmd' | 'bios' | 'gui' | 'logon' | 'welcome'>('cmd')
  
  // Stati per il CMD e CHKDSK
  const [renderedLines, setRenderedLines] = useState<string[]>([])
  const [showPrompt, setShowPrompt] = useState(false)
  const [showBiosPrompt, setShowBiosPrompt] = useState(true)
  const [biosCountdown, setBiosCountdown] = useState(2.0)
  
  // Tab attiva del BIOS
  const [activeTab, setActiveTab] = useState<BiosTabType>('main')
  
  // Orario BIOS in tempo reale
  const [biosTime, setBiosTime] = useState(new Date())

  const [progress, setProgress] = useState(0)
  const [userName, setUserName] = useState('')
  const soundRef = useRef<Howl | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const initialLines = [
    'Detecting hardware components...',
    'Processor: Intel Core i7-4770K @ 3.50GHz',
    'Memory: 16384 MB RAM (DDR3 Dual Channel) - PASS',
    'Storage: SSD SATA3 512GB - HEALTHY (100%)',
    'GPU: NVIDIA GeForce GTX 760 - Aero Mode Supported',
    '',
    'WARNING: The system was not shut down cleanly.',
    'A disk integrity check of C: is recommended.',
    '',
    'Do you want to run disk scan (CHKDSK) now? [Y/N]:'
  ]

  const scanLines = [
    '',
    'Starting CHKDSK on C: (Virtual File System)...',
    'Volume label is PORTFOLIO_OS.',
    '',
    'Stage 1: Examining basic file system structure...',
    '  1280 file records processed.',
    '  File verification completed.',
    '',
    'Stage 2: Examining file name linkage...',
    '  1420 index entries processed.',
    '  Index verification completed.',
    '',
    'Stage 3: Examining security descriptors...',
    '  Security descriptor verification completed.',
    '',
    'CHKDSK discovered 0 bad sectors.',
    'Windows has scanned the file system and found no problems.',
    '',
    'All scans passed. Redirecting to GUI Boot Loader...'
  ]

  const skipLines = [
    '',
    'Disk check skipped by user.',
    'Redirecting to GUI Boot Loader...'
  ]

  const biosTabs: Array<{ id: BiosTabType; label: string }> = [
    { id: 'main', label: 'Main' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'security', label: 'Security' },
    { id: 'boot', label: 'Boot' },
    { id: 'exit', label: 'Exit' }
  ]

  // Inizializza l'audio con Howler
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

  // Aggiorna l'orario del BIOS in tempo reale
  useEffect(() => {
    if (bootStage !== 'bios') return
    const timer = setInterval(() => {
      setBiosTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [bootStage])

  // Auto-scroll del terminale CMD
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [renderedLines, showPrompt, showBiosPrompt])

  // Conto alla rovescia per entrare nel BIOS
  useEffect(() => {
    if (bootStage !== 'cmd' || !showBiosPrompt) return

    const cTimer = setInterval(() => {
      setBiosCountdown((prev) => {
        const next = parseFloat((prev - 0.1).toFixed(1))
        if (next <= 0) {
          clearInterval(cTimer)
          setShowBiosPrompt(false)
          startCmdSequence()
          return 0
        }
        return next
      })
    }, 100)

    return () => clearInterval(cTimer)
  }, [bootStage, showBiosPrompt])

  // Ascolta F2 / CANC per entrare nel BIOS o ESC per uscirne, o le frecce per cambiare tab
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (bootStage === 'cmd' && showBiosPrompt) {
        if (e.key === 'F2' || e.key === 'Delete') {
          enterBios()
        }
      } else if (bootStage === 'bios') {
        if (e.key === 'Escape') {
          exitBios()
        } else if (e.key === 'ArrowRight') {
          setActiveTab((prev) => {
            const idx = biosTabs.findIndex(t => t.id === prev)
            const nextIdx = (idx + 1) % biosTabs.length
            return biosTabs[nextIdx].id
          })
        } else if (e.key === 'ArrowLeft') {
          setActiveTab((prev) => {
            const idx = biosTabs.findIndex(t => t.id === prev)
            const nextIdx = (idx - 1 + biosTabs.length) % biosTabs.length
            return biosTabs[nextIdx].id
          })
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKeys)
    return () => window.removeEventListener('keydown', handleGlobalKeys)
  }, [bootStage, showBiosPrompt])

  const enterBios = () => {
    setShowBiosPrompt(false)
    setBootStage('bios')
  }

  const exitBios = () => {
    setBootStage('cmd')
    startCmdSequence()
  }

  // Stampa sequenziale righe iniziali del CMD
  const startCmdSequence = () => {
    setRenderedLines(['Starting Portfolio OS Boot Loader...', 'Copyright (C) 2026 Biagio Scaglia. All Rights Reserved.', ''])
    let currentIdx = 0
    const printInterval = setInterval(() => {
      if (currentIdx < initialLines.length) {
        setRenderedLines((prev) => [...prev, initialLines[currentIdx]])
        currentIdx++
      } else {
        clearInterval(printInterval)
        setShowPrompt(true)
      }
    }, 55)
  }

  // Gestione Input Scelta Utente CHKDSK (Y/N)
  const handleChoice = (choice: 'Y' | 'N') => {
    if (!showPrompt) return
    setShowPrompt(false)

    setRenderedLines((prev) => {
      const copy = [...prev]
      if (copy.length > 0) {
        copy[copy.length - 1] = copy[copy.length - 1] + ' ' + choice
      }
      return copy
    })

    const targetLines = choice === 'Y' ? scanLines : skipLines
    let idx = 0

    const nextPrintInterval = setInterval(() => {
      if (idx < targetLines.length) {
        setRenderedLines((prev) => [...prev, targetLines[idx]])
        idx++
      } else {
        clearInterval(nextPrintInterval)
        setTimeout(() => {
          setBootStage('gui')
        }, 750)
      }
    }, 45)
  }

  // Listeners tastiera per avvio CMD
  useEffect(() => {
    if (!showPrompt || bootStage !== 'cmd') return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (key === 'Y' || key === 'S') {
        handleChoice('Y')
      } else if (key === 'N' || key === 'O') {
        handleChoice('N')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPrompt, bootStage])

  // Fase 2: Avanzamento barra di progresso GUI (Orb)
  useEffect(() => {
    if (bootStage !== 'gui') return

    const duration = 2800
    const interval = 50
    const increment = 100 / (duration / interval)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setBootStage('logon')
          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(progressInterval)
  }, [bootStage])

  // Esegui l'accesso al desktop
  const handleLogin = () => {
    const finalName = userName.trim() || 'Ospite'
    setBootStage('welcome')

    if (soundRef.current) {
      try {
        soundRef.current.stop()
        soundRef.current.seek(0)
        soundRef.current.play()
      } catch (err) {
        console.log('Errore audio logon:', err)
      }
    }

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
        fontFamily: 'Consolas, Monaco, monospace, Segoe UI',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orb-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 15px rgba(255,255,255,0.7)); }
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
          animation: orb-pulse 2.5s ease-in-out infinite;
        }
        
        .logon-input::placeholder {
          color: #718096;
          font-style: italic;
        }
        
        .logon-input-wrapper {
          border: 1px solid #7f9db9;
          transition: all 0.2s ease;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2) inset;
        }
        .logon-input-wrapper:hover, .logon-input-wrapper:focus-within {
          border-color: #3182ce !important;
          box-shadow: 0 0 8px rgba(66, 153, 225, 0.8), 0 1px 3px rgba(0,0,0,0.1) inset !important;
        }
        
        .blue-arrow-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(to bottom, #a0c0e0 0%, #3a75a7 50%, #21598a 100%) !important;
          border: 1px solid #1d4b75 !important;
          color: #fff !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3) !important;
          transition: all 0.15s ease !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .blue-arrow-btn:hover {
          background: linear-gradient(to bottom, #5d93c4 0%, #2e6290 50%, #173d61 100%) !important;
          border-color: #153a5c !important;
          box-shadow: 0 0 8px rgba(66, 153, 225, 0.8), 0 1px 3px rgba(0,0,0,0.3) !important;
        }
        .blue-arrow-btn:active {
          background: linear-gradient(to bottom, #173d61 0%, #2e6290 100%) !important;
          border-color: #112d47 !important;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.5) !important;
        }

        .cmd-terminal {
          padding: 20px;
          color: #ffffff;
          font-size: 13px;
          line-height: 1.6;
          height: 100%;
          display: flex;
          flex-direction: column;
          justifyContent: flex-start;
          text-align: left;
          box-sizing: border-box;
          overflow-y: auto;
        }

        .chkdsk-btn {
          border: 1px dashed rgba(255,255,255,0.4);
          padding: 8px 16px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-family: monospace;
          color: #fff;
          transition: all 0.15s ease;
          user-select: none;
        }
        .chkdsk-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: #fff;
        }

        /* Bios Layout */
        .bios-container {
          background-color: #0000aa;
          color: #ffffff;
          font-family: monospace;
          height: 100%;
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .bios-border {
          border: 4px double #ffffff;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .bios-header {
          background: #aaaaaa;
          color: #0000aa;
          text-align: center;
          font-weight: bold;
          padding: 2px 0;
          margin-bottom: 12px;
        }

        .bios-nav-tab {
          padding: 2px 10px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.1s ease;
        }

        .bios-option-row {
          display: flex;
          justify-content: space-between;
          max-width: 450px;
          padding: 2px 0;
        }

        @media (max-width: 480px) {
          .cmd-terminal {
            padding: 12px;
            font-size: 11px;
          }
          .chkdsk-btn {
            padding: 10px 14px;
            font-size: 11px;
            width: 100%;
            text-align: center;
          }
          .bios-container {
            padding: 4px;
          }
          .bios-border {
            padding: 6px;
            border-width: 2px;
          }
          .bios-header {
            font-size: 11px;
          }
          .bios-nav-tab {
            padding: 2px 4px;
            font-size: 11px;
          }
        }
      `}} />

      {/* STAGE 1: SIMULAZIONE TERMINALE CMD */}
      {bootStage === 'cmd' && (
        <div ref={containerRef} className="cmd-terminal">
          {/* Prompt d'ingresso BIOS */}
          {showBiosPrompt && (
            <div style={{ marginBottom: '20px' }}>
              <div>Starting Portfolio OS Boot Loader...</div>
              <div style={{ color: '#00ff00', marginTop: '10px' }}>
                Premi [ F2 ] o [ CANC ] per entrare nel BIOS Setup Utility ({biosCountdown}s)
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <div 
                  onClick={enterBios}
                  className="chkdsk-btn"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  &gt; [ F2 ] Entra nel BIOS Setup
                </div>
              </div>
            </div>
          )}

          {/* Righe del terminale */}
          {!showBiosPrompt && renderedLines.map((line, idx) => (
            <div key={idx} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line}</div>
          ))}

          {/* Pulsanti di scelta interattivi (Responsive e Mobile-friendly) */}
          {showPrompt && (
            <div style={{
              marginTop: '15px',
              display: 'flex',
              gap: '12px',
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              <div 
                onClick={() => handleChoice('Y')}
                className="chkdsk-btn"
              >
                &gt; Premi [ Y ] - Esegui CHKDSK (Consigliato)
              </div>
              <div 
                onClick={() => handleChoice('N')}
                className="chkdsk-btn"
              >
                &gt; Premi [ N ] - Salta Controllo
              </div>
            </div>
          )}

          {/* Cursore lampeggiante */}
          {!showPrompt && !showBiosPrompt && (
            <div style={{ display: 'inline-block', width: '8px', height: '14px', background: '#fff', marginLeft: '2px', animation: 'orb-pulse 1s steps(2) infinite' }} />
          )}
        </div>
      )}

      {/* STAGE 2: SCHERMATA RETRO BIOS SETUP */}
      {bootStage === 'bios' && (
        <div className="bios-container">
          <div className="bios-border">
            <div className="bios-header">
              APTIO SETUP UTILITY - COPYRIGHT (C) 2026 BIAGIO SCAGLIA
            </div>
            
            {/* Navigazione delle tab del BIOS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #fff', paddingBottom: '4px', fontSize: '12px', marginBottom: '15px' }}>
              {biosTabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="bios-nav-tab"
                  style={{
                    background: activeTab === tab.id ? '#ffffff' : 'transparent',
                    color: activeTab === tab.id ? '#0000aa' : '#ffffff'
                  }}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            {/* Area Contenuto Dinamico delle Tab */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              
              {/* TAB 1: MAIN */}
              {activeTab === 'main' && (
                <>
                  <div style={{ color: '#ffff55', fontWeight: 'bold', marginBottom: '4px' }}>System Information:</div>
                  <div className="bios-option-row">
                    <span>System Time:</span>
                    <span style={{ color: '#55ffff' }}>{biosTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="bios-option-row">
                    <span>System Date:</span>
                    <span style={{ color: '#55ffff' }}>{biosTime.toLocaleDateString('it-IT')}</span>
                  </div>
                  <div className="bios-option-row">
                    <span>BIOS Version:</span>
                    <span>BS-7.04.26 (Aero)</span>
                  </div>
                  <div className="bios-option-row">
                    <span>CPU Type:</span>
                    <span>Intel Core i7-4770K @ 3.50GHz</span>
                  </div>
                  <div className="bios-option-row">
                    <span>System Memory:</span>
                    <span>16384 MB (DDR3 Dual Channel)</span>
                  </div>
                  <div className="bios-option-row">
                    <span>SATA Port 1:</span>
                    <span>SSD SATA3 512GB (Healthy)</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Current OS:</span>
                    <span style={{ color: '#55ff55' }}>Portfolio OS v1.0 (Windows 7 Mode)</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Owner/Developer:</span>
                    <span>Biagio Scaglia</span>
                  </div>
                </>
              )}

              {/* TAB 2: ADVANCED */}
              {activeTab === 'advanced' && (
                <>
                  <div style={{ color: '#ffff55', fontWeight: 'bold', marginBottom: '4px' }}>Advanced Settings:</div>
                  <div className="bios-option-row">
                    <span>Fast Boot Support:</span>
                    <span style={{ color: '#55ff55' }}>[Enabled]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Aero Glass Window Effect:</span>
                    <span style={{ color: '#55ff55' }}>[Enabled]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Intel Virtualization Technology:</span>
                    <span style={{ color: '#55ff55' }}>[Enabled]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>USB Legacy Support:</span>
                    <span style={{ color: '#55ff55' }}>[Enabled]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Audio Engine Startup:</span>
                    <span style={{ color: '#55ff55' }}>[Active]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Recycle Bin Alert Sounds:</span>
                    <span style={{ color: '#55ff55' }}>[On]</span>
                  </div>
                </>
              )}

              {/* TAB 3: SECURITY */}
              {activeTab === 'security' && (
                <>
                  <div style={{ color: '#ffff55', fontWeight: 'bold', marginBottom: '4px' }}>Security Settings:</div>
                  <div className="bios-option-row">
                    <span>Supervisor Password:</span>
                    <span style={{ color: '#ff5555' }}>[Not Installed]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>User Password:</span>
                    <span style={{ color: '#ff5555' }}>[Not Installed]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>Secure Boot State:</span>
                    <span style={{ color: '#55ff55' }}>[Enabled]</span>
                  </div>
                  <div className="bios-option-row">
                    <span>TPM 2.0 Device Security:</span>
                    <span style={{ color: '#55ff55' }}>[Active & Available]</span>
                  </div>
                </>
              )}

              {/* TAB 4: BOOT */}
              {activeTab === 'boot' && (
                <>
                  <div style={{ color: '#ffff55', fontWeight: 'bold', marginBottom: '4px' }}>Boot Priority Order:</div>
                  <div className="bios-option-row" style={{ color: '#55ffff' }}>
                    <span>1st Boot Device:</span>
                    <span>SSD SATA3 512GB (OS Volume)</span>
                  </div>
                  <div className="bios-option-row">
                    <span>2nd Boot Device:</span>
                    <span>USB Hard Drive</span>
                  </div>
                  <div className="bios-option-row">
                    <span>3rd Boot Device:</span>
                    <span>CD/DVD-ROM Drive</span>
                  </div>
                  <div className="bios-option-row">
                    <span>4th Boot Device:</span>
                    <span>Network Boot (PXE)</span>
                  </div>
                </>
              )}

              {/* TAB 5: EXIT */}
              {activeTab === 'exit' && (
                <>
                  <div style={{ color: '#ffff55', fontWeight: 'bold', marginBottom: '4px' }}>Exit Options:</div>
                  <div 
                    onClick={exitBios} 
                    style={{ cursor: 'pointer', padding: '4px 0', color: '#55ffff' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    &gt; Save Changes and Exit System Setup
                  </div>
                  <div 
                    onClick={exitBios} 
                    style={{ cursor: 'pointer', padding: '4px 0' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    &gt; Discard Changes and Exit Setup
                  </div>
                  <div 
                    style={{ cursor: 'pointer', padding: '4px 0', opacity: 0.6 }}
                  >
                    &gt; Load Setup Default Values
                  </div>
                </>
              )}

            </div>

            {/* Menu di Aiuto e Tasto di Uscita */}
            <div style={{ borderTop: '1px solid #fff', paddingTop: '10px', fontSize: '11px', marginTop: '15px' }}>
              <div style={{ color: '#ffff55', marginBottom: '8px' }}>
                F1: Help | Esc: Exit Setup & Save | F10: Save & Exit | ←/→: Switch Tabs
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div 
                  onClick={exitBios}
                  className="chkdsk-btn"
                  style={{
                    background: '#ff5555',
                    borderColor: '#ff5555',
                    color: '#fff',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  &gt; [ ESC ] Esci e Salva Modifiche (Avvia Sistema)
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 3: SCHERMATA GUI CARICAMENTO (Windows 7 Boot Loader) */}
      {bootStage === 'gui' && (
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          fontFamily: 'Segoe UI, Tahoma, sans-serif'
        }}>
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

      {/* STAGE 4 & 5: LOGON / BENVENUTO (Windows 7 Logon Screen) */}
      {(bootStage === 'logon' || bootStage === 'welcome') && (
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
            position: 'relative',
            fontFamily: 'Segoe UI, Tahoma, sans-serif'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)',
            zIndex: 1
          }} />

          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '280px'
          }}>
            
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '8px',
              border: '3px solid rgba(255,255,255,0.7)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={userIcon} 
                alt="Logon Avatar" 
                style={{ 
                  width: '75%', 
                  height: '75%', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))'
                }} 
              />
            </div>

            {bootStage === 'logon' ? (
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

                <div 
                  className="logon-input-wrapper"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '4px',
                    padding: '2px',
                    boxSizing: 'border-box',
                    gap: '6px',
                    background: '#ffffff'
                  }}
                >
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
                      color: '#2d3748',
                      fontWeight: '500',
                      fontFamily: 'Segoe UI, Tahoma, sans-serif'
                    }}
                  />
                  
                  <div
                    onClick={handleLogin}
                    className="blue-arrow-btn"
                  >
                    <i className="fas fa-arrow-right" style={{ fontSize: '11px', color: '#fff' }}></i>
                  </div>
                </div>
                
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px', marginTop: '12px', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                  Premi Invio per accedere
                </div>
              </>
            ) : (
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
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                  {userName.trim() || 'Ospite'}
                </div>
              </div>
            )}

          </div>

          <div style={{
            position: 'absolute',
            bottom: '35px',
            zIndex: 2,
            textAlign: 'center',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            opacity: 0.95
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.5px' }}>
              Windows 7
            </div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px', opacity: 0.75 }}>
              Professional
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
