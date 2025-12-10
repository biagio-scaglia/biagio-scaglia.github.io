import { type ReactNode, useState, useRef, useEffect, useCallback } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'

interface WindowProps {
  title: string
  children: ReactNode
  width?: number
  height?: number
  defaultPosition?: { x: number; y: number }
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  glassFrame?: boolean
  glassColor?: string
  icon?: ReactNode
}

export default function Window({
  title,
  children,
  width = 400,
  height = 300,
  defaultPosition = { x: 100, y: 100 },
  onClose,
  onMinimize,
  onMaximize,
  glassFrame = false,
  glassColor,
  icon,
}: WindowProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowSize = useWindowSize()
  const [currentWidth, setCurrentWidth] = useState(width)
  const [currentHeight, setCurrentHeight] = useState(height)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeType, setResizeType] = useState<string | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [savedState, setSavedState] = useState<{ width: number; height: number; x: number; y: number } | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  // Aggiorna le dimensioni quando cambiano le props
  useEffect(() => {
    setCurrentWidth(width)
    setCurrentHeight(height)
  }, [width, height])

  // Aggiorna dimensioni quando la finestra è maximized e cambia la dimensione dello schermo
  useEffect(() => {
    if (isMaximized) {
      setCurrentWidth(windowSize.width - 4)
      setCurrentHeight(windowSize.height - (windowSize.isMobile ? 50 : 60))
    }
  }, [isMaximized, windowSize.width, windowSize.height, windowSize.isMobile])

  useEffect(() => {
    if (!isDragging || isMaximized) return

    let animationFrameId: number
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      
      animationFrameId = requestAnimationFrame(() => {
        // Limita la posizione entro i bordi dello schermo
        const maxX = windowSize.width - currentWidth
        const maxY = windowSize.height - (windowSize.isMobile ? 50 : 60) - currentHeight
        
        setPosition({
          x: Math.max(0, Math.min(maxX, clientX - dragOffset.x)),
          y: Math.max(0, Math.min(maxY, clientY - dragOffset.y)),
        })
      })
    }

    const handleMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    window.addEventListener('touchmove', handleMouseMove, { passive: true })
    window.addEventListener('touchend', handleMouseUp, { passive: true })

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, dragOffset, isMaximized, windowSize, currentWidth, currentHeight])

  // Gestione resize
  useEffect(() => {
    if (!isResizing || !resizeType) return

    let animationFrameId: number
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const minWidth = 200
        const minHeight = 150
        const maxWidth = window.innerWidth - 20
        const maxHeight = window.innerHeight - 100

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newLeft = resizeStart.left
        let newTop = resizeStart.top

        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

      // Resize da est (destra)
      if (resizeType.includes('e')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX))
      }
      // Resize da ovest (sinistra)
      if (resizeType.includes('w')) {
        const widthChange = resizeStart.width - deltaX
        if (widthChange >= minWidth && resizeStart.left + deltaX >= 0) {
          newWidth = widthChange
          newLeft = resizeStart.left + deltaX
        } else if (widthChange < minWidth) {
          newWidth = minWidth
          newLeft = resizeStart.left + resizeStart.width - minWidth
        }
      }
      // Resize da sud (basso)
      if (resizeType.includes('s')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY))
      }
      // Resize da nord (alto)
      if (resizeType.includes('n')) {
        const heightChange = resizeStart.height - deltaY
        if (heightChange >= minHeight && resizeStart.top + deltaY >= 0) {
          newHeight = heightChange
          newTop = resizeStart.top + deltaY
        } else if (heightChange < minHeight) {
          newHeight = minHeight
          newTop = resizeStart.top + resizeStart.height - minHeight
        }
      }

        setCurrentWidth(newWidth)
        setCurrentHeight(newHeight)
        setPosition({ x: newLeft, y: newTop })
      })
    }

    const handleMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      setIsResizing(false)
      setResizeType(null)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeType, resizeStart])

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.title-bar-controls')) {
      return
    }
    if (target.closest('.resize-handle')) {
      return // Non iniziare il drag se si clicca su un resize handle
    }
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      })
      setIsDragging(true)
    }
  }, [])

  const handleResizeStart = (e: React.MouseEvent, type: string) => {
    e.stopPropagation()
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect()
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      })
      setResizeType(type)
      setIsResizing(true)
    }
  }

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore
      if (savedState) {
        setCurrentWidth(savedState.width)
        setCurrentHeight(savedState.height)
        setPosition({ x: savedState.x, y: savedState.y })
      }
      setIsMaximized(false)
      setSavedState(null)
    } else {
      // Maximize
      setSavedState({
        width: currentWidth,
        height: currentHeight,
        x: position.x,
        y: position.y
      })
      const taskbarHeight = windowSize.isMobile ? 50 : 60
      setCurrentWidth(windowSize.width - 4)
      setCurrentHeight(windowSize.height - taskbarHeight)
      setPosition({ x: 2, y: 2 })
      setIsMaximized(true)
    }
    if (onMaximize) {
      onMaximize()
    }
  }, [isMaximized, savedState, currentWidth, currentHeight, position, windowSize, onMaximize])

  // Calcola dimensioni responsive
  const displayWidth = isMaximized 
    ? windowSize.width - 4 
    : (windowSize.isMobile ? '95vw' : windowSize.isTablet ? '90vw' : currentWidth)
  const displayHeight = isMaximized 
    ? windowSize.height - (windowSize.isMobile ? 50 : 60)
    : (windowSize.isMobile ? '85vh' : windowSize.isTablet ? '80vh' : currentHeight)

  return (
    <div
      ref={windowRef}
      className={`window active ${glassFrame ? 'glass' : ''}`}
      style={{
        width: displayWidth,
        height: displayHeight,
        maxWidth: isMaximized ? 'none' : (windowSize.isMobile ? '95vw' : windowSize.isTablet ? '90vw' : 'none'),
        maxHeight: isMaximized ? 'none' : (windowSize.isMobile ? '85vh' : windowSize.isTablet ? '80vh' : 'none'),
        position: 'absolute',
        left: isMaximized ? '2px' : (windowSize.isMobile ? '2.5vw' : `${position.x}px`),
        top: isMaximized ? '2px' : (windowSize.isMobile ? '5vh' : `${position.y}px`),
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: isDragging || isResizing ? 1000 : 100,
        touchAction: 'none',
        ...(glassColor && { '--w7-w-bg': glassColor } as React.CSSProperties),
      }}
    >
      <div
        className={`title-bar active ${glassFrame ? 'glass' : ''}`}
        onMouseDown={isMaximized ? undefined : handleMouseDown}
        onTouchStart={isMaximized ? undefined : handleMouseDown}
        style={{ cursor: isMaximized ? 'default' : 'grab', touchAction: 'none' }}
        role="banner"
        aria-label={`Finestra ${title}`}
      >
        <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'visible' }}>
          {icon && (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', flexShrink: 0, overflow: 'visible', position: 'relative', zIndex: 1 }}>
              {icon}
            </span>
          )}
          <span style={{ flex: '0 0 auto' }}>{title}</span>
        </div>
        <div className="title-bar-controls">
          {onMinimize && (
            <button aria-label="Minimize" onClick={onMinimize} />
          )}
          <button 
            aria-label={isMaximized ? "Restore" : "Maximize"} 
            onClick={handleMaximize}
            className={isMaximized ? "is-restore" : "is-maximize"}
          />
          {onClose && (
            <button aria-label="Close" onClick={onClose} />
          )}
        </div>
      </div>
      <div 
        className="window-body has-space" 
        style={{ 
          overflow: 'auto', 
          maxHeight: windowSize.isMobile 
            ? 'calc(85vh - 50px)' 
            : windowSize.isTablet 
              ? 'calc(80vh - 50px)' 
              : `${currentHeight - 50}px`,
          fontSize: windowSize.isMobile ? '12px' : windowSize.isTablet ? '13px' : 'inherit'
        }}
      >
        {children}
      </div>

      {/* Resize handles - solo su desktop e quando non è maximized */}
      {windowSize.isDesktop && !isMaximized && (
        <>
          {/* Nord (alto) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              cursor: 'ns-resize',
              zIndex: 10,
            }}
          />
          {/* Sud (basso) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 's')}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              cursor: 'ns-resize',
              zIndex: 10,
            }}
          />
          {/* Est (destra) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '4px',
              cursor: 'ew-resize',
              zIndex: 10,
            }}
          />
          {/* Ovest (sinistra) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '4px',
              cursor: 'ew-resize',
              zIndex: 10,
            }}
          />
          {/* Nord-Est (alto-destra) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8px',
              height: '8px',
              cursor: 'nesw-resize',
              zIndex: 10,
            }}
          />
          {/* Nord-Ovest (alto-sinistra) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '8px',
              height: '8px',
              cursor: 'nwse-resize',
              zIndex: 10,
            }}
          />
          {/* Sud-Est (basso-destra) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '8px',
              height: '8px',
              cursor: 'nwse-resize',
              zIndex: 10,
            }}
          />
          {/* Sud-Ovest (basso-sinistra) */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '8px',
              height: '8px',
              cursor: 'nesw-resize',
              zIndex: 10,
            }}
          />
        </>
      )}
    </div>
  )
}

