import { useState, useEffect } from 'react'
import Window from './Window'

interface AntiVirusProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

interface Threat {
  id: number
  name: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
}

export default function AntiVirus({ onClose, onMinimize, icon }: AntiVirusProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [threats, setThreats] = useState<Threat[]>([])
  const [isProtected, setIsProtected] = useState(true)
  const [lastScan, setLastScan] = useState<Date | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const generateThreats = (): Threat[] => {
    const threatNames = [
      'Trojan.Generic.12345',
      'Malware.Suspicious.File',
      'Adware.Browser.Hijacker',
      'Spyware.Keylogger',
      'Ransomware.Encrypt',
      'Virus.Worm.Spreader',
      'Rootkit.System.Modifier'
    ]
    const threatTypes = ['Trojan', 'Malware', 'Adware', 'Spyware', 'Ransomware', 'Virus', 'Rootkit']
    const locations = [
      'C:\\Windows\\System32\\temp\\',
      'C:\\Users\\Documents\\',
      'C:\\Program Files\\',
      'C:\\Downloads\\',
      'C:\\Temp\\'
    ]
    const severities: Threat['severity'][] = ['low', 'medium', 'high', 'critical']

    const numThreats = Math.floor(Math.random() * 3) // 0-2 minacce
    const generated: Threat[] = []

    for (let i = 0; i < numThreats; i++) {
      generated.push({
        id: i,
        name: threatNames[Math.floor(Math.random() * threatNames.length)],
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      })
    }

    return generated
  }

  const handleScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setThreats([])

    // Simula scansione
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setScanProgress(i)
    }

    const foundThreats = generateThreats()
    setThreats(foundThreats)
    setIsProtected(foundThreats.length === 0)
    setLastScan(new Date())
    setIsScanning(false)

    if (foundThreats.length > 0) {
      try {
        const errorAudio = new Audio(new URL('../assets/sound/windows-7-error.wav', import.meta.url).href)
        errorAudio.volume = 0.4
        errorAudio.play().catch(e => console.log('Error sound prevented:', e))
      } catch (err) {
        console.log('Error playing error sound:', err)
      }
    }
  }

  const handleQuarantine = () => {
    if (threats.length > 0) {
      if (confirm(`Vuoi mettere in quarantena ${threats.length} minaccia(e)?`)) {
        setThreats([])
        setIsProtected(true)
      }
    }
  }

  const getSeverityColor = (severity: Threat['severity']) => {
    switch (severity) {
      case 'low': return '#f39c12'
      case 'medium': return '#e67e22'
      case 'high': return '#e74c3c'
      case 'critical': return '#c0392b'
      default: return '#95a5a6'
    }
  }

  const getSeverityLabel = (severity: Threat['severity']) => {
    switch (severity) {
      case 'low': return 'Bassa'
      case 'medium': return 'Media'
      case 'high': return 'Alta'
      case 'critical': return 'Critica'
      default: return 'Sconosciuta'
    }
  }

  return (
    <Window
      title="Anti-Virus - Protezione Sistema"
      width={windowWidth <= 480 ? Math.min(400, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(600, window.innerWidth - 40) : 700}
      height={windowWidth <= 480 ? Math.min(500, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(600, window.innerHeight - 80) : 600}
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
        gap: '15px'
      }}>
        {/* Status Header */}
        <div style={{
          padding: '15px',
          background: isProtected ? '#d4edda' : '#f8d7da',
          border: `2px solid ${isProtected ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: windowWidth <= 480 ? '36px' : '44px',
            height: windowWidth <= 480 ? '36px' : '44px',
            borderRadius: '50%',
            background: isProtected ? '#28a745' : '#dc3545',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: windowWidth <= 480 ? '18px' : '22px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}>
            {isProtected ? <i className="fas fa-shield-alt"></i> : <i className="fas fa-exclamation-triangle"></i>}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: windowWidth <= 480 ? '16px' : '18px', color: isProtected ? '#155724' : '#721c24' }}>
              {isProtected ? 'Sistema Protetto' : 'Minacce Rilevate'}
            </h3>
            <p style={{ margin: '5px 0 0 0', fontSize: windowWidth <= 480 ? '11px' : '12px', color: isProtected ? '#155724' : '#721c24' }}>
              {isProtected 
                ? 'Il tuo sistema è sicuro e protetto'
                : `${threats.length} minaccia(e) rilevata(e) - Azione richiesta`
              }
            </p>
          </div>
        </div>

        {/* Scan Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleScan} 
            disabled={isScanning}
            style={{ flex: 1, minWidth: '120px' }}
          >
            {isScanning ? 'Scansione in corso...' : 'Avvia Scansione'}
          </button>
          {threats.length > 0 && (
            <button 
              onClick={handleQuarantine}
              style={{ flex: 1, minWidth: '120px' }}
            >
              Metti in Quarantena
            </button>
          )}
        </div>

        {/* Progress Bar e Spinner */}
        {isScanning && (
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '10px',
              padding: '10px',
              background: '#f0f0f0',
              borderRadius: '4px'
            }}>
              <div className="spinner animate" aria-label="Scansione in corso..." style={{ 
                width: windowWidth <= 480 ? '20px' : '24px', 
                height: windowWidth <= 480 ? '20px' : '24px',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '5px', fontSize: windowWidth <= 480 ? '11px' : '12px', fontWeight: 'bold' }}>
                  Scansione in corso... {scanProgress}%
                </div>
                <div role="progressbar" aria-valuenow={scanProgress} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%' }}>
                  <div style={{ width: `${scanProgress}%`, height: windowWidth <= 480 ? '18px' : '20px' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Scan Info */}
        {lastScan && !isScanning && (
          <div style={{
            padding: '10px',
            background: '#f0f0f0',
            borderRadius: '4px',
            fontSize: windowWidth <= 480 ? '11px' : '12px',
            color: '#666'
          }}>
            Ultima scansione: {lastScan.toLocaleString('it-IT')}
          </div>
        )}

        {/* Threats List */}
        {threats.length > 0 && !isScanning && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: windowWidth <= 480 ? '14px' : '16px' }}>
              Minacce Rilevate:
            </h4>
            {threats.map((threat) => (
              <div
                key={threat.id}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  background: '#fff',
                  border: `2px solid ${getSeverityColor(threat.severity)}`,
                  borderRadius: '4px',
                  fontSize: windowWidth <= 480 ? '11px' : '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ color: getSeverityColor(threat.severity) }}>
                    {threat.name}
                  </strong>
                  <span style={{
                    padding: '2px 8px',
                    background: getSeverityColor(threat.severity),
                    color: '#fff',
                    borderRadius: '3px',
                    fontSize: windowWidth <= 480 ? '9px' : '10px',
                    fontWeight: 'bold'
                  }}>
                    {getSeverityLabel(threat.severity)}
                  </span>
                </div>
                <div style={{ color: '#666', fontSize: windowWidth <= 480 ? '10px' : '11px' }}>
                  Tipo: {threat.type} • Posizione: {threat.location}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {threats.length === 0 && !isScanning && !lastScan && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#a0aec0',
            fontSize: windowWidth <= 480 ? '14px' : '16px'
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: windowWidth <= 480 ? '44px' : '56px', color: '#cbd5e0', marginBottom: '12px' }}></i>
            <p style={{ margin: 0 }}>Nessuna scansione effettuata</p>
            <p style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', marginTop: '5px' }}>
              Clicca su "Avvia Scansione" per verificare il sistema
            </p>
          </div>
        )}
      </div>
    </Window>
  )
}

