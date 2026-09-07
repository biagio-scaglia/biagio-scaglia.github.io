import { useState, useRef, useEffect } from 'react'
import Window from './Window'

interface PaintWindowProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

export default function PaintWindow({ onClose, onMinimize, icon }: PaintWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      
      // Imposta dimensioni reali del canvas uguali alle dimensioni visualizzate
      canvas.width = rect.width
      canvas.height = rect.height

      // Sfondo bianco
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    
    // Ridimensiona quando cambia la finestra
    const handleResize = () => {
      resizeCanvas()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let clientX = 0
    let clientY = 0
    
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if ('clientX' in e) {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const { x, y } = getCoordinates(e)

    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.fillStyle = color
    }

    // Disegna un punto esatto dove si clicca
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    if (tool === 'eraser') {
      ctx.fill()
    } else {
      ctx.fill()
    }
    
    // Prepara per il disegno continuo
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    
    // Aggiorna il punto di partenza per il prossimo movimento
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'disegno.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const presetColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#a52a2a', '#808080', '#008000', '#000080', '#800000'
  ]

  return (
    <Window
      title="Paint"
      width={windowWidth <= 480 ? Math.min(350, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(600, window.innerWidth - 40) : 800}
      height={windowWidth <= 480 ? Math.min(500, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(600, window.innerHeight - 80) : 700}
      defaultPosition={{ x: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 100, y: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 50 }}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
    >
      <div style={{ 
        padding: windowWidth <= 480 ? '10px' : '15px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        gap: '10px'
      }}>
        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '8px', 
          padding: '10px',
          background: '#f0f0f0',
          borderRadius: '4px',
          alignItems: 'center'
        }}>
          {/* Strumenti */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setTool('pen')}
              style={{
                padding: '6px 12px',
                background: tool === 'pen' ? '#0078d4' : '#e0e0e0',
                color: tool === 'pen' ? '#fff' : '#000',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                fontWeight: tool === 'pen' ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-pencil-alt"></i> Penna
            </button>
            <button
              onClick={() => setTool('eraser')}
              style={{
                padding: '6px 12px',
                background: tool === 'eraser' ? '#0078d4' : '#e0e0e0',
                color: tool === 'eraser' ? '#fff' : '#000',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                fontWeight: tool === 'eraser' ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-eraser"></i> Gomma
            </button>
          </div>

          {/* Dimensione pennello */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', whiteSpace: 'nowrap' }}>
              Dimensione:
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              style={{ width: '80px' }}
            />
            <span style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', minWidth: '30px' }}>
              {brushSize}px
            </span>
          </div>

          {/* Colore personalizzato */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', whiteSpace: 'nowrap' }}>
              Colore:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '40px',
                height: '30px',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            />
          </div>

          {/* Pulsanti azioni */}
          <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
            <button
              onClick={clearCanvas}
              style={{
                padding: '6px 12px',
                background: '#e0e0e0',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-trash-alt"></i> Pulisci
            </button>
            <button
              onClick={downloadImage}
              style={{
                padding: '6px 12px',
                background: '#e0e0e0',
                border: '1px solid #c0c0c0',
                cursor: 'pointer',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-save"></i> Salva
            </button>
          </div>
        </div>

        {/* Colori predefiniti */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '5px', 
          padding: '8px',
          background: '#f0f0f0',
          borderRadius: '4px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', marginRight: '5px' }}>
            Colori rapidi:
          </span>
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => setColor(presetColor)}
              style={{
                width: windowWidth <= 480 ? '24px' : '28px',
                height: windowWidth <= 480 ? '24px' : '28px',
                background: presetColor,
                border: color === presetColor ? '3px solid #0078d4' : '2px solid #c0c0c0',
                cursor: 'pointer',
                borderRadius: '2px',
                boxShadow: color === presetColor ? '0 0 5px rgba(0, 120, 212, 0.5)' : 'none'
              }}
              title={presetColor}
            />
          ))}
        </div>

        {/* Canvas */}
        <div style={{ 
          flex: 1, 
          border: '2px solid #c0c0c0',
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#ffffff',
          position: 'relative'
        }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              width: '100%',
              height: '100%',
              cursor: tool === 'eraser' ? 'grab' : 'crosshair',
              touchAction: 'none'
            }}
          />
        </div>

        {/* Istruzioni */}
        <div style={{ 
          padding: '8px 12px',
          background: '#f0f0f0',
          borderRadius: '4px',
          fontSize: windowWidth <= 480 ? '10px' : '11px',
          color: '#666',
          fontStyle: 'italic',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="fas fa-lightbulb" style={{ color: '#d69e2e' }}></i> Suggerimento: Usa il mouse o il touch per disegnare. Cambia strumento, colore e dimensione dalla barra degli strumenti.
        </div>
      </div>
    </Window>
  )
}

