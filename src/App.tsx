import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import Window from './components/Window'
import DesktopIcon from './components/DesktopIcon'
import WelcomeModal from './components/WelcomeModal'
import BootScreen from './components/BootScreen'
import StartMenu from './components/StartMenu'
import ShutdownScreen from './components/ShutdownScreen'
import LoadingFallback from './components/LoadingFallback'
import TaskbarThumbnail from './components/TaskbarThumbnail'
import taskbarIcon from './assets/icona taskbar.png'
import folderIcon from './assets/icone/cartella.png'
import infoIcon from './assets/icone/info.png'
import userIcon from './assets/icone/user.png'
import certificationsIcon from './assets/icone/certificazioni.png'
import musicIcon from './assets/icone/music.png'
import workExperienceIcon from './assets/icone/esperienze.png'
import skillsIcon from './assets/icone/competenze.png'
import educationIcon from './assets/icone/formazione.png'
import noteIcon from './assets/icone/note.png'
import immaginiIcon from './assets/icone/immagini.png'
import computerIcon from './assets/icone/computer.png'
import linkedinIcon from './assets/icone/linkedin.png'
import paintIcon from './assets/icone/paint.png'
import firefoxIcon from './assets/icone/firefox.png'
import calculatorIcon from './assets/icone/calculator.png'
import portfolioIcon from './assets/icone/portfolio.png'
import cestinoIcon from './assets/icone/cestino.png'
import antivirusIcon from './assets/icone/antivirus.png'
import calendarIcon from './assets/icone/calendar.png'
import msnIcon from './assets/icone/msn.png'
import defaultBackground from './assets/sfondo.jpg'
import './App.css'

// Lazy loading dei componenti delle finestre
const About = lazy(() => import('./components/About'))
const PersonalInfo = lazy(() => import('./components/PersonalInfo'))
const WorkExperience = lazy(() => import('./components/WorkExperience'))
const Skills = lazy(() => import('./components/Skills'))
const Education = lazy(() => import('./components/Education'))
const Certifications = lazy(() => import('./components/Certifications'))
const Note = lazy(() => import('./components/Note'))
const DocumentsWindow = lazy(() => import('./components/DocumentsWindow'))
const ImagesWindow = lazy(() => import('./components/ImagesWindow'))
const ComputerWindow = lazy(() => import('./components/ComputerWindow'))
const MusicWindow = lazy(() => import('./components/MusicWindow'))
const PaintWindow = lazy(() => import('./components/PaintWindow'))
const BrowserWindow = lazy(() => import('./components/BrowserWindow'))
const Calculator = lazy(() => import('./components/Calculator'))
const Portfolio = lazy(() => import('./components/Portfolio'))
const Cestino = lazy(() => import('./components/Cestino'))
const AntiVirus = lazy(() => import('./components/AntiVirus'))
const Calendar = lazy(() => import('./components/Calendar'))
const MsnWindow = lazy(() => import('./components/MsnWindow'))

// Carica dinamicamente tutti i file jpg dalla cartella sfondo per lo slideshow (lazy loading)
const backgroundImages = import.meta.glob('./assets/sfondo/*.jpg', { eager: false }) as Record<string, () => Promise<{ default: string }>>

function App() {
  const [showBootScreen, setShowBootScreen] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [userName, setUserName] = useState('Guest')
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showShutdownScreen, setShowShutdownScreen] = useState(false)
  const [showFloatingMenu, setShowFloatingMenu] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
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
    paint: false,
    browser: false,
    calculator: false,
    portfolio: false,
    cestino: false,
    antivirus: false,
    calendar: false,
    msn: false,
  })
  const [minimizedWindows, setMinimizedWindows] = useState<Set<keyof typeof openWindows>>(new Set())
  const [desktopBackground, setDesktopBackground] = useState(defaultBackground)
  const [desktopBackgroundType, setDesktopBackgroundType] = useState<'image' | 'video'>('image')
  const [isSlideshowEnabled, setIsSlideshowEnabled] = useState(false)
  const [slideshowIntervalSeconds, setSlideshowIntervalSeconds] = useState(5)
  const [, setCurrentSlideshowIndex] = useState(0)
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null)

  // Ottieni lista di tutti gli sfondi disponibili (escluso Starter) - lazy loading
  const [allBackgrounds, setAllBackgrounds] = useState<string[]>([defaultBackground])

  useEffect(() => {
    if (!showFloatingMenu) {
      setMobileSearchQuery('')
    }
  }, [showFloatingMenu])

  useEffect(() => {
    // Carica le immagini in modo lazy
    const sortedFiles = Object.entries(backgroundImages)
      .map(([path, loader]) => {
        const fileName = path.split('/').pop()?.replace('.jpg', '') || ''
        const numMatch = fileName.match(/\d+/)
        const num = numMatch ? parseInt(numMatch[0]) : 999
        return {
          path,
          loader,
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

    // Pre-carica solo le prime 3 immagini in background
    sortedFiles.slice(0, 3).forEach((file) => {
      file.loader().then((module) => {
        setAllBackgrounds((prev) => {
          if (!prev.includes(module.default)) {
            return [...prev, module.default]
          }
          return prev
        })
      }).catch((error) => {
        console.warn(`Failed to load background: ${file.path}`, error)
      })
    })

    // Carica le altre immagini progressivamente
    sortedFiles.slice(3).forEach((file, index) => {
      setTimeout(() => {
        file.loader().then((module) => {
          setAllBackgrounds((prev) => {
            if (!prev.includes(module.default)) {
              return [...prev, module.default]
            }
            return prev
          })
        }).catch((error) => {
          console.warn(`Failed to load background: ${file.path}`, error)
        })
      }, (index + 1) * 500) // Carica ogni 500ms per non sovraccaricare
    })
  }, [])

  // Impostazioni accessibilità
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    showAnimations: true,
    screenReader: false,
    iconSize: 'medium' as 'small' | 'medium' | 'large',
    focusVisible: true,
  })

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredTaskbarButton, setHoveredTaskbarButton] = useState<{
    window: keyof typeof openWindows
    buttonRect: DOMRect
  } | null>(null)
  const getInitialIconPositions = useCallback(() => {
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
        linkedin: { x: 100, y: 260 },
        paint: { x: 20, y: 340 },
        browser: { x: 100, y: 340 },
        calculator: { x: 20, y: 420 },
        portfolio: { x: 100, y: 420 },
        cestino: { x: 20, y: 500 },
        antivirus: { x: 100, y: 500 },
        calendar: { x: 20, y: 580 },
        msn: { x: 100, y: 580 },
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
        linkedin: { x: 130, y: 210 },
        paint: { x: 230, y: 210 },
        browser: { x: 30, y: 300 },
        calculator: { x: 130, y: 300 },
        portfolio: { x: 230, y: 300 },
        cestino: { x: 30, y: 390 },
        antivirus: { x: 130, y: 390 },
        calendar: { x: 230, y: 390 },
        msn: { x: 30, y: 480 },
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
        linkedin: { x: 800, y: 30 },
        paint: { x: 910, y: 30 },
        browser: { x: 30, y: 130 },
        calculator: { x: 140, y: 130 },
        portfolio: { x: 250, y: 130 },
        cestino: { x: window.innerWidth - 100, y: window.innerHeight - 150 },
        antivirus: { x: 360, y: 130 },
        calendar: { x: 470, y: 130 },
        msn: { x: 580, y: 130 },
      }
    }
  }, [])

  const [iconPositions, setIconPositions] = useState(() => getInitialIconPositions())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Gestione resize per responsive con debounce ottimizzato
    let resizeTimeout: number
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(() => {
        setIconPositions(getInitialIconPositions())
        setWindowWidth(window.innerWidth)
      }, 200)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearInterval(timer)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleClose = useCallback((window: keyof typeof openWindows) => {
    // Chiudi la finestra
    setOpenWindows((prev) => ({ ...prev, [window]: false }))
    setMinimizedWindows((prevMin) => {
      const newMin = new Set(prevMin)
      newMin.delete(window)
      return newMin
    })
  }, [])

  const toggleWindow = useCallback((window: keyof typeof openWindows) => {
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
  }, [minimizedWindows])

  const handleTaskbarClick = useCallback((window: keyof typeof openWindows) => {
    // Se la finestra è minimizzata, riaprila
    if (minimizedWindows.has(window)) {
      setMinimizedWindows((prevMin) => {
        const newMin = new Set(prevMin)
        newMin.delete(window)
        return newMin
      })
      setOpenWindows((prev) => ({ ...prev, [window]: true }))
      return
    }
    // Se la finestra è già aperta e attiva, non fare nulla (rimane aperta)
    if (openWindows[window] && !minimizedWindows.has(window)) {
      return
    }
    // Se la finestra è chiusa, aprila
    setOpenWindows((prev) => ({ ...prev, [window]: true }))
  }, [minimizedWindows, openWindows])

  const handleMinimize = useCallback((window: keyof typeof openWindows) => {
    setMinimizedWindows((prev) => {
      const newMin = new Set(prev)
      newMin.add(window)
      return newMin
    })
    // La finestra rimane "aperta" ma viene nascosta
  }, [])


  // Helper per verificare se una finestra è attiva (aperta e non minimizzata)
  const isWindowActive = useCallback((window: keyof typeof openWindows) => {
    return openWindows[window] && !minimizedWindows.has(window)
  }, [openWindows, minimizedWindows])

  const handleDesktopClick = useCallback(() => {
    setSelectedIcon(null)
  }, [])

  const handleIconPositionChange = useCallback((iconKey: keyof typeof iconPositions, x: number, y: number) => {
    setIconPositions((prev) => ({
      ...prev,
      [iconKey]: { x, y },
    }))
  }, [])

  const handleBootComplete = useCallback((name: string) => {
    setUserName(name)
    setShowBootScreen(false)
    // Piccolo delay per assicurarsi che il suono parta
    setTimeout(() => {
      setShowWelcomeModal(true)
    }, 200)
  }, [])

  const handleRestart = useCallback(() => {
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
      paint: false,
      browser: false,
      calculator: false,
      portfolio: false,
      cestino: false,
      antivirus: false,
      calendar: false,
      msn: false,
    })
    setSelectedIcon(null)
    setDesktopBackground(defaultBackground)
    setMinimizedWindows(new Set())
    // Reset posizioni icone
    setIconPositions(getInitialIconPositions())
    // Reset impostazioni accessibilità
    setAccessibilitySettings({
      highContrast: false,
      fontSize: 'medium' as 'small' | 'medium' | 'large',
      showAnimations: true,
      screenReader: false,
      iconSize: 'medium' as 'small' | 'medium' | 'large',
      focusVisible: true,
    })
  }, [])

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

    // Focus visibile
    if (accessibilitySettings.focusVisible) {
      root.style.setProperty('--focus-outline', '2px solid rgba(100, 150, 255, 0.8)')
      const style = document.createElement('style')
      style.id = 'focus-visible-style'
      style.textContent = `
        *:focus-visible {
          outline: 2px solid rgba(100, 150, 255, 0.8) !important;
          outline-offset: 2px !important;
        }
      `
      if (!document.getElementById('focus-visible-style')) {
        document.head.appendChild(style)
      }
    } else {
      root.style.removeProperty('--focus-outline')
      const style = document.getElementById('focus-visible-style')
      if (style) {
        style.remove()
      }
    }

    // Dimensione icone desktop
    const iconSizeMap = {
      small: { icon: '36px', container: '40px' },
      medium: { icon: '48px', container: '48px' },
      large: { icon: '60px', container: '60px' },
    }
    const iconSize = iconSizeMap[accessibilitySettings.iconSize]
    root.style.setProperty('--icon-size', iconSize.icon)
    root.style.setProperty('--icon-container-size', iconSize.container)
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

  const handleSlideshowChange = useCallback((enabled: boolean, seconds: number) => {
    setIsSlideshowEnabled(enabled)
    setSlideshowIntervalSeconds(seconds)

    // Se si attiva lo slideshow, trova l'indice dello sfondo corrente
    if (enabled) {
      const currentIndex = allBackgrounds.findIndex(bg => bg === desktopBackground)
      setCurrentSlideshowIndex(currentIndex >= 0 ? currentIndex : 0)
    }
  }, [allBackgrounds, desktopBackground])

  // Helper per ottenere il titolo della finestra
  const getWindowTitle = useCallback((window: keyof typeof openWindows): string => {
    const titles: Record<keyof typeof openWindows, string> = {
      about: 'Presentazione.txt',
      personalInfo: 'Informazioni Personali.txt',
      workExperience: 'Esperienze Lavorative.txt',
      skills: 'Competenze.txt',
      education: 'Formazione.txt',
      certifications: 'Certificazioni.txt',
      note: 'Note - Form Contatti',
      documents: 'Documenti',
      images: 'Immagini - Sfondo Desktop',
      computer: 'Computer - Informazioni Sistema',
      music: 'Musica',
      paint: 'Paint',
      browser: 'Mozilla Firefox',
      calculator: 'Calcolatrice',
      portfolio: 'Portfolio - Progetti',
      cestino: 'Cestino',
      antivirus: 'Anti-Virus - Protezione Sistema',
      calendar: 'Calendario',
      msn: 'MSN Messenger',
    }
    return titles[window] || 'Finestra'
  }, [])

  // Handler per hover sui pulsanti della taskbar
  const thumbnailHoverTimeoutRef = useRef<number | null>(null)

  const handleTaskbarButtonHover = useCallback((window: keyof typeof openWindows, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHoveredTaskbarButton({ window, buttonRect: rect })
  }, [])

  const handleTaskbarButtonLeave = useCallback(() => {
    // Cancella eventuali timeout precedenti
    if (thumbnailHoverTimeoutRef.current) {
      clearTimeout(thumbnailHoverTimeoutRef.current)
    }
    // Delay per permettere al mouse di entrare nel thumbnail
    thumbnailHoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredTaskbarButton(null)
      thumbnailHoverTimeoutRef.current = null
    }, 200)
  }, [])

  const handleThumbnailEnter = useCallback(() => {
    // Cancella il timeout se il mouse entra nel thumbnail
    if (thumbnailHoverTimeoutRef.current) {
      clearTimeout(thumbnailHoverTimeoutRef.current)
      thumbnailHoverTimeoutRef.current = null
    }
  }, [])

  const handleThumbnailLeave = useCallback(() => {
    // Chiudi il thumbnail quando si esce
    setHoveredTaskbarButton(null)
  }, [])



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
            backgroundImage: desktopBackgroundType === 'image' && desktopBackground.startsWith('linear-gradient')
              ? desktopBackground
              : desktopBackgroundType === 'image' ? `url(${desktopBackground})` : 'none',
            backgroundSize: desktopBackground.startsWith('linear-gradient') ? 'auto' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={handleDesktopClick}
        >
          {desktopBackgroundType === 'video' && (
            <video
              ref={desktopVideoRef}
              src={desktopBackground}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
          )}
          <div style={
            windowWidth <= 768
              ? {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '10px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                alignContent: 'flex-start',
                justifyContent: 'flex-start',
                gap: '8px 10px',
                overflow: 'hidden',
                zIndex: 1,
              }
              : { position: 'relative', zIndex: 1, width: '100%', height: '100%' }
          }>
            {/* Desktop Icons */}
            <DesktopIcon
              icon={<img src={infoIcon} alt="Presentazione" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Presentazione"
              onClick={() => toggleWindow('about')}
              x={iconPositions.about.x}
              y={iconPositions.about.y}
              isSelected={selectedIcon === 'about'}
              onSelect={() => setSelectedIcon('about')}
              onPositionChange={(x, y) => handleIconPositionChange('about', x, y)}
            />
            <DesktopIcon
              icon={<img src={userIcon} alt="Info Personali" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Info Personali"
              onClick={() => toggleWindow('personalInfo')}
              x={iconPositions.personalInfo.x}
              y={iconPositions.personalInfo.y}
              isSelected={selectedIcon === 'personalInfo'}
              onSelect={() => setSelectedIcon('personalInfo')}
              onPositionChange={(x, y) => handleIconPositionChange('personalInfo', x, y)}
            />
            <DesktopIcon
              icon={<img src={workExperienceIcon} alt="Esperienze" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Esperienze"
              onClick={() => toggleWindow('workExperience')}
              x={iconPositions.workExperience.x}
              y={iconPositions.workExperience.y}
              isSelected={selectedIcon === 'workExperience'}
              onSelect={() => setSelectedIcon('workExperience')}
              onPositionChange={(x, y) => handleIconPositionChange('workExperience', x, y)}
            />
            <DesktopIcon
              icon={<img src={skillsIcon} alt="Competenze" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Competenze"
              onClick={() => toggleWindow('skills')}
              x={iconPositions.skills.x}
              y={iconPositions.skills.y}
              isSelected={selectedIcon === 'skills'}
              onSelect={() => setSelectedIcon('skills')}
              onPositionChange={(x, y) => handleIconPositionChange('skills', x, y)}
            />
            <DesktopIcon
              icon={<img src={educationIcon} alt="Formazione" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Formazione"
              onClick={() => toggleWindow('education')}
              x={iconPositions.education.x}
              y={iconPositions.education.y}
              isSelected={selectedIcon === 'education'}
              onSelect={() => setSelectedIcon('education')}
              onPositionChange={(x, y) => handleIconPositionChange('education', x, y)}
            />
            <DesktopIcon
              icon={<img src={certificationsIcon} alt="Certificazioni" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Certificazioni"
              onClick={() => toggleWindow('certifications')}
              x={iconPositions.certifications.x}
              y={iconPositions.certifications.y}
              isSelected={selectedIcon === 'certifications'}
              onSelect={() => setSelectedIcon('certifications')}
              onPositionChange={(x, y) => handleIconPositionChange('certifications', x, y)}
            />
            <DesktopIcon
              icon={<img src={noteIcon} alt="Note" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Note"
              onClick={() => toggleWindow('note')}
              x={iconPositions.note.x}
              y={iconPositions.note.y}
              isSelected={selectedIcon === 'note'}
              onSelect={() => setSelectedIcon('note')}
              onPositionChange={(x, y) => handleIconPositionChange('note', x, y)}
            />
            {iconPositions.linkedin && (
              <DesktopIcon
                icon={<img src={linkedinIcon} alt="LinkedIn" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
                label="LinkedIn"
                onClick={() => window.open('https://www.linkedin.com/in/biagio-scaglia/', '_blank')}
                x={iconPositions.linkedin.x}
                y={iconPositions.linkedin.y}
                isSelected={selectedIcon === 'linkedin'}
                onSelect={() => setSelectedIcon('linkedin')}
                onPositionChange={(x, y) => handleIconPositionChange('linkedin', x, y)}
              />
            )}
            {iconPositions.paint && (
              <DesktopIcon
                icon={<img src={paintIcon} alt="Paint" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
                label="Paint"
                onClick={() => toggleWindow('paint')}
                x={iconPositions.paint.x}
                y={iconPositions.paint.y}
                isSelected={selectedIcon === 'paint'}
                onSelect={() => setSelectedIcon('paint')}
                onPositionChange={(x, y) => handleIconPositionChange('paint', x, y)}
              />
            )}
            {iconPositions.browser && (
              <DesktopIcon
                icon={<img src={firefoxIcon} alt="Firefox" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
                label="Firefox"
                onClick={() => toggleWindow('browser')}
                x={iconPositions.browser.x}
                y={iconPositions.browser.y}
                isSelected={selectedIcon === 'browser'}
                onSelect={() => setSelectedIcon('browser')}
                onPositionChange={(x, y) => handleIconPositionChange('browser', x, y)}
              />
            )}
            {iconPositions.calculator && (
              <DesktopIcon
                icon={<img src={calculatorIcon} alt="Calcolatrice" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
                label="Calcolatrice"
                onClick={() => toggleWindow('calculator')}
                x={iconPositions.calculator.x}
                y={iconPositions.calculator.y}
                isSelected={selectedIcon === 'calculator'}
                onSelect={() => setSelectedIcon('calculator')}
                onPositionChange={(x, y) => handleIconPositionChange('calculator', x, y)}
              />
            )}
            {iconPositions.portfolio && (
              <DesktopIcon
                icon={<img src={portfolioIcon} alt="Portfolio" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
                label="Portfolio"
                onClick={() => toggleWindow('portfolio')}
                x={iconPositions.portfolio.x}
                y={iconPositions.portfolio.y}
                isSelected={selectedIcon === 'portfolio'}
                onSelect={() => setSelectedIcon('portfolio')}
                onPositionChange={(x, y) => handleIconPositionChange('portfolio', x, y)}
              />
            )}
            <DesktopIcon
              icon={<img src={cestinoIcon} alt="Cestino" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Cestino"
              onClick={() => toggleWindow('cestino')}
              x={iconPositions.cestino?.x || (window.innerWidth <= 480 ? 20 : window.innerWidth <= 768 ? 30 : window.innerWidth - 100)}
              y={iconPositions.cestino?.y || (window.innerWidth <= 480 ? 500 : window.innerWidth <= 768 ? 390 : window.innerHeight - 150)}
              isSelected={selectedIcon === 'cestino'}
              onSelect={() => setSelectedIcon('cestino')}
              onPositionChange={(x, y) => handleIconPositionChange('cestino', x, y)}
            />
            <DesktopIcon
              icon={<img src={antivirusIcon} alt="Anti-Virus" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Anti-Virus"
              onClick={() => toggleWindow('antivirus')}
              x={iconPositions.antivirus?.x || (window.innerWidth <= 480 ? 100 : window.innerWidth <= 768 ? 30 : 470)}
              y={iconPositions.antivirus?.y || (window.innerWidth <= 480 ? 580 : window.innerWidth <= 768 ? 480 : 130)}
              isSelected={selectedIcon === 'antivirus'}
              onSelect={() => setSelectedIcon('antivirus')}
              onPositionChange={(x, y) => handleIconPositionChange('antivirus', x, y)}
            />
            <DesktopIcon
              icon={<img src={calendarIcon} alt="Calendario" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="Calendario"
              onClick={() => toggleWindow('calendar')}
              x={iconPositions.calendar?.x || (window.innerWidth <= 480 ? 20 : window.innerWidth <= 768 ? 130 : 580)}
              y={iconPositions.calendar?.y || (window.innerWidth <= 480 ? 660 : window.innerWidth <= 768 ? 480 : 130)}
              isSelected={selectedIcon === 'calendar'}
              onSelect={() => setSelectedIcon('calendar')}
              onPositionChange={(x, y) => handleIconPositionChange('calendar', x, y)}
            />
            <DesktopIcon
              icon={<img src={msnIcon} alt="MSN Messenger" style={{ width: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', height: window.innerWidth <= 480 ? '44px' : window.innerWidth <= 768 ? '50px' : '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />}
              label="MSN Messenger"
              onClick={() => toggleWindow('msn')}
              x={iconPositions.msn?.x || (window.innerWidth <= 480 ? 100 : window.innerWidth <= 768 ? 230 : 690)}
              y={iconPositions.msn?.y || (window.innerWidth <= 480 ? 660 : window.innerWidth <= 768 ? 480 : 130)}
              isSelected={selectedIcon === 'msn'}
              onSelect={() => setSelectedIcon('msn')}
              onPositionChange={(x, y) => handleIconPositionChange('msn', x, y)}
            />
            {openWindows.about && !minimizedWindows.has('about') && (
              <Window
                title="Presentazione.txt"
                width={650}
                height={450}
                defaultPosition={{ x: 50, y: 50 }}
                onClose={() => handleClose('about')}
                onMinimize={() => handleMinimize('about')}
                icon={<img src={infoIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <About />
                </Suspense>
              </Window>
            )}

            {openWindows.personalInfo && !minimizedWindows.has('personalInfo') && (
              <Window
                title="Informazioni Personali.txt"
                width={600}
                height={500}
                defaultPosition={{ x: 200, y: 100 }}
                onClose={() => handleClose('personalInfo')}
                onMinimize={() => handleMinimize('personalInfo')}
                icon={<img src={userIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <PersonalInfo />
                </Suspense>
              </Window>
            )}

            {openWindows.workExperience && !minimizedWindows.has('workExperience') && (
              <Window
                title="Esperienze Lavorative.txt"
                width={700}
                height={600}
                defaultPosition={{ x: 300, y: 150 }}
                onClose={() => handleClose('workExperience')}
                onMinimize={() => handleMinimize('workExperience')}
                icon={<img src={workExperienceIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <WorkExperience />
                </Suspense>
              </Window>
            )}

            {openWindows.skills && !minimizedWindows.has('skills') && (
              <Window
                title="Competenze.txt"
                width={650}
                height={500}
                defaultPosition={{ x: 150, y: 200 }}
                onClose={() => handleClose('skills')}
                onMinimize={() => handleMinimize('skills')}
                icon={<img src={skillsIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Skills />
                </Suspense>
              </Window>
            )}

            {openWindows.education && !minimizedWindows.has('education') && (
              <Window
                title="Formazione.txt"
                width={600}
                height={500}
                defaultPosition={{ x: 400, y: 100 }}
                onClose={() => handleClose('education')}
                onMinimize={() => handleMinimize('education')}
                icon={<img src={educationIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Education />
                </Suspense>
              </Window>
            )}

            {openWindows.certifications && !minimizedWindows.has('certifications') && (
              <Window
                title="Certificazioni.txt"
                width={600}
                height={600}
                defaultPosition={{ x: 250, y: 250 }}
                onClose={() => handleClose('certifications')}
                onMinimize={() => handleMinimize('certifications')}
                icon={<img src={certificationsIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Certifications />
                </Suspense>
              </Window>
            )}

            {openWindows.note && !minimizedWindows.has('note') && (
              <Window
                title="Note - Form Contatti"
                width={700}
                height={700}
                defaultPosition={{ x: 350, y: 100 }}
                onClose={() => handleClose('note')}
                onMinimize={() => handleMinimize('note')}
                glassFrame={true}
                glassColor="#4a9eff"
                icon={<img src={noteIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Note />
                </Suspense>
              </Window>
            )}
            {openWindows.documents && !minimizedWindows.has('documents') && (
              <Suspense fallback={<LoadingFallback />}>
                <DocumentsWindow
                  onClose={() => handleClose('documents')}
                  onMinimize={() => handleMinimize('documents')}
                  icon={<img src={folderIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.images && !minimizedWindows.has('images') && (
              <Suspense fallback={<LoadingFallback />}>
                <ImagesWindow
                  onClose={() => handleClose('images')}
                  onBackgroundChange={(background: string, type?: 'image' | 'video') => {
                    setDesktopBackground(background)
                    setDesktopBackgroundType(type || (background.endsWith('.mp4') ? 'video' : 'image'))
                    // Se è un video, assicurati che riparta
                    if ((type || (background.endsWith('.mp4') ? 'video' : 'image')) === 'video' && desktopVideoRef.current) {
                      desktopVideoRef.current.load()
                      desktopVideoRef.current.play().catch(() => { })
                    }
                  }}
                  currentBackground={desktopBackground}
                  isSlideshowEnabled={isSlideshowEnabled}
                  slideshowIntervalSeconds={slideshowIntervalSeconds}
                  onSlideshowChange={handleSlideshowChange}
                  onMinimize={() => handleMinimize('images')}
                  icon={<img src={immaginiIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}

            {openWindows.msn && !minimizedWindows.has('msn') && (
              <Suspense fallback={<LoadingFallback />}>
                <MsnWindow
                  onClose={() => handleClose('msn')}
                  onMinimize={() => handleMinimize('msn')}
                  icon={<img src={msnIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.computer && !minimizedWindows.has('computer') && (
              <Suspense fallback={<LoadingFallback />}>
                <ComputerWindow
                  onClose={() => handleClose('computer')}
                  onMinimize={() => handleMinimize('computer')}
                  icon={<img src={computerIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.music && !minimizedWindows.has('music') && (
              <Suspense fallback={<LoadingFallback />}>
                <MusicWindow
                  onClose={() => handleClose('music')}
                  onMinimize={() => handleMinimize('music')}
                  icon={<img src={musicIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.paint && !minimizedWindows.has('paint') && (
              <Suspense fallback={<LoadingFallback />}>
                <PaintWindow
                  onClose={() => handleClose('paint')}
                  onMinimize={() => handleMinimize('paint')}
                  icon={<img src={paintIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.browser && !minimizedWindows.has('browser') && (
              <Suspense fallback={<LoadingFallback />}>
                <BrowserWindow
                  onClose={() => handleClose('browser')}
                  onMinimize={() => handleMinimize('browser')}
                  icon={<img src={firefoxIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.calculator && !minimizedWindows.has('calculator') && (
              <Suspense fallback={<LoadingFallback />}>
                <Calculator
                  onClose={() => handleClose('calculator')}
                  onMinimize={() => handleMinimize('calculator')}
                  icon={<img src={calculatorIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.portfolio && !minimizedWindows.has('portfolio') && (
              <Suspense fallback={<LoadingFallback />}>
                <Portfolio
                  onClose={() => handleClose('portfolio')}
                  onMinimize={() => handleMinimize('portfolio')}
                  icon={<img src={portfolioIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.cestino && !minimizedWindows.has('cestino') && (
              <Suspense fallback={<LoadingFallback />}>
                <Cestino
                  onClose={() => handleClose('cestino')}
                  onMinimize={() => handleMinimize('cestino')}
                  icon={<img src={cestinoIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.antivirus && !minimizedWindows.has('antivirus') && (
              <Suspense fallback={<LoadingFallback />}>
                <AntiVirus
                  onClose={() => handleClose('antivirus')}
                  onMinimize={() => handleMinimize('antivirus')}
                  icon={<img src={antivirusIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
            {openWindows.calendar && !minimizedWindows.has('calendar') && (
              <Suspense fallback={<LoadingFallback />}>
                <Calendar
                  onClose={() => handleClose('calendar')}
                  onMinimize={() => handleMinimize('calendar')}
                  icon={<img src={calendarIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', display: 'block', visibility: 'visible', opacity: 1 }} />}
                />
              </Suspense>
            )}
          </div>

          {/* Taskbar Windows 7 - Desktop only */}
          {windowWidth > 768 && (
            <div
              className="taskbar"
              style={{
                background: 'linear-gradient(to bottom, rgba(30, 50, 90, 0.75) 0%, rgba(15, 30, 70, 0.85) 100%)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 -2px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {/* Start Button Windows 7 - Circolare */}
              <div
                className="start-button circular-btn"
                tabIndex={0}
                onClick={() => setShowStartMenu(!showStartMenu)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowStartMenu(!showStartMenu);
                  }
                }}
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
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  margin: '0 8px',
                  boxShadow: showStartMenu || openWindows.about || openWindows.personalInfo || openWindows.workExperience || openWindows.skills || openWindows.education || openWindows.certifications || openWindows.note || openWindows.documents || openWindows.images || openWindows.computer || openWindows.music || openWindows.paint || openWindows.browser || openWindows.calculator || openWindows.portfolio || openWindows.cestino || openWindows.antivirus || openWindows.calendar
                    ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(100, 150, 255, 0.4)'
                    : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s',
                  position: 'relative',
                  userSelect: 'none',
                  outline: 'none',
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
              </div>
              <div style={{ width: '1px', background: 'rgba(0, 0, 0, 0.4)', height: '70%', margin: '0 3px' }} />
              <button
                className={`taskbar-button ${isWindowActive('about') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('about')}
                onMouseEnter={(e) => handleTaskbarButtonHover('about', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={infoIcon}
                  alt="Presentazione"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('personalInfo') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('personalInfo')}
                onMouseEnter={(e) => handleTaskbarButtonHover('personalInfo', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={userIcon}
                  alt="Info Personali"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('workExperience') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('workExperience')}
                onMouseEnter={(e) => handleTaskbarButtonHover('workExperience', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={workExperienceIcon}
                  alt="Esperienze"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('skills') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('skills')}
                onMouseEnter={(e) => handleTaskbarButtonHover('skills', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={skillsIcon}
                  alt="Competenze"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('education') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('education')}
                onMouseEnter={(e) => handleTaskbarButtonHover('education', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={educationIcon}
                  alt="Formazione"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('certifications') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('certifications')}
                onMouseEnter={(e) => handleTaskbarButtonHover('certifications', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={certificationsIcon}
                  alt="Certificazioni"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('note') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('note')}
                onMouseEnter={(e) => handleTaskbarButtonHover('note', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={noteIcon}
                  alt="Note"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('music') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('music')}
                onMouseEnter={(e) => handleTaskbarButtonHover('music', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={musicIcon}
                  alt="Musica"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('documents') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('documents')}
                onMouseEnter={(e) => handleTaskbarButtonHover('documents', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={folderIcon}
                  alt="Documenti"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('images') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('images')}
                onMouseEnter={(e) => handleTaskbarButtonHover('images', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={immaginiIcon}
                  alt="Immagini"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('computer') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('computer')}
                onMouseEnter={(e) => handleTaskbarButtonHover('computer', e)}
                onMouseLeave={handleTaskbarButtonLeave}
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
                <img
                  src={computerIcon}
                  alt="Computer"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('paint') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('paint')}
                onMouseEnter={(e) => handleTaskbarButtonHover('paint', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('paint')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('paint') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('paint') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('paint') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('paint')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={paintIcon}
                  alt="Paint"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('browser') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('browser')}
                onMouseEnter={(e) => handleTaskbarButtonHover('browser', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('browser')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('browser') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('browser') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('browser') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('browser')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={firefoxIcon}
                  alt="Firefox"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('calculator') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('calculator')}
                onMouseEnter={(e) => handleTaskbarButtonHover('calculator', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('calculator')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('calculator') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('calculator') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('calculator') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('calculator')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={calculatorIcon}
                  alt="Calcolatrice"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('portfolio') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('portfolio')}
                onMouseEnter={(e) => handleTaskbarButtonHover('portfolio', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('portfolio')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('portfolio') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('portfolio') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('portfolio') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('portfolio')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={portfolioIcon}
                  alt="Portfolio"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('cestino') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('cestino')}
                onMouseEnter={(e) => handleTaskbarButtonHover('cestino', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('cestino')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('cestino') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('cestino') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('cestino') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('cestino')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={cestinoIcon}
                  alt="Cestino"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('antivirus') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('antivirus')}
                onMouseEnter={(e) => handleTaskbarButtonHover('antivirus', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('antivirus')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('antivirus') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('antivirus') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('antivirus') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('antivirus')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={antivirusIcon}
                  alt="Anti-Virus"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </button>
              <button
                className={`taskbar-button ${isWindowActive('calendar') ? 'is-active' : ''}`}
                onClick={() => handleTaskbarClick('calendar')}
                onMouseEnter={(e) => handleTaskbarButtonHover('calendar', e)}
                onMouseLeave={handleTaskbarButtonLeave}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  border: 'none',
                  background: isWindowActive('calendar')
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    : 'transparent',
                  backdropFilter: isWindowActive('calendar') ? 'blur(25px)' : 'none',
                  WebkitBackdropFilter: isWindowActive('calendar') ? 'blur(25px)' : 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: isWindowActive('calendar') ? 'bold' : 'normal',
                  minWidth: 'auto',
                  width: 'auto',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '2px',
                  margin: '2px',
                  boxShadow: isWindowActive('calendar')
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 6px rgba(100, 150, 255, 0.3)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={calendarIcon}
                  alt="Calendario"
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
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
          )}

          {/* Floating Button per Mobile/Tablet */}
          {windowWidth <= 768 && (
            <>
              <div
                className="circular-btn"
                tabIndex={0}
                onClick={() => setShowFloatingMenu(!showFloatingMenu)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowFloatingMenu(!showFloatingMenu);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(100, 150, 255, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = showFloatingMenu
                    ? '0 0 30px rgba(100, 150, 255, 0.8), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                    : '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)';
                }}
                style={{
                  position: 'fixed',
                  bottom: '100px',
                  right: '20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: showFloatingMenu
                    ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
                    : 'linear-gradient(to bottom, rgba(30, 50, 90, 0.9) 0%, rgba(15, 30, 70, 0.95) 100%)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: showFloatingMenu ? '3px solid rgba(255, 255, 255, 0.8)' : '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: showFloatingMenu
                    ? '0 0 30px rgba(100, 150, 255, 0.8), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                    : '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10001,
                  transition: 'all 0.3s',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <img
                  src={taskbarIcon}
                  alt="Menu"
                  style={{
                    width: showFloatingMenu ? '40px' : '42px',
                    height: showFloatingMenu ? '40px' : '42px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: showFloatingMenu ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    transition: 'all 0.3s',
                  }}
                />
              </div>

              {/* Floating Menu */}
              {showFloatingMenu && (() => {
                const mobileMenuItems = [
                  { id: 'about', label: 'Presentazione', icon: infoIcon },
                  { id: 'personalInfo', label: 'Info Personali', icon: userIcon },
                  { id: 'workExperience', label: 'Esperienze', icon: workExperienceIcon },
                  { id: 'skills', label: 'Competenze', icon: skillsIcon },
                  { id: 'education', label: 'Formazione', icon: educationIcon },
                  { id: 'certifications', label: 'Certificazioni', icon: certificationsIcon },
                  { id: 'note', label: 'Note', icon: noteIcon },
                  { id: 'documents', label: 'Documenti', icon: folderIcon },
                  { id: 'images', label: 'Immagini', icon: immaginiIcon },
                  { id: 'computer', label: 'Computer', icon: computerIcon },
                  { id: 'music', label: 'Musica', icon: musicIcon },
                  { id: 'paint', label: 'Paint', icon: paintIcon },
                  { id: 'browser', label: 'Firefox', icon: firefoxIcon },
                  { id: 'calculator', label: 'Calcolatrice', icon: calculatorIcon },
                  { id: 'portfolio', label: 'Portfolio', icon: portfolioIcon },
                  { id: 'cestino', label: 'Cestino', icon: cestinoIcon },
                  { id: 'antivirus', label: 'Anti-Virus', icon: antivirusIcon },
                  { id: 'calendar', label: 'Calendario', icon: calendarIcon },
                  { id: 'msn', label: 'MSN Messenger', icon: msnIcon },
                  { id: 'desktopStartMenu', label: 'Start Menu', icon: taskbarIcon },
                ];

                const filteredMobileItems = mobileMenuItems.filter(item =>
                  item.label.toLowerCase().includes(mobileSearchQuery.toLowerCase())
                );

                return (
                  <div
                    onClick={() => setShowFloatingMenu(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.4)',
                      zIndex: 10000,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'fixed',
                        bottom: '190px',
                        left: windowWidth <= 480 ? '20px' : 'auto',
                        right: '20px',
                        width: windowWidth <= 480 ? 'calc(100vw - 40px)' : '380px',
                        maxHeight: 'calc(100vh - 280px)',
                        background: 'linear-gradient(135deg, rgba(25, 55, 95, 0.85) 0%, rgba(12, 30, 60, 0.9) 100%)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: 'Segoe UI, Tahoma, sans-serif',
                        zIndex: 10001,
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 18px',
                        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img src={userIcon} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Biagio Scaglia</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>Web Developer</span>
                        </div>
                      </div>

                      {/* Scrollable Items Grid */}
                      <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '12px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px',
                      }}>
                        {filteredMobileItems.map((item) => {
                          const isActive = item.id === 'desktopStartMenu'
                            ? showStartMenu
                            : isWindowActive(item.id as keyof typeof openWindows);

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (item.id === 'desktopStartMenu') {
                                  setShowStartMenu(true);
                                  setShowFloatingMenu(false);
                                } else {
                                  toggleWindow(item.id as keyof typeof openWindows);
                                  setShowFloatingMenu(false);
                                }
                              }}
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: isActive
                                  ? 'rgba(255, 255, 255, 0.25)'
                                  : 'rgba(255, 255, 255, 0.08)',
                                border: isActive
                                  ? '1px solid rgba(255, 255, 255, 0.45)'
                                  : '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                outline: 'none',
                                WebkitTapHighlightColor: 'transparent',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                width: '100%',
                                boxSizing: 'border-box',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isActive
                                  ? 'rgba(255, 255, 255, 0.25)'
                                  : 'rgba(255, 255, 255, 0.08)'
                                e.currentTarget.style.borderColor = isActive
                                  ? '1px solid rgba(255, 255, 255, 0.45)'
                                  : '1px solid rgba(255, 255, 255, 0.12)'
                              }}
                            >
                              <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  objectFit: 'contain',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{
                                fontSize: '12px',
                                color: '#ffffff',
                                fontWeight: isActive ? 'bold' : 'normal',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                                flex: 1,
                              }}>
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                        {filteredMobileItems.length === 0 && (
                          <div style={{
                            gridColumn: '1 / -1',
                            padding: '30px 10px',
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '13px',
                            fontStyle: 'italic',
                          }}>
                            Nessun risultato trovato
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        {/* Search Field */}
                        <div style={{
                          flex: 1,
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          <input
                            type="text"
                            placeholder="Cerca programmi e file..."
                            value={mobileSearchQuery}
                            onChange={(e) => setMobileSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '100%',
                              padding: '8px 10px 8px 30px',
                              fontSize: '13px',
                              background: 'rgba(255, 255, 255, 0.15)',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '6px',
                              color: '#fff',
                              outline: 'none',
                              fontFamily: 'Segoe UI, Tahoma, sans-serif',
                              transition: 'all 0.2s',
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                            }}
                          />
                          <i className="fas fa-search" style={{
                            position: 'absolute',
                            left: '10px',
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}></i>
                        </div>

                        {/* Shutdown button */}
                        <button
                          onClick={() => {
                            setShowShutdownScreen(true);
                            setShowFloatingMenu(false);
                          }}
                          style={{
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to bottom, #e05e59 0%, #c9302c 100%)',
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            borderTopColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.15s',
                            outline: 'none',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(to bottom, #eb7470 0%, #d93d39 100%)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(to bottom, #e05e59 0%, #c9302c 100%)'
                          }}
                        >
                          <i className="fas fa-power-off"></i>
                          <span>Spegni</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* Taskbar Thumbnail */}
          {hoveredTaskbarButton && (
            <TaskbarThumbnail
              windowTitle={getWindowTitle(hoveredTaskbarButton.window)}
              isOpen={openWindows[hoveredTaskbarButton.window]}
              isMinimized={minimizedWindows.has(hoveredTaskbarButton.window)}
              onThumbnailEnter={handleThumbnailEnter}
              onThumbnailLeave={handleThumbnailLeave}
              onOpen={() => {
                setOpenWindows((prev) => ({ ...prev, [hoveredTaskbarButton!.window]: true }))
                if (minimizedWindows.has(hoveredTaskbarButton!.window)) {
                  setMinimizedWindows((prev) => {
                    const newMin = new Set(prev)
                    newMin.delete(hoveredTaskbarButton!.window)
                    return newMin
                  })
                }
                setHoveredTaskbarButton(null)
              }}
              onClose={() => {
                handleClose(hoveredTaskbarButton!.window)
                setHoveredTaskbarButton(null)
              }}
              onMinimize={() => {
                handleMinimize(hoveredTaskbarButton!.window)
                setHoveredTaskbarButton(null)
              }}
              buttonRect={hoveredTaskbarButton.buttonRect}
            />
          )}
        </div>
      )}
    </>
  )
}

export default App
