import { useState, useRef, useEffect } from 'react'
import Window from './Window'
import { useWindowSize } from '../hooks/useWindowSize'
import msnSoundFile from '../assets/sound/msn-sound_1.mp3'

interface MsnWindowProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

export default function MsnWindow({ onClose, onMinimize, icon }: MsnWindowProps) {
  const windowSize = useWindowSize()
  const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([
    { sender: 'Biagio', text: 'Ehi! Benvenuto sul mio MSN simulato! 👋', time: '12:00' }
  ])
  const [inputText, setInputText] = useState('')
  const [isNudging, setIsNudging] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef(new Audio(msnSoundFile))

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    setMessages(prev => [...prev, { sender: 'Tu', text: inputText, time }])
    setInputText('')

    // Finta risposta automatica
    setTimeout(() => {
      playSound()
      setMessages(prev => [...prev, { 
        sender: 'Biagio', 
        text: 'Al momento sto scrivendo del codice, ma ti risponderò il prima possibile! 👨‍💻', 
        time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      }])
    }, 1500)
  }

  const handleNudge = () => {
    if (isNudging) return
    setIsNudging(true)
    playSound()
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    setMessages(prev => [...prev, { sender: 'Sistema', text: 'Hai inviato un trillo!', time }])
    
    // Ferma l'animazione dopo 800ms
    setTimeout(() => {
      setIsNudging(false)
    }, 800)
  }

  return (
    <div className={isNudging ? 'nudge-shake' : ''} style={{ width: '100%', height: '100%' }}>
      <Window
        title="MSN Messenger"
        width={windowSize.isMobile ? Math.min(360, window.innerWidth - 20) : 420}
        height={windowSize.isMobile ? Math.min(550, window.innerHeight - 100) : 600}
        defaultPosition={{ 
          x: windowSize.isMobile ? 10 : window.innerWidth / 2 - 210, 
          y: windowSize.isMobile ? 10 : window.innerHeight / 2 - 300 
        }}
        onClose={onClose}
        onMinimize={onMinimize}
        icon={icon}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'linear-gradient(to bottom, #d9f0fc, #ffffff)',
          fontFamily: 'Tahoma, Arial, sans-serif'
        }}>
          {/* Header Profilo */}
          <div style={{
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid #b3d1e6',
            background: 'linear-gradient(to right, #ffffff, #d9f0fc)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              border: '2px solid #8fc3e3',
              borderRadius: '4px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#00477e', fontSize: '14px' }}>
                Biagio Scaglia <span style={{ color: '#008000', fontSize: '12px' }}>(Disponibile)</span>
              </div>
              <div style={{ color: '#555', fontSize: '12px', fontStyle: 'italic', marginTop: '4px' }}>
                "Sviluppando il futuro, un blocco di codice alla volta. 🚀"
              </div>
            </div>
          </div>

          {/* Area Chat */}
          <div style={{
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            background: '#ffffff',
            borderBottom: '1px solid #b3d1e6',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                color: msg.sender === 'Sistema' ? '#d32f2f' : '#000',
                fontWeight: msg.sender === 'Sistema' ? 'bold' : 'normal',
                textAlign: msg.sender === 'Sistema' ? 'center' : 'left'
              }}>
                {msg.sender !== 'Sistema' && (
                  <span style={{ color: msg.sender === 'Tu' ? '#0066cc' : '#000000', fontWeight: 'bold' }}>
                    {msg.sender} dice:
                  </span>
                )}
                <div style={{ marginLeft: msg.sender !== 'Sistema' ? '10px' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2px' }}>
                  <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</span>
                  <span style={{ fontSize: '10px', color: '#999', flexShrink: 0, marginLeft: '10px' }}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Toolbar Simulato */}
          <div style={{
            padding: '6px 10px',
            background: '#eef6fc',
            borderBottom: '1px solid #b3d1e6',
            display: 'flex',
            gap: '5px'
          }}>
            <button 
              onClick={handleNudge}
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '3px',
                color: '#00477e'
              }}
              onMouseOver={e => {
                e.currentTarget.style.border = '1px solid #a3c9e6'
                e.currentTarget.style.background = '#d9f0fc'
              }}
              onMouseOut={e => {
                e.currentTarget.style.border = '1px solid transparent'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: '16px' }}>📳</span> <b>Invia trillo</b>
            </button>
            <button 
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'not-allowed',
                fontSize: '12px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '3px',
                opacity: 0.5,
                color: '#00477e'
              }}
            >
              <span style={{ fontSize: '16px' }}>😊</span> Emoticon
            </button>
          </div>

          {/* Input Chat */}
          <div style={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Scrivi un messaggio qui..."
              style={{
                width: '100%',
                height: '70px',
                resize: 'none',
                border: '1px solid #a3c9e6',
                borderRadius: '4px',
                padding: '8px',
                fontFamily: 'Tahoma, Arial, sans-serif',
                fontSize: '13px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                style={{
                  padding: '6px 20px',
                  background: 'linear-gradient(to bottom, #fefefe, #e2ebf4)',
                  border: '1px solid #7a9ebf',
                  borderRadius: '3px',
                  cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  fontWeight: 'bold',
                  color: '#00477e'
                }}
                onMouseOver={e => {
                  if (inputText.trim()) {
                    e.currentTarget.style.background = 'linear-gradient(to bottom, #ffffff, #cce6f8)'
                  }
                }}
                onMouseOut={e => {
                  if (inputText.trim()) {
                    e.currentTarget.style.background = 'linear-gradient(to bottom, #fefefe, #e2ebf4)'
                  }
                }}
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      </Window>
    </div>
  )
}
