import { useState, useEffect } from 'react'
import Window from './Window'

interface ComputerWindowProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

export default function ComputerWindow({ onClose, onMinimize, icon }: ComputerWindowProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Window
      title="Computer - Informazioni Sistema"
      width={windowWidth <= 480 ? Math.min(400, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(600, window.innerWidth - 40) : 700}
      height={windowWidth <= 480 ? Math.min(600, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(650, window.innerHeight - 80) : 650}
      defaultPosition={{ x: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 150, y: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 100 }}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
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
              <span style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>2.0.0</span>
            </div>
            <div style={{ fontSize: windowWidth <= 480 ? '10px' : '11px', color: '#666', marginTop: '4px' }}>
              Aggiornato con nuove applicazioni e miglioramenti responsive
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: windowWidth <= 480 ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '8px', gap: windowWidth <= 480 ? '4px' : '0' }}>
              <span style={{ fontWeight: 'bold', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Repository GitHub:</span>
              <span style={{ fontSize: windowWidth <= 480 ? '11px' : '12px' }}>
                <a href="https://github.com/biagio-scaglia/portfolio" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
                  biagio-scaglia/portfolio
                </a>
              </span>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>
          <legend style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Stack Tecnologico</legend>
          
          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Frontend Framework:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • React 19.2.0 con TypeScript 5.9.3<br/>
              • React DOM 19.2.0<br/>
              • Hooks avanzati (useState, useEffect, useCallback, useRef)
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Styling & UI:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • 7.css 0.21.1 - Framework CSS per Windows 7 UI<br/>
              • 98.css 0.1.21 - Framework CSS per retro UI<br/>
              • CSS-in-JS (Inline Styles per responsive design)<br/>
              • Font Awesome 7.1.0 - Icone vettoriali
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Audio & Media:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Howler.js 2.2.4 - Libreria audio avanzata per effetti sonori
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Build Tool:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Vite 7.2.2 (rolldown-vite) - Build tool veloce e moderno<br/>
              • TypeScript Compiler per type checking<br/>
              • ESLint per code quality
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Caratteristiche Principali:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Design completamente responsive (Mobile ≤480px, Tablet 481-768px, Desktop &gt;768px)<br/>
              • Effetti Aero Glass per taskbar e menu<br/>
              • Sistema di finestre draggable e resizable con 8 punti di ridimensionamento<br/>
              • Boot screen animato con progress bar e suoni<br/>
              • Player audio integrato con controlli avanzati<br/>
              • Gestione sfondi desktop dinamica con slideshow automatico<br/>
              • Lazy loading dei componenti per performance ottimali<br/>
              • Code splitting automatico con React.lazy e Suspense
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>
          <legend style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Applicazioni Disponibili</legend>
          
          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Applicazioni Desktop:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • <strong>Calcolatrice</strong> - Calcolatrice funzionale con operazioni base<br/>
              • <strong>Portfolio</strong> - Visualizzazione progetti GitHub con tecnologie e link<br/>
              • <strong>Solitario</strong> - Gioco Solitario Klondike completo e funzionale<br/>
              • <strong>Cestino</strong> - Gestione file eliminati con ripristino e svuotamento<br/>
              • <strong>Anti-Virus</strong> - Simulazione scansione sistema con spinner 7.css<br/>
              • <strong>Calendario</strong> - Calendario mensile con navigazione e selezione date<br/>
              • <strong>Browser</strong> - Browser integrato con navigazione simulata<br/>
              • <strong>Paint</strong> - Applicazione di disegno con strumenti base<br/>
              • <strong>Musica</strong> - Player audio con playlist e controlli avanzati<br/>
              • <strong>Note</strong> - Blocco note con salvataggio e invio email
            </div>
          </div>

          <div style={{ marginBottom: windowWidth <= 480 ? '10px' : '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Sezioni Portfolio:</div>
            <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333', marginLeft: '12px' }}>
              • Informazioni Personali, Esperienze Lavorative, Competenze<br/>
              • Formazione, Certificazioni, About<br/>
              • Visualizzatore Immagini e Documenti PDF
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: windowWidth <= 480 ? '15px' : '20px' }}>
          <legend style={{ fontSize: windowWidth <= 480 ? '12px' : '14px' }}>Crediti e Licenze</legend>
          
          <div style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#333' }}>
            <div style={{ marginBottom: windowWidth <= 480 ? '6px' : '8px' }}>
              <strong>Sviluppatore:</strong> Biagio Scaglia<br/>
              <span style={{ fontSize: windowWidth <= 480 ? '10px' : '11px', color: '#666' }}>
                Sviluppatore Software & UX/UI Designer
              </span>
            </div>
            <div style={{ marginBottom: windowWidth <= 480 ? '6px' : '8px' }}>
              <strong>Design:</strong> Ispirato a Windows 7 Aero con effetti glass e animazioni fluide
            </div>
            <div style={{ marginBottom: windowWidth <= 480 ? '6px' : '8px' }}>
              <strong>Framework UI:</strong> 7.css (MIT License) - Framework CSS per Windows 7 UI
            </div>
            <div style={{ marginBottom: windowWidth <= 480 ? '6px' : '8px' }}>
              <strong>Librerie:</strong> React, TypeScript, Vite, Howler.js, Font Awesome
            </div>
            <div>
              <strong>Licenza Progetto:</strong> Privata - Tutti i diritti riservati
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

