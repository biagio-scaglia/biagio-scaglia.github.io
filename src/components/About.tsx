import { useState, useEffect } from 'react'
import bsLogo from '../assets/BS.png'

export default function About() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth <= 480

  return (
    <div style={{ padding: isMobile ? '12px' : '20px', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      {/* Profilo Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '3px solid #fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15), 0 0 0 1px #b0c4de',
          background: 'linear-gradient(135deg, #e6f2ff 0%, #cce6ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img src={bsLogo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#1a365d' }}>Biagio Scaglia</h2>
          <span style={{
            fontSize: '12px',
            color: '#4a5568',
            background: '#ebf8ff',
            border: '1px solid #bee3f8',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Full Stack Web & Mobile Developer
          </span>
        </div>
      </div>

      {/* Descrizione Biografia */}
      <div style={{
        lineHeight: '1.6',
        textAlign: 'justify',
        fontSize: isMobile ? '12px' : '13px',
        color: '#2d3748',
        background: '#fff',
        border: '1px solid #d2d6dc',
        borderRadius: '6px',
        padding: '15px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <p style={{ margin: '0 0 12px 0' }}>
          Sono un programmatore con una profonda passione per l'informatica, che ha iniziato come autodidatta e ha consolidato le sue competenze sul campo. Sviluppo soluzioni web e mobile unendo precisione tecnica, codice pulito e cura per l'esperienza utente.
        </p>
        <p style={{ margin: 0 }}>
          Attualmente sono studente presso l'**ITS Academy Apulia Digital** a Bari, un percorso specialistico di alto livello che mi sta permettendo di affinare ulteriormente le mie competenze di analisi e ingegnerizzazione del software.
        </p>
      </div>

      {/* Riquadro Dati Aggiuntivi */}
      <div style={{
        background: 'linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%)',
        border: '1px solid #d2d6dc',
        borderRadius: '6px',
        padding: '15px',
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2b6cb0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-globe-europe" style={{ color: '#2b6cb0' }}></i> Informazioni e Lingue
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong>Lingue:</strong>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{
                background: '#fff',
                border: '1px solid #cbd5e0',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px'
              }}>
                <i className="fas fa-language" style={{ color: '#38a169', fontSize: '12px' }}></i> Italiano <span style={{ color: '#718096', fontSize: '11px' }}>(Madrelingua)</span>
              </span>
              <span style={{
                background: '#fff',
                border: '1px solid #cbd5e0',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px'
              }}>
                <i className="fas fa-language" style={{ color: '#3182ce', fontSize: '12px' }}></i> Inglese <span style={{ color: '#2b6cb0', fontWeight: 'bold', fontSize: '11px' }}>(B2)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

