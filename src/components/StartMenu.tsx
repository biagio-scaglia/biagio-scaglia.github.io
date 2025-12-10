import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import infoIcon from '../assets/icone/info.png'
import userIcon from '../assets/icone/user.png'
import certificationsIcon from '../assets/icone/certificazioni.png'
import folderIcon from '../assets/icone/cartella.png'
import settingsIcon from '../assets/icone/impostazioni.png'
import musicIcon from '../assets/icone/music.png'
import workExperienceIcon from '../assets/icone/esperienze.png'
import skillsIcon from '../assets/icone/competenze.png'
import educationIcon from '../assets/icone/formazione.png'
import noteIcon from '../assets/icone/note.png'
import immaginiIcon from '../assets/icone/immagini.png'
import computerIcon from '../assets/icone/computer.png'
import linkedinIcon from '../assets/icone/linkedin.png'
import paintIcon from '../assets/icone/paint.png'
import firefoxIcon from '../assets/icone/firefox.png'
import calculatorIcon from '../assets/icone/calculator.png'
import portfolioIcon from '../assets/icone/portfolio.png'
import solitarioIcon from '../assets/icone/solitario.png'
import cestinoIcon from '../assets/icone/cestino.png'
import antivirusIcon from '../assets/icone/antivirus.png'
import calendarIcon from '../assets/icone/calendar.png'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenWindow: (window: string) => void
  onShutdown: () => void
}

export default function StartMenu({ isOpen, onClose, onOpenWindow, onShutdown }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const allApps: Array<{ icon: string; iconSrc?: string; label: string; window: string }> = [
    { icon: 'image', iconSrc: infoIcon, label: 'Presentazione', window: 'about' },
    { icon: 'image', iconSrc: userIcon, label: 'Info Personali', window: 'personalInfo' },
    { icon: 'image', iconSrc: workExperienceIcon, label: 'Esperienze', window: 'workExperience' },
    { icon: 'image', iconSrc: skillsIcon, label: 'Competenze', window: 'skills' },
    { icon: 'image', iconSrc: educationIcon, label: 'Formazione', window: 'education' },
    { icon: 'image', iconSrc: certificationsIcon, label: 'Certificazioni', window: 'certifications' },
    { icon: 'image', iconSrc: noteIcon, label: 'Note', window: 'note' },
    { icon: 'image', iconSrc: computerIcon, label: 'Computer', window: 'computer' },
    { icon: 'image', iconSrc: folderIcon, label: 'Documenti', window: 'documents' },
    { icon: 'image', iconSrc: immaginiIcon, label: 'Immagini', window: 'images' },
    { icon: 'image', iconSrc: musicIcon, label: 'Musica', window: 'music' },
    { icon: 'image', iconSrc: settingsIcon, label: 'Impostazioni', window: 'settings' },
    { icon: 'image', iconSrc: linkedinIcon, label: 'LinkedIn', window: 'linkedin' },
    { icon: 'image', iconSrc: paintIcon, label: 'Paint', window: 'paint' },
    { icon: 'image', iconSrc: firefoxIcon, label: 'Firefox', window: 'browser' },
    { icon: 'image', iconSrc: calculatorIcon, label: 'Calcolatrice', window: 'calculator' },
    { icon: 'image', iconSrc: portfolioIcon, label: 'Portfolio', window: 'portfolio' },
    { icon: 'image', iconSrc: solitarioIcon, label: 'Solitario', window: 'solitario' },
    { icon: 'image', iconSrc: cestinoIcon, label: 'Cestino', window: 'cestino' },
    { icon: 'image', iconSrc: antivirusIcon, label: 'Anti-Virus', window: 'antivirus' },
    { icon: 'image', iconSrc: calendarIcon, label: 'Calendario', window: 'calendar' },
  ]

  const menuItems: Array<{ icon: string; iconSrc?: string; label: string; window: string }> = [
    { icon: 'image', iconSrc: infoIcon, label: 'Presentazione', window: 'about' },
    { icon: 'image', iconSrc: userIcon, label: 'Info Personali', window: 'personalInfo' },
    { icon: 'image', iconSrc: workExperienceIcon, label: 'Esperienze', window: 'workExperience' },
    { icon: 'image', iconSrc: skillsIcon, label: 'Competenze', window: 'skills' },
    { icon: 'image', iconSrc: educationIcon, label: 'Formazione', window: 'education' },
    { icon: 'image', iconSrc: certificationsIcon, label: 'Certificazioni', window: 'certifications' },
    { icon: 'image', iconSrc: noteIcon, label: 'Note', window: 'note' },
  ]

  const quickAccessItems: Array<{ icon: string; iconSrc?: string; label: string; window: string }> = [
    { icon: 'image', iconSrc: computerIcon, label: 'Computer', window: 'computer' },
    { icon: 'image', iconSrc: folderIcon, label: 'Documenti', window: 'documents' },
    { icon: 'image', iconSrc: immaginiIcon, label: 'Immagini', window: 'images' },
    { icon: 'image', iconSrc: musicIcon, label: 'Musica', window: 'music' },
  ]

  // Filtra le app in base alla ricerca
  const filteredApps = searchQuery.trim() === '' 
    ? [] 
    : allApps.filter(app => 
        app.label.toLowerCase().includes(searchQuery.toLowerCase())
      )

  // Reset ricerca quando il menu si chiude
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        bottom: windowSize.isMobile ? '50px' : '40px',
        left: '0',
        width: windowSize.isMobile ? '100vw' : windowSize.isTablet ? '280px' : '300px',
        maxHeight: windowSize.isMobile ? 'calc(100vh - 50px)' : 'calc(100vh - 40px)',
        background: 'linear-gradient(to bottom, rgba(30, 50, 90, 0.85) 0%, rgba(20, 40, 80, 0.9) 100%)',
        backdropFilter: 'blur(35px)',
        WebkitBackdropFilter: 'blur(35px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        color: '#fff',
      }}
    >
      {/* Barra di ricerca */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="fas fa-search" style={{ 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.7)',
            position: 'absolute',
            left: '10px',
            pointerEvents: 'none'
          }}></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca programmi e file..."
            autoFocus={isOpen}
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              fontSize: windowSize.isMobile ? '13px' : '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          />
        </div>
        
        {/* Risultati ricerca */}
        {searchQuery.trim() !== '' && filteredApps.length > 0 && (
          <div style={{
            marginTop: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '4px',
            padding: '4px 0'
          }}>
            {filteredApps.map((app, index) => (
              <div
                key={index}
                onClick={() => {
                  if (app.window === 'linkedin') {
                    window.open('https://www.linkedin.com/in/biagio-scaglia/', '_blank')
                  } else {
                    onOpenWindow(app.window)
                  }
                  onClose()
                  setSearchQuery('')
                }}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {app.icon === 'image' && app.iconSrc ? (
                  <img 
                    src={app.iconSrc} 
                    alt={app.label} 
                    style={{ 
                      width: '18px', 
                      height: '18px',
                      objectFit: 'contain',
                      display: 'block'
                    }} 
                  />
                ) : (
                  <i className={app.icon} style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}></i>
                )}
                <span>{app.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {searchQuery.trim() !== '' && filteredApps.length === 0 && (
          <div style={{
            marginTop: '8px',
            padding: '12px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Nessun risultato trovato
          </div>
        )}
      </div>

      {/* Sezione sinistra - Programmi */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 0', minHeight: 0 }}>
        <div style={{ padding: '8px 16px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          PROGRAMMI
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0', minHeight: 0 }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onOpenWindow(item.window)
                onClose()
              }}
              style={{
                padding: windowSize.isMobile ? '12px 16px' : '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: windowSize.isMobile ? '10px' : '12px',
                fontSize: windowSize.isMobile ? '14px' : '13px',
                transition: 'all 0.15s',
                background: 'transparent',
                borderRadius: '0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)'
                e.currentTarget.style.backdropFilter = 'blur(20px)'
                ;(e.currentTarget.style as any).WebkitBackdropFilter = 'blur(20px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.backdropFilter = 'none'
                ;(e.currentTarget.style as any).WebkitBackdropFilter = 'none'
              }}
            >
              {item.icon === 'image' && item.iconSrc ? (
                <img 
                  src={item.iconSrc} 
                  alt={item.label} 
                  style={{ 
                    width: windowSize.isMobile ? '20px' : '18px', 
                    height: windowSize.isMobile ? '20px' : '18px',
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
              ) : (
                <i className={item.icon} style={{ fontSize: windowSize.isMobile ? '20px' : '18px', width: windowSize.isMobile ? '30px' : '28px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></i>
              )}
              <span style={{ fontWeight: '400' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', margin: '4px 0' }} />

      {/* Sezione destra - Accesso rapido */}
      <div style={{ width: '100%', padding: '8px 0' }}>
        <div style={{ padding: '8px 16px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          ACCESSO RAPIDO
        </div>
        {quickAccessItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (item.window) {
                onOpenWindow(item.window)
                onClose()
              }
            }}
            style={{
              padding: '10px 16px',
              cursor: item.window ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px',
              transition: 'all 0.15s',
              background: 'transparent',
              borderRadius: '0',
            }}
            onMouseEnter={(e) => {
              if (item.window) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {item.icon === 'image' && item.iconSrc ? (
              <img 
                src={item.iconSrc} 
                alt={item.label} 
                style={{ 
                  width: '18px', 
                  height: '18px',
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            ) : (
              <i className={item.icon} style={{ fontSize: '18px', width: '28px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></i>
            )}
            <span style={{ fontWeight: '400' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer con pulsante spegnimento */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => {
            onShutdown()
            onClose()
          }}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: '2px',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
          }}
        >
          <i className="fas fa-power-off" style={{ fontSize: '14px' }}></i>
          <span>Spegni</span>
        </button>
      </div>
    </div>
  )
}

