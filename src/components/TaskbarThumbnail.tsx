import { useEffect, useRef } from 'react'

interface TaskbarThumbnailProps {
  windowTitle: string
  isOpen: boolean
  isMinimized: boolean
  onOpen: () => void
  onClose: () => void
  onMinimize: () => void
  onThumbnailEnter?: () => void
  onThumbnailLeave?: () => void
  buttonRect: DOMRect | null
}

export default function TaskbarThumbnail({
  windowTitle,
  isOpen,
  isMinimized,
  onOpen,
  onClose,
  onMinimize,
  onThumbnailEnter,
  onThumbnailLeave,
  buttonRect,
}: TaskbarThumbnailProps) {
  const thumbnailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (thumbnailRef.current && buttonRect) {
      const thumbnail = thumbnailRef.current
      const thumbnailRect = thumbnail.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      // Posiziona il thumbnail sopra il pulsante
      let left = buttonRect.left + buttonRect.width / 2 - thumbnailRect.width / 2
      let top = buttonRect.top - thumbnailRect.height - 8

      // Evita che vada fuori a sinistra
      if (left < 10) {
        left = 10
      }

      // Evita che vada fuori a destra
      if (left + thumbnailRect.width > viewportWidth - 10) {
        left = viewportWidth - thumbnailRect.width - 10
      }

      // Evita che vada sopra lo schermo
      if (top < 10) {
        top = buttonRect.bottom + 8
      }

      thumbnail.style.left = `${left}px`
      thumbnail.style.top = `${top}px`
    }
  }, [buttonRect])

  return (
    <div
      ref={thumbnailRef}
      className="taskbar-thumbnail"
      onMouseEnter={onThumbnailEnter}
      onMouseLeave={onThumbnailLeave}
      style={{
        position: 'fixed',
        width: '200px',
        minHeight: '120px',
        background: 'linear-gradient(to bottom, rgba(30, 50, 90, 0.95) 0%, rgba(15, 30, 70, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '6px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        zIndex: 10001,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'auto',
      }}
    >
      {/* Preview area */}
      <div
        style={{
          width: '100%',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          padding: '8px',
        }}
      >
        {windowTitle}
      </div>

      {/* Status text */}
      <div
        style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
        }}
      >
        {isMinimized ? 'Minimizzata' : isOpen ? 'Aperta' : 'Chiusa'}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
        }}
      >
        {isOpen && !isMinimized ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMinimize()
              }}
              className="thumbnail-btn-minimize"
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: '10px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-window-minimize" style={{ marginRight: '4px' }}></i>
              Minimizza
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="thumbnail-btn-close"
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: '10px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-times" style={{ marginRight: '4px' }}></i>
              Chiudi
            </button>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
            className="thumbnail-btn-restore"
            style={{
              width: '100%',
              padding: '8px 16px',
              fontSize: '11px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-window-restore" style={{ marginRight: '6px' }}></i>
            {isMinimized ? 'Ripristina' : 'Apri'}
          </button>
        )}
      </div>
    </div>
  )
}

