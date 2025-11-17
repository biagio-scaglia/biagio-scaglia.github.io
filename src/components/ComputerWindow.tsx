import { useState, useEffect } from 'react'
import Window from './Window'

interface ComputerWindowProps {
  onClose: () => void
  onMinimize?: () => void
}

export default function ComputerWindow({ onClose, onMinimize }: ComputerWindowProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Window
      title="Computer - Informazioni Sistema"
      width={600}
      height={550}
      defaultPosition={{ x: 150, y: 100 }}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div style={{ padding: windowWidth <= 480 ? '15px' : '20px' }}>
        <h2 style={{ marginTop: 0, fontSize: windowWidth <= 480 ? '16px' : '18px', marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>Informazioni sul Portfolio</h2>
        
        <fieldset style={{ marginBottom: '20px' }}>
          <legend>Informazioni Generali</legend>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: windowWidth <= 480 ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '8px', gap: windowWidth <= 480 ? '4px' : '0' }}>
              <span style={{ fontWeight: 'bold', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Data di Creazione:</span>
              <span style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>17/11/2025</span>
            </div>
            <div style={{ fontSize: windowWidth <= 480 ? '10px' : '11px', color: '#666', marginTop: '4px' }}>
              Portfolio personale sviluppato con tema Windows 7
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: windowWidth <= 480 ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '8px', gap: windowWidth <= 480 ? '4px' : '0' }}>
              <span style={{ fontWeight: 'bold', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Versione:</span>
              <span style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>1.0.0</span>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>
          <legend style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Stack Tecnologico</legend>
          
          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Frontend Framework:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • React 18+ con TypeScript
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Styling & UI:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • 7.css - Framework CSS per Windows 7 UI<br/>
              • CSS-in-JS (Inline Styles)<br/>
              • Font Awesome Icons
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Audio & Media:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Howler.js - Libreria audio avanzata
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Build Tool:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Vite - Build tool veloce e moderno
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Caratteristiche:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Design responsive (Mobile, Tablet, Desktop)<br/>
              • Effetti Aero Glass per taskbar e menu<br/>
              • Sistema di finestre draggable e resizable<br/>
              • Boot screen con progress bar<br/>
              • Player audio integrato<br/>
              • Gestione sfondi desktop dinamica
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>
          <legend style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Crediti</legend>
          
          <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333' }}>
            <div style={{ marginBottom: windowWidth <= 480 ? '6px' : '8px' }}>
              <strong>Sviluppatore:</strong> Biagio Scaglia
            </div>
            <div style={{ marginBottom: windowWidth <= 480 ? '6px' : '8px' }}>
              <strong>Design:</strong> Ispirato a Windows 7 Aero
            </div>
            <div>
              <strong>Framework UI:</strong> 7.css (MIT License)
            </div>
          </div>
        </fieldset>

        <div style={{ display: 'flex', gap: windowWidth <= 480 ? '8px' : '12px', justifyContent: 'flex-end', marginTop: windowWidth <= 480 ? '20px' : '24px', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ fontSize: windowWidth <= 480 ? '12px' : '14px', padding: windowWidth <= 480 ? '8px 16px' : '10px 20px' }}>Chiudi</button>
        </div>
      </div>
    </Window>
  )
}

