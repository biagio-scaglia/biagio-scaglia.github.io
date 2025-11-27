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

  return (
    <Window
      title="Calendario"
      width={windowWidth <= 480 ? Math.min(350, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(500, window.innerWidth - 40) : 600}
      height={windowWidth <= 480 ? Math.min(450, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(550, window.innerHeight - 80) : 550}
      defaultPosition={{ x: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 200, y: windowWidth <= 480 ? 10 : windowWidth <= 768 ? 20 : 100 }}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
    >
      <div style={{ 
        padding: windowWidth <= 480 ? '10px' : '15px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        gap: '15px'
      }}>
        {/* Header con navigazione */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          borderBottom: '1px solid #ccc'
        }}>
          <button onClick={goToPreviousMonth} style={{ padding: '6px 12px' }}>
            ←
          </button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: windowWidth <= 480 ? '16px' : '18px'
            }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <button onClick={goToNextMonth} style={{ padding: '6px 12px' }}>
            →
          </button>
        </div>

        {/* Pulsante Oggi */}
        <button onClick={goToToday} style={{ alignSelf: 'center', padding: '6px 16px' }}>
          Oggi
        </button>

        {/* Calendario */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Nomi giorni */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '8px'
          }}>
            {dayNames.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: windowWidth <= 480 ? '10px' : '11px',
                  color: '#666',
                  padding: '4px'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Griglia giorni */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            flex: 1
          }}>
            {days.map((day, index) => {
              const importantDate = day !== null ? getImportantDate(day!) : null
              const hasImportantDate = importantDate !== null
              
              return (
                <div
                  key={index}
                  onClick={() => day !== null && handleDateClick(day)}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: day === null 
                      ? 'transparent' 
                      : isSelected(day!)
                        ? '#4a90e2'
                        : isToday(day!)
                          ? '#e8f4f8'
                          : hasImportantDate
                            ? '#fff3cd'
                            : '#f9f9f9',
                    border: day !== null && isToday(day!)
                      ? '2px solid #4a90e2'
                      : day !== null && isSelected(day!)
                        ? '2px solid #357abd'
                        : day !== null && hasImportantDate
                          ? `2px solid ${getTypeColor(importantDate!.type)}`
                          : '1px solid #e0e0e0',
                    borderRadius: '4px',
                    cursor: day !== null ? 'pointer' : 'default',
                    fontSize: windowWidth <= 480 ? '11px' : '13px',
                    fontWeight: isToday(day!) || isSelected(day!) || hasImportantDate ? 'bold' : 'normal',
                    color: day !== null && isSelected(day!)
                      ? '#fff'
                      : isToday(day!)
                        ? '#4a90e2'
                        : hasImportantDate
                          ? getTypeColor(importantDate!.type)
                          : '#333',
                    transition: 'all 0.2s',
                    position: 'relative',
                    padding: '2px',
                  }}
                  onMouseEnter={(e) => {
                    if (day !== null && !isSelected(day!) && !isToday(day!)) {
                      e.currentTarget.style.background = hasImportantDate ? '#ffe69c' : '#f0f0f0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (day !== null && !isSelected(day!) && !isToday(day!)) {
                      e.currentTarget.style.background = hasImportantDate ? '#fff3cd' : '#f9f9f9'
                    }
                  }}
                >
                  <div style={{ fontSize: windowWidth <= 480 ? '10px' : '12px' }}>
                    {day}
                  </div>
                  {hasImportantDate && (
                    <div style={{ 
                      fontSize: windowWidth <= 480 ? '8px' : '10px',
                      marginTop: '2px',
                      lineHeight: '1'
                    }}>
                      {getTypeIcon(importantDate!.type)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Info data selezionata */}
        {selectedDate && (() => {
          const importantDate = importantDates.find(d => 
            d.date.getDate() === selectedDate.getDate() &&
            d.date.getMonth() === selectedDate.getMonth() &&
            d.date.getFullYear() === selectedDate.getFullYear()
          )
          
          return (
            <div style={{
              padding: '12px',
              background: importantDate ? '#f0f0f0' : '#f0f0f0',
              borderRadius: '4px',
              fontSize: windowWidth <= 480 ? '11px' : '12px',
            }}>
              <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                <strong>Data selezionata:</strong> {selectedDate.toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {importantDate && (
                <div style={{
                  padding: '10px',
                  background: '#fff',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getTypeColor(importantDate.type)}`,
                  marginTop: '8px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '6px',
                    fontSize: windowWidth <= 480 ? '12px' : '13px',
                    fontWeight: 'bold',
                    color: getTypeColor(importantDate.type)
                  }}>
                    <span>{getTypeIcon(importantDate.type)}</span>
                    <span>{importantDate.title}</span>
                  </div>
                  <div style={{ 
                    fontSize: windowWidth <= 480 ? '10px' : '11px',
                    color: '#666',
                    paddingLeft: '24px'
                  }}>
                    {importantDate.description}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Lista eventi del mese */}
        {getImportantDatesForMonth().length > 0 && (
          <div style={{
            padding: '12px',
            background: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px',
              fontSize: windowWidth <= 480 ? '11px' : '12px'
            }}>
              Eventi di {monthNames[currentDate.getMonth()]}:
            </div>
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
                    marginBottom: '4px',
                    background: '#fff',
                    borderRadius: '3px',
                    borderLeft: `3px solid ${getTypeColor(event.type)}`,
                    cursor: 'pointer',
                    fontSize: windowWidth <= 480 ? '10px' : '11px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f0f0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{getTypeIcon(event.type)}</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {event.date.getDate()} {monthNames[event.date.getMonth()]}:
                    </span>
                    <span>{event.title}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Window>
  )
}

