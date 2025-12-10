import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

/**
 * Hook personalizzato per gestire le dimensioni della finestra e i breakpoint responsive
 * Ottimizzato con debounce per migliorare le performance
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    return {
      width,
      height,
      isMobile: width <= 480,
      isTablet: width > 480 && width <= 768,
      isDesktop: width > 768,
    }
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      // Debounce per migliorare le performance
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const width = window.innerWidth
        const height = window.innerHeight
        setWindowSize({
          width,
          height,
          isMobile: width <= 480,
          isTablet: width > 480 && width <= 768,
          isDesktop: width > 768,
        })
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}

