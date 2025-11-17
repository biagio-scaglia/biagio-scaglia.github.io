import { useState, useRef, useEffect } from 'react'
import Window from './Window'
import { Howl } from 'howler'
import musica1 from '../assets/sound/musica 1.mp3'

interface MusicWindowProps {
  onClose: () => void
  onMinimize?: () => void
}

export default function MusicWindow({ onClose, onMinimize }: MusicWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const soundRef = useRef<Howl | null>(null)
  const progressIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Inizializza Howler
    const sound = new Howl({
      src: [musica1],
      volume: volume,
      loop: false,
      html5: false,
      onload: () => {
        setDuration(sound.duration())
      },
      onend: () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }
    })

    soundRef.current = sound

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current.unload()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume)
    }
  }, [volume])

  const togglePlayPause = () => {
    if (!soundRef.current) return

    if (isPlaying) {
      soundRef.current.pause()
      setIsPlaying(false)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    } else {
      soundRef.current.play()
      setIsPlaying(true)
      
      // Aggiorna progress ogni secondo
      progressIntervalRef.current = window.setInterval(() => {
        if (soundRef.current) {
          const time = soundRef.current.seek() as number
          setCurrentTime(time)
        }
      }, 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (soundRef.current) {
      soundRef.current.seek(newTime)
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Window
      title="Windows Media Player - Musica"
      width={500}
      height={400}
      defaultPosition={{ x: 200, y: 150 }}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div style={{ padding: windowWidth <= 480 ? '15px' : '20px', display: 'flex', flexDirection: 'column', gap: windowWidth <= 480 ? '15px' : '20px', height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-music" style={{ fontSize: windowWidth <= 480 ? '36px' : '48px', color: '#0078d4', marginBottom: '10px' }}></i>
          <h2 style={{ margin: '10px 0', fontSize: windowWidth <= 480 ? '16px' : '18px' }}>Musica 1</h2>
          <p style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', color: '#666', margin: '5px 0' }}>File audio</p>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: '100%',
              height: '8px',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: windowWidth <= 480 ? '10px' : '11px', color: '#666' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controlli */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={togglePlayPause}
            style={{
              width: windowWidth <= 480 ? '45px' : '50px',
              height: windowWidth <= 480 ? '45px' : '50px',
              borderRadius: '50%',
              border: '2px solid #c0c0c0',
              background: 'linear-gradient(to bottom, #f0f0f0 0%, #d0d0d0 100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: windowWidth <= 480 ? '18px' : '20px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)',
              padding: '0',
              margin: '0',
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #f0f0f0 0%, #d0d0d0 100%)'
            }}
          >
            <i 
              className={isPlaying ? 'fas fa-pause' : 'fas fa-play'} 
              style={{
                display: 'block',
                lineHeight: '1',
                width: '20px',
                height: '20px',
                textAlign: 'center',
                marginLeft: isPlaying ? '0' : '2px',
              }}
            ></i>
          </button>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: windowWidth <= 480 ? '11px' : '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-volume-up" style={{ fontSize: windowWidth <= 480 ? '14px' : '16px', width: '20px' }}></i>
            <span>Volume: {Math.round(volume * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: '100%',
              height: '6px',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Info */}
        <div style={{ 
          marginTop: 'auto', 
          padding: windowWidth <= 480 ? '8px' : '10px', 
          background: '#f0f0f0', 
          borderRadius: '4px',
          fontSize: windowWidth <= 480 ? '10px' : '11px',
          color: '#666'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Stato:</span>
            <span>{isPlaying ? 'Riproduzione' : 'In pausa'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>File:</span>
            <span>musica 1.mp3</span>
          </div>
        </div>
      </div>
    </Window>
  )
}

