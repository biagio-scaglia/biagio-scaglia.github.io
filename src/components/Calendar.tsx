import { useState, useEffect } from 'react'
import Window from './Window'

interface CalendarProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

interface ImportantDate {
  date: Date
  title: string
  description: string
  type: 'work' | 'education' | 'certification' | 'personal'
}

const importantDates: ImportantDate[] = [
  // Formazione
  { date: new Date(2024, 10, 1), title: 'Inizio ITS Academy APULIA DIGITAL', description: 'Diploma Specialistico in Sviluppo e Analisi di Software', type: 'education' },
  { date: new Date(2023, 10, 1), title: 'Inizio Master UX/UI Design', description: 'Meridia Formazione, Talent Garden, Università degli Studi Aldo Moro', type: 'education' },
  { date: new Date(2024, 5, 30), title: 'Fine Master UX/UI Design', description: 'Voto: 30/30', type: 'education' },
  { date: new Date(2018, 8, 1), title: 'Inizio I.I.S.S. Tommaso Fiore', description: 'Diploma di Scuola Superiore', type: 'education' },
  { date: new Date(2023, 5, 30), title: 'Fine I.I.S.S. Tommaso Fiore', description: 'Voto: 85/100', type: 'education' },
  
  // Lavoro
  { date: new Date(2026, 1, 1), title: 'Inizio Prisma Srl', description: 'Full Stack Developer (.NET / React)', type: 'work' },
  { date: new Date(2026, 4, 1), title: 'Inizio Biagio Scaglia Dev', description: 'Freelance Web & Mobile Developer', type: 'work' },
  { date: new Date(2026, 3, 1), title: 'Inizio Pokémon Go - Raid Italia', description: 'Telegram Bot Developer', type: 'work' },
  { date: new Date(2026, 5, 30), title: 'Fine Pokémon Go - Raid Italia', description: 'Telegram Bot Developer', type: 'work' },
  { date: new Date(2025, 11, 1), title: 'Inizio Yumeverse Games', description: 'Sviluppatore Web (Frontend)', type: 'work' },
  { date: new Date(2026, 5, 30), title: 'Fine Yumeverse Games', description: 'Sviluppatore Web (Frontend)', type: 'work' },
  { date: new Date(2025, 8, 1), title: 'Inizio sgamapp', description: 'Sviluppatore Applicazioni Mobili', type: 'work' },
  { date: new Date(2026, 1, 28), title: 'Fine sgamapp', description: 'Sviluppatore Applicazioni Mobili', type: 'work' },
  { date: new Date(2025, 7, 1), title: 'Inizio PASSBARI', description: 'Sviluppatore di Software', type: 'work' },
  { date: new Date(2025, 7, 31), title: 'Fine PASSBARI', description: 'Sviluppatore di Software', type: 'work' },
  { date: new Date(2024, 5, 3), title: 'Inizio Consorzio Artemide', description: 'Consulente AI', type: 'work' },
  { date: new Date(2024, 11, 3), title: 'Fine Consorzio Artemide', description: 'Consulente AI', type: 'work' },
  { date: new Date(2018, 5, 6), title: 'Inizio Freelance', description: 'Esperto di Contenuti Digitali', type: 'work' },
  
  // Certificazioni
  { date: new Date(2022, 0, 6), title: 'Cybersecurity Essential', description: 'Cisco', type: 'certification' },
  { date: new Date(2023, 11, 18), title: 'WordPress Development', description: 'Programming Hub', type: 'certification' },
  { date: new Date(2023, 10, 23), title: 'SEO', description: 'Programming Hub', type: 'certification' },
  { date: new Date(2023, 10, 26), title: 'JavaScript', description: 'Programming Hub', type: 'certification' },
  { date: new Date(2023, 10, 21), title: 'HTML & CSS', description: 'Programming Hub', type: 'certification' },
  { date: new Date(2024, 1, 6), title: 'Web Development Professional', description: 'Institute of Management, Technology & Finance', type: 'certification' },
  { date: new Date(2024, 0, 30), title: 'Python Development Professional', description: 'Institute of Management, Technology & Finance', type: 'certification' },
  
  // Personali
  { date: new Date(2024, 1, 19), title: 'Patente di Guida', description: 'Categoria B', type: 'personal' },
]

export default function Calendar({ onClose, onMinimize, icon }: CalendarProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  const getImportantDate = (day: number): ImportantDate | null => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return importantDates.find(d => 
      d.date.getDate() === checkDate.getDate() &&
      d.date.getMonth() === checkDate.getMonth() &&
      d.date.getFullYear() === checkDate.getFullYear()
    ) || null
  }

  const getImportantDatesForMonth = (): ImportantDate[] => {
    return importantDates.filter(d => 
      d.date.getMonth() === currentDate.getMonth() &&
      d.date.getFullYear() === currentDate.getFullYear()
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return '#0078d4'
      case 'education': return '#107c10'
      case 'certification': return '#ff8c00'
      case 'personal': return '#e81123'
      default: return '#666'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'work': return '💼'
      case 'education': return '🎓'
      case 'certification': return '🏆'
      case 'personal': return '⭐'
      default: return '📅'
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = []

  // Aggiungi giorni vuoti all'inizio
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Aggiungi i giorni del mese
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const isDesktop = windowWidth > 550

  return (
    <Window
      title="Calendario"
      width={isDesktop ? 650 : Math.min(360, window.innerWidth - 10)}
      height={isDesktop ? 480 : Math.min(560, window.innerHeight - 60)}
      defaultPosition={{ x: isDesktop ? 180 : 10, y: isDesktop ? 80 : 10 }}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
    >
      <div style={{
        padding: '15px',
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        gap: '20px',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: isDesktop ? 'hidden' : 'auto'
      }}>
        
        {/* Pannello Sinistro: Calendario vero e proprio */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Header con navigazione mese */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '8px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <button 
              onClick={goToPreviousMonth} 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid #cbd5e0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#edf2f7'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <i className="fas fa-chevron-left" style={{ fontSize: '11px', color: '#4a5568' }}></i>
            </button>
            
            <h3 style={{ margin: 0, fontSize: '15px', color: '#2d3748', fontWeight: 'bold' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <button 
              onClick={goToNextMonth} 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid #cbd5e0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#edf2f7'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <i className="fas fa-chevron-right" style={{ fontSize: '11px', color: '#4a5568' }}></i>
            </button>
          </div>

          {/* Griglia Calendario */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Nomi Giorni della Settimana */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '6px'
            }}>
              {dayNames.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#718096',
                    padding: '4px 0'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Griglia dei Giorni */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px',
              flex: 1
            }}>
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} style={{ aspectRatio: '1' }} />
                }

                const importantDate = getImportantDate(day)
                const isSelectedDay = isSelected(day)
                const isTodayDay = isToday(day)

                // Stile specifico per i tipi di evento
                const eventBorderColor = importantDate ? getTypeColor(importantDate.type) : 'transparent'

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => handleDateClick(day)}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: isTodayDay || isSelectedDay || importantDate ? 'bold' : 'normal',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      boxSizing: 'border-box',
                      
                      // Highlight sfondi
                      background: isSelectedDay
                        ? 'linear-gradient(to bottom, #e1f0fa 0%, #a2caf0 100%)' // Aero selection
                        : isTodayDay
                          ? '#fffae6' // Light gold highlight
                          : '#fff',
                          
                      // Bordi
                      border: isSelectedDay
                        ? '1px solid #7b9fc5'
                        : isTodayDay
                          ? '2px solid #d69e2e' // Gold outline per today
                          : importantDate
                            ? `1.5px dashed ${eventBorderColor}`
                            : '1px solid #e2e8f0',
                            
                      // Testo colori
                      color: isSelectedDay
                        ? '#002f5d'
                        : isTodayDay
                          ? '#b7791f'
                          : '#2d3748',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelectedDay) {
                        e.currentTarget.style.background = '#edf2f7'
                        e.currentTarget.style.borderColor = '#cbd5e0'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelectedDay) {
                        e.currentTarget.style.background = isTodayDay ? '#fffae6' : '#fff'
                        e.currentTarget.style.borderColor = isTodayDay ? '#d69e2e' : importantDate ? eventBorderColor : '#e2e8f0'
                      }
                    }}
                  >
                    <span>{day}</span>
                    
                    {/* Pallino indicatore sotto il numero */}
                    {importantDate && (
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: eventBorderColor
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottone per tornare ad oggi */}
          <button 
            onClick={goToToday} 
            style={{
              padding: '6px 15px',
              alignSelf: 'flex-start',
              background: '#fff',
              border: '1px solid #cbd5e0',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#4a5568',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#edf2f7'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <i className="fas fa-calendar-day" style={{ marginRight: '5px' }}></i> Oggi
          </button>
        </div>

        {/* Pannello Destro: Sidebar dei Dettagli */}
        <div style={{
          width: isDesktop ? '230px' : '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          overflowY: 'auto',
          borderLeft: isDesktop ? '1px solid #e2e8f0' : 'none',
          paddingLeft: isDesktop ? '15px' : '0',
          paddingTop: isDesktop ? '0' : '15px',
          borderTop: isDesktop ? 'none' : '1px solid #e2e8f0',
          flexShrink: 0
        }}>
          {/* Box data selezionata */}
          {selectedDate && (() => {
            const importantDate = importantDates.find(d => 
              d.date.getDate() === selectedDate.getDate() &&
              d.date.getMonth() === selectedDate.getMonth() &&
              d.date.getFullYear() === selectedDate.getFullYear()
            )
            
            return (
              <div style={{
                background: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#4a5568', marginBottom: '6px', borderBottom: '1px solid #edf2f7', paddingBottom: '4px' }}>
                  <i className="far fa-clock" style={{ marginRight: '5px' }}></i> Dettagli Giorno
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '8px' }}>
                  {selectedDate.toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                {importantDate ? (
                  <div style={{
                    padding: '8px',
                    background: '#fff',
                    borderRadius: '4px',
                    borderLeft: `4px solid ${getTypeColor(importantDate.type)}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: getTypeColor(importantDate.type),
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>{getTypeIcon(importantDate.type)}</span>
                      <span>{importantDate.title}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>
                      {importantDate.description}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#a0aec0', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                    Nessun evento pianificato
                  </div>
                )}
              </div>
            )
          })()}

          {/* Eventi del Mese */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#718096', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Eventi del Mese
            </div>
            {getImportantDatesForMonth().length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {getImportantDatesForMonth()
                  .sort((a, b) => a.date.getDate() - b.date.getDate())
                  .map((event, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setCurrentDate(new Date(event.date.getFullYear(), event.date.getMonth(), 1))
                        setSelectedDate(event.date)
                      }}
                      style={{
                        padding: '6px 8px',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderLeft: `3px solid ${getTypeColor(event.type)}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f7fafc'
                        e.currentTarget.style.borderColor = '#cbd5e0'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 'bold', color: '#4a5568' }}>{event.date.getDate()}:</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                          {event.title}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ color: '#a0aec0', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', padding: '15px 0', border: '1px dashed #e2e8f0', borderRadius: '6px' }}>
                Nessun evento questo mese
              </div>
            )}
          </div>
        </div>

      </div>
    </Window>
  )
}

