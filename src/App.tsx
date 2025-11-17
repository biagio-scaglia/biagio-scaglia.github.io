import { useState, useEffect, useMemo } from 'react'
import Window from './components/Window'
import DesktopIcon from './components/DesktopIcon'
import About from './components/About'
import PersonalInfo from './components/PersonalInfo'
import WorkExperience from './components/WorkExperience'
import Skills from './components/Skills'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Note from './components/Note'
import WelcomeModal from './components/WelcomeModal'
import BootScreen from './components/BootScreen'
import StartMenu from './components/StartMenu'
import ShutdownScreen from './components/ShutdownScreen'
import DocumentsWindow from './components/DocumentsWindow'
import ImagesWindow from './components/ImagesWindow'
import ComputerWindow from './components/ComputerWindow'
import MusicWindow from './components/MusicWindow'
import taskbarIcon from './assets/icona taskbar.png'
import defaultBackground from './assets/sfondo.jpg'
import './App.css'

// Carica dinamicamente tutti i file jpg dalla cartella sfondo per lo slideshow
const backgroundImages = import.meta.glob('./assets/sfondo/*.jpg', { eager: true }) as Record<string, { default: string }>

function App() {
  const [showBootScreen, setShowBootScreen] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [userName, setUserName] = useState('Guest')
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showShutdownScreen, setShowShutdownScreen] = useState(false)
  const [openWindows, setOpenWindows] = useState({
    about: false,
    personalInfo: false,
    workExperience: false,
    skills: false,
    education: false,
    certifications: false,
    note: false,
    documents: false,
    images: false,
    computer: false,
    music: false,
  })
  const [minimizedWindows, setMinimizedWindows] = useState<Set<keyof typeof openWindows>>(new Set())
  const [desktopBackground, setDesktopBackground] = useState(defaultBackground)
  const [isSlideshowEnabled, setIsSlideshowEnabled] = useState(false)
  const [slideshowIntervalSeconds, setSlideshowIntervalSeconds] = useState(5)
  const [, setCurrentSlideshowIndex] = useState(0)

  // Ottieni lista di tutti gli sfondi disponibili (escluso Starter)
  const allBackgrounds = useMemo(() => {
    const backgrounds = [defaultBackground]
    
    const sortedFiles = Object.entries(backgroundImages)
      .map(([path, module]) => {
        const fileName = path.split('/').pop()?.replace('.jpg', '') || ''
        const numMatch = fileName.match(/\d+/)
        const num = numMatch ? parseInt(numMatch[0]) : 999
        return {
          path,
          url: module.default,
          name: fileName,
          num
        }
      })
      .filter((file) => {
        // Rimuovi file con "Starter" nel nome
        return !file.name.toLowerCase().includes('starter')
      })
      .sort((a, b) => {
        if (a.num !== b.num) return a.num - b.num
        return a.name.localeCompare(b.name)
      })
      .map((file) => file.url)
    
    backgrounds.push(...sortedFiles)
    return backgrounds
  }, [])
  
  // Impostazioni accessibilità
  const [accessibilitySettings] = useState({
    highContrast: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    showAnimations: true,
    screenReader: false,
  })

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const getInitialIconPositions = () => {
    const isMobile = window.innerWidth <= 480
    const isTablet = window.innerWidth <= 768 && window.innerWidth > 480
    
    if (isMobile) {
      // Mobile: griglia 2 colonne
      return {
        about: { x: 20, y: 20 },
        personalInfo: { x: 100, y: 20 },
        workExperience: { x: 20, y: 100 },
        skills: { x: 100, y: 100 },
        education: { x: 20, y: 180 },
        certifications: { x: 100, y: 180 },
        note: { x: 20, y: 260 },
      }
    } else if (isTablet) {
      // Tablet: griglia 3 colonne
      return {
        about: { x: 30, y: 30 },
        personalInfo: { x: 130, y: 30 },
        workExperience: { x: 230, y: 30 },
        skills: { x: 30, y: 120 },
        education: { x: 130, y: 120 },
        certifications: { x: 230, y: 120 },
        note: { x: 30, y: 210 },
      }
    } else {
      // Desktop: orizzontale
      return {
        about: { x: 30, y: 30 },
        personalInfo: { x: 140, y: 30 },
        workExperience: { x: 250, y: 30 },
        skills: { x: 360, y: 30 },
        education: { x: 470, y: 30 },
        certifications: { x: 580, y: 30 },
        note: { x: 690, y: 30 },
      }
    }
  }

  const [iconPositions, setIconPositions] = useState(getInitialIconPositions())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Gestione resize per responsive
    const handleResize = () => {
      setIconPositions(getInitialIconPositions())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleWindow = (window: keyof typeof openWindows) => {
    setOpenWindows((prev) => {
      const isOpen = prev[window]
      // Se la finestra è minimizzata e viene cliccata, riaprila
      if (minimizedWindows.has(window)) {
        setMinimizedWindows((prevMin) => {
          const newMin = new Set(prevMin)
          newMin.delete(window)
          return newMin
        })
        return { ...prev, [window]: true }
      }
      // Se la finestra è aperta, chiudila
      if (isOpen) {
        return { ...prev, [window]: false }
      }
      // Altrimenti aprila
      return { ...prev, [window]: true }
    })
  }

  const handleMinimize = (window: keyof typeof openWindows) => {
    setMinimizedWindows((prev) => {
      const newMin = new Set(prev)
      newMin.add(window)
      return newMin
    })
    // La finestra rimane "aperta" ma viene nascosta
  }


  // Helper per verificare se una finestra è attiva (aperta e non minimizzata)
  const isWindowActive = (window: keyof typeof openWindows) => {
    return openWindows[window] && !minimizedWindows.has(window)
  }

  const handleDesktopClick = () => {
    setSelectedIcon(null)
  }

  const handleIconPositionChange = (iconKey: keyof typeof iconPositions, x: number, y: number) => {
    setIconPositions((prev) => ({
      ...prev,
      [iconKey]: { x, y },
    }))
  }

  const handleBootComplete = (name: string) => {
    setUserName(name)
    setShowBootScreen(false)
    // Piccolo delay per assicurarsi che il suono parta
    setTimeout(() => {
      setShowWelcomeModal(true)
    }, 200)
  }

  const handleRestart = () => {
    // Reset di tutti gli stati
    setShowBootScreen(true)
    setShowWelcomeModal(false)
    setShowStartMenu(false)
    setShowShutdownScreen(false)
    setOpenWindows({
      about: false,
      personalInfo: false,
      workExperience: false,
      skills: false,
      education: false,
      certifications: false,
      note: false,
      documents: false,
      images: false,
      computer: false,
      music: false,
    })
    setSelectedIcon(null)
    setDesktopBackground(defaultBackground)
    setMinimizedWindows(new Set())
    // Reset posizioni icone
    setIconPositions(getInitialIconPositions())
  }

  // Applica impostazioni accessibilità
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    
    // Alto contrasto
    if (accessibilitySettings.highContrast) {
      root.style.setProperty('--text-color', '#000000')
      root.style.setProperty('--bg-color', '#ffffff')
      root.style.setProperty('--border-color', '#000000')
      body.style.filter = 'contrast(1.5) brightness(1.1)'
      // Applica stili ad elementi specifici
      const windows = document.querySelectorAll('.window')
      windows.forEach((win: Element) => {
        const el = win as HTMLElement
        el.style.backgroundColor = '#ffffff'
        el.style.color = '#000000'
        el.style.borderColor = '#000000'
      })
      const windowBodies = document.querySelectorAll('.window-body')
      windowBodies.forEach((wb: Element) => {
        const el = wb as HTMLElement
        el.style.backgroundColor = '#ffffff'
        el.style.color = '#000000'
      })
    } else {
      root.style.removeProperty('--text-color')
      root.style.removeProperty('--bg-color')
      root.style.removeProperty('--border-color')
      body.style.filter = ''
      const windows = document.querySelectorAll('.window')
      windows.forEach((win: Element) => {
        const el = win as HTMLElement
        el.style.backgroundColor = ''
        el.style.color = ''
        el.style.borderColor = ''
      })
      const windowBodies = document.querySelectorAll('.window-body')
      windowBodies.forEach((wb: Element) => {
        const el = wb as HTMLElement
        el.style.backgroundColor = ''
        el.style.color = ''
      })
    }
    
    // Dimensione testo
    const fontSizeMap = {
      small: '12px',
      medium: '14px',
      large: '18px'
    }
    const fontSize = fontSizeMap[accessibilitySettings.fontSize]
    body.style.fontSize = fontSize
    root.style.setProperty('--base-font-size', fontSize)
    
    // Applica anche agli elementi specifici
    const allElements = document.querySelectorAll('*')
    allElements.forEach((el: Element) => {
      const htmlEl = el as HTMLElement
      if (htmlEl.style.fontSize && htmlEl.style.fontSize !== 'inherit') {
        // Mantieni dimensioni relative ma scala base
        const currentSize = parseFloat(htmlEl.style.fontSize)
        if (!isNaN(currentSize)) {
          const scale = accessibilitySettings.fontSize === 'small' ? 0.85 : accessibilitySettings.fontSize === 'large' ? 1.3 : 1
          htmlEl.style.fontSize = `${currentSize * scale}px`
        }
      }
    })
    
    // Animazioni
    if (!accessibilitySettings.showAnimations) {
      root.style.setProperty('--animation-duration', '0s')
      body.classList.add('no-animations')
      const style = document.createElement('style')
      style.id = 'no-animations-style'
      style.textContent = `
        * {
          transition: none !important;
          animation: none !important;
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
      if (!document.getElementById('no-animations-style')) {
        document.head.appendChild(style)
      }
    } else {
      root.style.removeProperty('--animation-duration')
      body.classList.remove('no-animations')
      const style = document.getElementById('no-animations-style')
      if (style) {
        style.remove()
      }
    }
    
    // Screen reader
    if (accessibilitySettings.screenReader) {
      root.setAttribute('role', 'application')
      root.setAttribute('aria-label', 'Portfolio Windows 7')
      // Aggiungi attributi ARIA agli elementi interattivi
      const buttons = document.querySelectorAll('button')
      buttons.forEach((btn, index) => {
        if (!btn.getAttribute('aria-label')) {
          btn.setAttribute('aria-label', btn.textContent || `Button ${index}`)
        }
      })
    } else {
      root.removeAttribute('role')
      root.removeAttribute('aria-label')
    }
  }, [accessibilitySettings])

  // Aggiorna l'indice quando cambia lo sfondo manualmente
  useEffect(() => {
    if (!isSlideshowEnabled) return
    const currentIndex = allBackgrounds.findIndex(bg => bg === desktopBackground)
    if (currentIndex >= 0) {
      setCurrentSlideshowIndex(currentIndex)
    }
  }, [desktopBackground, isSlideshowEnabled, allBackgrounds])

  // Gestione slideshow automatico
  useEffect(() => {
    if (!isSlideshowEnabled || allBackgrounds.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlideshowIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % allBackgrounds.length
        setDesktopBackground(allBackgrounds[nextIndex])
        return nextIndex
      })
    }, slideshowIntervalSeconds * 1000)

    return () => clearInterval(interval)
  }, [isSlideshowEnabled, slideshowIntervalSeconds, allBackgrounds])

  const handleSlideshowChange = (enabled: boolean, seconds: number) => {
    setIsSlideshowEnabled(enabled)
    setSlideshowIntervalSeconds(seconds)
    
    // Se si attiva lo slideshow, trova l'indice dello sfondo corrente
    if (enabled) {
      const currentIndex = allBackgrounds.findIndex(bg => bg === desktopBackground)
      setCurrentSlideshowIndex(currentIndex >= 0 ? currentIndex : 0)
    }
  }

  return (
    <>
      {showBootScreen && <BootScreen onComplete={handleBootComplete} />}
      {!showBootScreen && showShutdownScreen && <ShutdownScreen onRestart={handleRestart} onCancel={() => setShowShutdownScreen(false)} />}
      {!showBootScreen && !showShutdownScreen && showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} userName={userName} />}
      {!showBootScreen && !showShutdownScreen && (
        <StartMenu 
          isOpen={showStartMenu} 
          onClose={() => setShowStartMenu(false)} 
          onOpenWindow={(window) => toggleWindow(window as keyof typeof openWindows)} 
          onShutdown={() => setShowShutdownScreen(true)} 
        />
      )}
      {!showBootScreen && !showShutdownScreen && (
      <div
        className="desktop-pattern"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundImage: desktopBackground.startsWith('linear-gradient') 
            ? desktopBackground 
            : `url(${desktopBackground})`,
          backgroundSize: desktopBackground.startsWith('linear-gradient') ? 'auto' : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: '60px',
        }}
        onClick={handleDesktopClick}
      >
      {/* Desktop Icons */}
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>📄</span>}
        label="Presentazione"
        onClick={() => toggleWindow('about')}
        x={iconPositions.about.x}
        y={iconPositions.about.y}
        isSelected={selectedIcon === 'about'}
        onSelect={() => setSelectedIcon('about')}
        onPositionChange={(x, y) => handleIconPositionChange('about', x, y)}
      />
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>👤</span>}
        label="Info Personali"
        onClick={() => toggleWindow('personalInfo')}
        x={iconPositions.personalInfo.x}
        y={iconPositions.personalInfo.y}
        isSelected={selectedIcon === 'personalInfo'}
        onSelect={() => setSelectedIcon('personalInfo')}
        onPositionChange={(x, y) => handleIconPositionChange('personalInfo', x, y)}
      />
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>💼</span>}
        label="Esperienze"
        onClick={() => toggleWindow('workExperience')}
        x={iconPositions.workExperience.x}
        y={iconPositions.workExperience.y}
        isSelected={selectedIcon === 'workExperience'}
        onSelect={() => setSelectedIcon('workExperience')}
        onPositionChange={(x, y) => handleIconPositionChange('workExperience', x, y)}
      />
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>⚡</span>}
        label="Competenze"
        onClick={() => toggleWindow('skills')}
        x={iconPositions.skills.x}
        y={iconPositions.skills.y}
        isSelected={selectedIcon === 'skills'}
        onSelect={() => setSelectedIcon('skills')}
        onPositionChange={(x, y) => handleIconPositionChange('skills', x, y)}
      />
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>🎓</span>}
        label="Formazione"
        onClick={() => toggleWindow('education')}
        x={iconPositions.education.x}
        y={iconPositions.education.y}
        isSelected={selectedIcon === 'education'}
        onSelect={() => setSelectedIcon('education')}
        onPositionChange={(x, y) => handleIconPositionChange('education', x, y)}
      />
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>🏆</span>}
        label="Certificazioni"
        onClick={() => toggleWindow('certifications')}
        x={iconPositions.certifications.x}
        y={iconPositions.certifications.y}
        isSelected={selectedIcon === 'certifications'}
        onSelect={() => setSelectedIcon('certifications')}
        onPositionChange={(x, y) => handleIconPositionChange('certifications', x, y)}
      />
      <DesktopIcon
        icon={<span style={{ fontSize: window.innerWidth <= 480 ? '36px' : window.innerWidth <= 768 ? '40px' : '48px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>📝</span>}
        label="Note"
        onClick={() => toggleWindow('note')}
        x={iconPositions.note.x}
        y={iconPositions.note.y}
        isSelected={selectedIcon === 'note'}
        onSelect={() => setSelectedIcon('note')}
        onPositionChange={(x, y) => handleIconPositionChange('note', x, y)}
      />
      {openWindows.about && !minimizedWindows.has('about') && (
        <Window
          title="Presentazione.txt"
          width={650}
          height={450}
          defaultPosition={{ x: 50, y: 50 }}
          onClose={() => toggleWindow('about')}
          onMinimize={() => handleMinimize('about')}
        >
          <About />
        </Window>
      )}

      {openWindows.personalInfo && !minimizedWindows.has('personalInfo') && (
        <Window
          title="Informazioni Personali.txt"
          width={600}
          height={500}
          defaultPosition={{ x: 200, y: 100 }}
          onClose={() => toggleWindow('personalInfo')}
          onMinimize={() => handleMinimize('personalInfo')}
        >
          <PersonalInfo />
        </Window>
      )}

      {openWindows.workExperience && !minimizedWindows.has('workExperience') && (
        <Window
          title="Esperienze Lavorative.txt"
          width={700}
          height={600}
          defaultPosition={{ x: 300, y: 150 }}
          onClose={() => toggleWindow('workExperience')}
          onMinimize={() => handleMinimize('workExperience')}
        >
          <WorkExperience />
        </Window>
      )}

      {openWindows.skills && !minimizedWindows.has('skills') && (
        <Window
          title="Competenze.txt"
          width={650}
          height={500}
          defaultPosition={{ x: 150, y: 200 }}
          onClose={() => toggleWindow('skills')}
          onMinimize={() => handleMinimize('skills')}
        >
          <Skills />
        </Window>
      )}

      {openWindows.education && !minimizedWindows.has('education') && (
        <Window
          title="Formazione.txt"
          width={600}
          height={500}
          defaultPosition={{ x: 400, y: 100 }}
          onClose={() => toggleWindow('education')}
          onMinimize={() => handleMinimize('education')}
        >
          <Education />
        </Window>
      )}

      {openWindows.certifications && !minimizedWindows.has('certifications') && (
        <Window
          title="Certificazioni.txt"
          width={600}
          height={600}
          defaultPosition={{ x: 250, y: 250 }}
          onClose={() => toggleWindow('certifications')}
          onMinimize={() => handleMinimize('certifications')}
        >
          <Certifications />
        </Window>
      )}

      {openWindows.note && !minimizedWindows.has('note') && (
        <Window
          title="Note - Form Contatti"
          width={700}
          height={700}
          defaultPosition={{ x: 350, y: 100 }}
          onClose={() => toggleWindow('note')}
          onMinimize={() => handleMinimize('note')}
          glassFrame={true}
          glassColor="#4a9eff"
        >
          <Note />
        </Window>
      )}
      {openWindows.documents && !minimizedWindows.has('documents') && (
        <DocumentsWindow 
          onClose={() => toggleWindow('documents')} 
          onMinimize={() => handleMinimize('documents')}
        />
      )}
      {openWindows.images && !minimizedWindows.has('images') && (
        <ImagesWindow 
          onClose={() => toggleWindow('images')} 
          onBackgroundChange={setDesktopBackground}
          currentBackground={desktopBackground}
          isSlideshowEnabled={isSlideshowEnabled}
          slideshowIntervalSeconds={slideshowIntervalSeconds}
          onSlideshowChange={handleSlideshowChange}
          onMinimize={() => handleMinimize('images')}
        />
      )}
      {openWindows.computer && !minimizedWindows.has('computer') && (
        <ComputerWindow 
          onClose={() => toggleWindow('computer')} 
          onMinimize={() => handleMinimize('computer')}
        />
      )}
      {openWindows.music && !minimizedWindows.has('music') && (
        <MusicWindow 
          onClose={() => toggleWindow('music')} 
          onMinimize={() => handleMinimize('music')}
        />
      )}

      {/* Taskbar Windows 7 */}
      <div
        className="taskbar"
        style={{
          position: window.innerWidth <= 480 ? 'fixed' : 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(to bottom, rgba(30, 50, 90, 0.75) 0%, rgba(15, 30, 70, 0.85) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
          padding: '0',
          display: 'flex',
          gap: '2px',
          zIndex: 10000,
          height: window.innerWidth <= 480 ? '50px' : '40px',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Start Button Windows 7 - Circolare */}
        <button
          className="start-button"
          onClick={() => setShowStartMenu(!showStartMenu)}
          style={{
            padding: '0',
            fontSize: '13px',
            fontWeight: 'bold',
            background: showStartMenu
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            border: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '45px',
            height: '40px',
            borderRadius: '0',
            boxShadow: showStartMenu || openWindows.about || openWindows.personalInfo || openWindows.workExperience || openWindows.skills || openWindows.education || openWindows.certifications || openWindows.note || openWindows.documents || openWindows.images || openWindows.computer || openWindows.music
              ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(100, 150, 255, 0.4)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s',
            position: 'relative',
          }}
        >
          <img 
            src={taskbarIcon} 
            alt="Windows" 
            style={{ 
              width: '22px', 
              height: '22px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
            }} 
          />
        </button>
        <div style={{ width: '1px', background: 'rgba(0, 0, 0, 0.4)', height: '70%', margin: '0 3px' }} />
        <button
          className={`taskbar-button ${isWindowActive('about') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('about')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('about')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('about') ? 'blur(25px)' : 'none',
            WebkitBackdropFilter: isWindowActive('about') ? 'blur(25px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('about') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('about')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-file-alt" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('personalInfo') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('personalInfo')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('personalInfo')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('personalInfo') ? 'blur(25px)' : 'none',
            WebkitBackdropFilter: isWindowActive('personalInfo') ? 'blur(25px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('personalInfo') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('personalInfo')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-user" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('workExperience') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('workExperience')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('workExperience')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('workExperience') ? 'blur(15px)' : 'none',
            WebkitBackdropFilter: isWindowActive('workExperience') ? 'blur(15px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('workExperience') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('workExperience')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-briefcase" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('skills') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('skills')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('skills')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('skills') ? 'blur(15px)' : 'none',
            WebkitBackdropFilter: isWindowActive('skills') ? 'blur(15px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('skills') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('skills')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-bolt" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('education') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('education')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('education')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('education') ? 'blur(15px)' : 'none',
            WebkitBackdropFilter: isWindowActive('education') ? 'blur(15px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('education') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('education')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-graduation-cap" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('certifications') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('certifications')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('certifications')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('certifications') ? 'blur(15px)' : 'none',
            WebkitBackdropFilter: isWindowActive('certifications') ? 'blur(15px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('certifications') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('certifications')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-trophy" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('note') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('note')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('note')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('note') ? 'blur(15px)' : 'none',
            WebkitBackdropFilter: isWindowActive('note') ? 'blur(15px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('note') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('note')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-sticky-note" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('music') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('music')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('music')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('music') ? 'blur(25px)' : 'none',
            WebkitBackdropFilter: isWindowActive('music') ? 'blur(25px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('music') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('music')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-music" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('documents') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('documents')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('documents')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('documents') ? 'blur(25px)' : 'none',
            WebkitBackdropFilter: isWindowActive('documents') ? 'blur(25px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('documents') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('documents')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-folder" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('images') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('images')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('images')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('images') ? 'blur(25px)' : 'none',
            WebkitBackdropFilter: isWindowActive('images') ? 'blur(25px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('images') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('images')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-images" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <button
          className={`taskbar-button ${isWindowActive('computer') ? 'is-active' : ''}`}
          onClick={() => toggleWindow('computer')}
          style={{
            padding: '4px 12px',
            fontSize: '11px',
            border: 'none',
            background: isWindowActive('computer')
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
              : 'transparent',
            backdropFilter: isWindowActive('computer') ? 'blur(25px)' : 'none',
            WebkitBackdropFilter: isWindowActive('computer') ? 'blur(25px)' : 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: isWindowActive('computer') ? 'bold' : 'normal',
            minWidth: 'auto',
            width: 'auto',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            borderRadius: '2px',
            margin: '2px',
            boxShadow: isWindowActive('computer')
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          <i className="fas fa-desktop" style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', display: 'inline-block', visibility: 'visible', opacity: 1, color: '#fff' }}></i>
        </button>
        <div style={{ flex: 1 }} />
        <div
          className="taskbar-clock"
          style={{
            padding: '0 12px',
            fontSize: '12px',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            minWidth: '70px',
            justifyContent: 'center',
            color: '#fff',
            height: '100%',
            borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
          }}
        >
          {currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      </div>
      )}
    </>
  )
}

export default App
