import { useState, useEffect } from 'react'

export default function Note() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    messaggio: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Calcola progresso in base ai campi compilati
    const fields = ['nome', 'email', 'messaggio']
    const filledFields = fields.filter(field => {
      if (field === name) return value.trim() !== ''
      return formData[field as keyof typeof formData].trim() !== ''
    }).length
    setProgress((filledFields / fields.length) * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setProgress(0)

    try {
      // Progress bar animata (simulazione)
      const steps = [25, 50, 75]
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress(steps[i])
      }

      // Simulazione invio (senza chiamata reale)
      await new Promise(resolve => setTimeout(resolve, 500))

      setProgress(100)
      await new Promise(resolve => setTimeout(resolve, 300))

      setIsSubmitting(false)
      setSubmitStatus('success')
      
      // Reset form dopo 3 secondi
      setTimeout(() => {
        setFormData({ nome: '', email: '', messaggio: '' })
        setProgress(0)
        setSubmitStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Errore simulazione:', error)
      setIsSubmitting(false)
      setSubmitStatus('error')
      setProgress(0)
      
      // Reset error dopo 5 secondi
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }
  }

  const isFormValid = formData.nome.trim() !== '' && formData.email.trim() !== '' && formData.messaggio.trim() !== ''

  return (
    <div style={{ padding: 'clamp(15px, 3vw, 20px)' }}>
      <h2 style={{ marginTop: 0, fontSize: 'clamp(16px, 4vw, 18px)', marginBottom: '20px' }}>Form Contatti</h2>
      <p style={{ 
        fontSize: 'clamp(11px, 2.5vw, 12px)', 
        color: '#666', 
        marginBottom: '16px',
        fontStyle: 'italic',
        padding: '8px 12px',
        background: '#f0f0f0',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <i className="fas fa-exclamation-triangle" style={{ color: '#d69e2e' }}></i> Questo form è solo simulativo e non invia messaggi reali.
      </p>
      
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Informazioni</legend>
          
          <div className="group" style={{ marginBottom: '16px' }}>
            <label htmlFor="nome" style={{ fontSize: 'clamp(12px, 3vw, 13px)' }}>Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '4px', fontSize: 'clamp(13px, 3.5vw, 14px)', padding: 'clamp(6px, 1.5vw, 8px)' }}
            />
          </div>

          <div className="group" style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{ fontSize: 'clamp(12px, 3vw, 13px)' }}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '4px', fontSize: 'clamp(13px, 3.5vw, 14px)', padding: 'clamp(6px, 1.5vw, 8px)' }}
            />
          </div>

          <div className="group" style={{ marginBottom: '16px' }}>
            <label htmlFor="messaggio" style={{ fontSize: 'clamp(12px, 3vw, 13px)' }}>Messaggio:</label>
            <textarea
              id="messaggio"
              name="messaggio"
              value={formData.messaggio}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={windowWidth <= 480 ? 4 : 5}
              style={{ width: '100%', marginTop: '4px', resize: 'vertical', fontSize: 'clamp(13px, 3.5vw, 14px)', padding: 'clamp(6px, 1.5vw, 8px)' }}
            />
          </div>
        </fieldset>

        {/* Progress Bar di 7.css */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 2.5vw, 12px)' }}>
            Progresso compilazione:
          </label>
          <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%' }}>
            <div style={{ width: `${progress}%`, height: 'clamp(18px, 4vw, 20px)' }} />
          </div>
          <div style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#666', marginTop: '4px' }}>
            {Math.round(progress)}% completato
          </div>
        </div>

        {/* Spinner di 7.css durante l'invio */}
        {isSubmitting && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: 'clamp(10px, 2.5vw, 12px)', background: '#f0f0f0', borderRadius: '4px' }}>
            <div className="spinner animate" aria-label="Invio in corso..." style={{ width: 'clamp(18px, 4vw, 20px)', height: 'clamp(18px, 4vw, 20px)' }} />
            <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)' }}>Invio in corso...</span>
          </div>
        )}

        {/* Messaggio di successo */}
        {submitStatus === 'success' && (
          <div style={{ 
            padding: '12px', 
            background: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#155724',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-check-circle" style={{ color: '#28a745' }}></i> Messaggio inviato con successo! (Simulazione)
          </div>
        )}

        {/* Messaggio di errore */}
        {submitStatus === 'error' && (
          <div style={{ 
            padding: '12px', 
            background: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#721c24',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-times-circle" style={{ color: '#dc3545' }}></i> Errore nell'invio del messaggio. Riprova più tardi.
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? 'Invio...' : 'Invia'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setFormData({ nome: '', email: '', messaggio: '' })
              setProgress(0)
              setSubmitStatus('idle')
            }}
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
      </form>

    </div>
  )
}

