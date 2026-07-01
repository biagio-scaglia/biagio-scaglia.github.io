import { useState, useMemo } from 'react'
import Window from './Window'
import { useWindowSize } from '../hooks/useWindowSize'
import catsImage from '../assets/screen progetti/cats.png'
import personaImage from '../assets/screen progetti/persona.png'
import pizzadexImage from '../assets/screen progetti/pizzadex.jpeg'
import ps2Image from '../assets/screen progetti/ps2.png'
import raidouImage from '../assets/screen progetti/raidou.png'
import smashImage from '../assets/screen progetti/smash.jpeg'
import swipeImage from '../assets/screen progetti/swipe.png'

interface CalculatorProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

interface Project {
  id: number
  name: string
  description: string
  technologies: string[]
  link?: string
  github?: string
  image?: string
}

export default function Portfolio({ onClose, onMinimize, icon }: CalculatorProps) {
  const windowSize = useWindowSize()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const projects: Project[] = [
    {
      id: 1,
      name: 'Portfolio Windows 7',
      description: 'Portfolio interattivo che simula l\'interfaccia di Windows 7, realizzato con React e TypeScript. Include animazioni, effetti glass e un sistema di finestre completo.',
      technologies: ['React', 'TypeScript', 'CSS', '7.css'],
      github: 'https://github.com/biagio-scaglia/biagio-scaglia.github.io',
      link: 'https://biagio-scaglia.github.io/',
    },
    {
      id: 2,
      name: 'SGAMApp - App Mobile',
      description: 'Applicazione mobile sviluppata con React Native per utenti fragili, focalizzata su navigazione semplificata e accessibilità. Include funzionalità di supporto per persone con disabilità e interfaccia user-friendly.',
      technologies: ['React Native', 'TypeScript', 'Expo', 'Accessibility'],
      github: 'https://github.com/biagio-scaglia/sgama-mobile',
    },
    {
      id: 3,
      name: 'Smash Group',
      description: 'Applicazione mobile per la community di giocatori di Super Smash Bros. Include sistema CRUD completo, backend in Express, gestione utenti e funzionalità social per i giocatori.',
      technologies: ['React Native', 'Expo', 'Express', 'Node.js', 'CRUD'],
      github: 'https://github.com/biagio-scaglia/smash-expo',
      image: smashImage,
    },
    {
      id: 4,
      name: 'PizzaDex',
      description: 'App mobile ispirata al mondo Pokémon per la gestione di una pizzeria. Sviluppata con React Native, combina il gameplay dei Pokédex con funzionalità per ordinare e gestire pizze.',
      technologies: ['React Native', 'TypeScript', 'Mobile App'],
      github: 'https://github.com/biagio-scaglia/pizzadex',
      image: pizzadexImage,
    },
    {
      id: 5,
      name: 'Dev Swipe',
      description: 'Applicazione web ispirata a Tinder ma dedicata agli sviluppatori. Permette di scoprire e matchare con linguaggi di programmazione, framework e tecnologie. Sviluppata con Angular e TypeScript.',
      technologies: ['Angular', 'TypeScript', 'Web App'],
      github: 'https://github.com/biagio-scaglia/dev-swipe',
      link: 'https://biagio-scaglia.github.io/dev-swipe/',
      image: swipeImage,
    },
    {
      id: 6,
      name: 'Cats Angular',
      description: 'Sito web per un centro di adozione felini sviluppato con Angular. Include galleria di gatti disponibili, informazioni sulle adozioni e sistema di gestione per il centro.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/cats-angular',
      link: 'https://biagio-scaglia.github.io/cats-angular/',
      image: catsImage,
    },
    {
      id: 7,
      name: 'Raidou Angular',
      description: 'Sito web tematico dedicato alla serie Devil Summoner: Raidou Kuzunoha. Sviluppato con Angular per esplorare lo styling e il design ispirato alla serie.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/raidou-angular',
      link: 'https://biagio-scaglia.github.io/raidou-angular/',
      image: raidouImage,
    },
    {
      id: 8,
      name: 'Angular PS2',
      description: 'Sito web tematico dedicato alla PlayStation 2. Progetto Angular focalizzato sullo styling e il design ispirato alla console e ai suoi giochi iconici.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/angular-ps2',
      link: 'https://biagio-scaglia.github.io/angular-ps2/',
      image: ps2Image,
    },
    {
      id: 9,
      name: 'Persona Angular',
      description: 'Sito web tematico dedicato alla serie Persona. Sviluppato con Angular per esplorare lo styling e creare un\'esperienza visiva ispirata al mondo di Persona.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/persona-angular',
      link: 'https://biagio-scaglia.github.io/persona-angular/',
      image: personaImage,
    },
    {
      id: 10,
      name: 'FakeNews Check',
      description: 'Sistema di verifica notizie che utilizza Qwen 3 8B (tramite Ollama) e web scraping per verificare l\'autenticità delle notizie confrontandole con fonti affidabili italiane. Include verifica automatica, analisi intelligente con estrazione automatica di parole chiave e confronto multi-fonte per maggiore affidabilità.',
      technologies: ['Python', 'Flask', 'React', 'Ollama', 'Qwen 3 8B', 'BeautifulSoup', 'Web Scraping', 'AI'],
      github: 'https://github.com/biagio-scaglia/fakenews-check',
    },
    {
      id: 11,
      name: 'Nintendo AI Game Advisor',
      description: 'Sistema intelligente di raccomandazione giochi Nintendo basato su AI, con API REST e app Flutter mobile. Include AI-powered recommendations, chat interattiva, ricerca intelligente con sistema RAG, integrazione Fandom per scraping completo, estrazione automatica immagini personaggi, sintesi AI e supporto per 42 giochi Nintendo con database completo.',
      technologies: ['Python', 'Flask', 'Flutter', 'Dart', 'Ollama', 'RAG', 'Web Scraping', 'AI', 'REST API', 'Mobile App'],
      github: 'https://github.com/biagio-scaglia/Nintendo-AI',
    },
    {
      id: 12,
      name: 'Istiocitosi a Cellule di Langerhans - Guida Educativa',
      description: 'Sito web educativo in React/TypeScript sull\'Istiocitosi a Cellule di Langerhans (ICL), malattia rara che colpisce principalmente i bambini. Include 8 sezioni informative (Home, Proteine Coinvolte, Sintomi, Diagnostica, Trattamenti, Statistiche, Prevenzione, Fonti) con design responsive, animazioni Framer Motion, effetti glassmorphism e icone SVG mediche. Tutti i contenuti sono organizzati in JSON per facilità di gestione.',
      technologies: ['React', 'TypeScript', 'Vite', 'Framer Motion', 'React Router', 'Radix UI Icons', 'GitHub Pages'],
      github: 'https://github.com/biagio-scaglia/biologia',
      link: 'https://biagio-scaglia.github.io/biologia/',
    },
    {
      id: 13,
      name: 'biag-interest',
      description: 'Un\'app Flutter moderna ispirata a Pinterest per esplorare e salvare immagini da Safebooru. Include design Pinterest-style con UI moderna, gestione immagini avanzata con caricamento progressivo (Preview → Sample → Full quality), ricerca potente con autocomplete intelligente, sistema di salvataggio con drag & drop, organizzazione in bacheche personalizzate, profilo utente completo con CRUD, infinite scroll ottimizzato e proxy server Node.js per risolvere problemi CORS e caching.',
      technologies: ['Flutter', 'Dart', 'Riverpod', 'Dio', 'SharedPreferences', 'Node.js', 'Express', 'Mobile App'],
      github: 'https://github.com/biagio-scaglia/biag-interest',
    },
    {
      id: 14,
      name: 'Monster Hunter Compendium',
      description: 'Applicazione Flutter modulare e scalabile per esplorare il database completo di Monster Hunter World. Include informazioni su mostri, armi, armature, oggetti, skill, location, eventi e molto altro utilizzando l\'API mhw-db.com. Architettura feature-based con componenti modulari (GradientCard, ShimmerLoader, RareBadge), design system completo con palette Monster Hunter, supporto dark/light mode, animazioni fluide, caching intelligente e navigazione intuitiva con hub centrale.',
      technologies: ['Flutter', 'Dart', 'Provider', 'HTTP', 'Google Fonts', 'Shimmer', 'Cached Network Image', 'Mobile App'],
      github: 'https://github.com/biagio-scaglia/monster-hunter-compendium',
    },
  ]

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const handleBack = () => {
    setSelectedProject(null)
  }

  // Calcola dimensioni responsive
  const windowDimensions = useMemo(() => {
    if (windowSize.isMobile) {
      return {
        width: Math.min(400, windowSize.width - 20),
        height: Math.min(500, windowSize.height - 100),
        position: { x: 10, y: 10 }
      }
    } else if (windowSize.isTablet) {
      return {
        width: Math.min(700, windowSize.width - 40),
        height: Math.min(600, windowSize.height - 80),
        position: { x: 20, y: 20 }
      }
    }
    return {
      width: 800,
      height: 600,
      position: { x: 100, y: 50 }
    }
  }, [windowSize])

  return (
    <Window
      title="Portfolio - Progetti"
      width={windowDimensions.width}
      height={windowDimensions.height}
      defaultPosition={windowDimensions.position}
      onClose={onClose}
      onMinimize={onMinimize}
      icon={icon}
    >
      <div style={{ 
        padding: windowSize.isMobile ? '10px' : '15px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        gap: windowSize.isMobile ? '10px' : '15px',
        boxSizing: 'border-box',
        background: '#edf2f7'
      }}>
        {!selectedProject ? (
          <>
            <h2 style={{ 
              marginTop: 0, 
              fontSize: windowSize.isMobile ? '16px' : '18px',
              fontWeight: 'bold',
              color: '#2b6cb0',
              borderBottom: '1px solid #cbd5e0',
              paddingBottom: '6px',
              marginBottom: '5px'
            }}>
              <i className="fas fa-cubes" style={{ marginRight: '8px' }}></i> I Miei Progetti ({projects.length})
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: windowSize.isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '12px',
              overflowY: 'auto',
              flex: 1,
              paddingRight: '4px'
            }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  style={{
                    background: '#fff',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = '#90cdf4'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(66, 153, 225, 0.15), 0 4px 6px -2px rgba(66, 153, 225, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = '#cbd5e0'
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div>
                    {/* Immagine di anteprima con contain fit */}
                    {project.image ? (
                      <div style={{
                        width: '100%',
                        height: '110px',
                        borderRadius: '6px',
                        background: '#f7fafc',
                        border: '1px solid #edf2f7',
                        overflow: 'hidden',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={project.image} 
                          alt={project.name}
                          loading="lazy"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            display: 'block'
                          }}
                        />
                      </div>
                    ) : (
                      /* Placeholder Visuale per Progetti senza Immagine */
                      <div style={{
                        width: '100%',
                        height: '110px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #ebf8ff 0%, #cee3f8 100%)',
                        border: '1px solid #bee3f8',
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2b6cb0',
                        gap: '6px'
                      }}>
                        <i className="fas fa-laptop-code" style={{ fontSize: '28px' }}></i>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sorgente GitHub</span>
                      </div>
                    )}

                    <h3 style={{ 
                      marginTop: 0, 
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#2d3748'
                    }}>
                      {project.name}
                    </h3>
                    <p style={{ 
                      fontSize: '11px',
                      color: '#4a5568',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      height: '48px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Badges Tecnologie */}
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '4px',
                    marginTop: 'auto'
                  }}>
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '2px 6px',
                          fontSize: '9px',
                          fontWeight: '600',
                          background: '#ebf8ff',
                          color: '#2b6cb0',
                          borderRadius: '4px',
                          border: '1px solid #bee3f8'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span style={{ padding: '2px 6px', fontSize: '9px', fontWeight: '600', background: '#edf2f7', color: '#4a5568', borderRadius: '4px' }}>
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Pulsante Torna indietro */}
            <div
              onClick={handleBack}
              style={{
                marginBottom: '10px',
                alignSelf: 'flex-start',
                padding: '4px 12px',
                background: '#fff',
                border: '1px solid #cbd5e0',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#4a5568',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.15s',
                userSelect: 'none',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#edf2f7'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '5px' }}></i> Torna ai progetti
            </div>

            {/* Dettaglio Progetto */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              background: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e0',
              padding: windowSize.isMobile ? '12px' : '20px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ 
                marginTop: 0, 
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2d3748',
                marginBottom: '12px'
              }}>
                {selectedProject.name}
              </h2>
              
              {selectedProject.image && (
                <div style={{
                  width: '100%',
                  height: windowSize.isMobile ? '160px' : '260px',
                  borderRadius: '8px',
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px',
                  overflow: 'hidden',
                  padding: '10px',
                  boxSizing: 'border-box'
                }}>
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.name}
                    loading="lazy"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
              
              <p style={{ 
                fontSize: '13px',
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: '15px'
              }}>
                {selectedProject.description}
              </p>

              {/* Tecnologie */}
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tecnologie Utilizzate
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px',
                marginBottom: '20px'
              }}>
                {selectedProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#ebf8ff',
                      color: '#2b6cb0',
                      borderRadius: '4px',
                      border: '1px solid #bee3f8'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links di Azione */}
              {(selectedProject.link || selectedProject.github) && (
                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '25px',
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '15px'
                }}>
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 14px',
                        background: '#3182ce',
                        border: '1px solid #3182ce',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(49, 130, 206, 0.2)'
                      }}
                    >
                      <i className="fas fa-external-link-alt"></i> Apri Progetto
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 14px',
                        background: '#2d3748',
                        border: '1px solid #2d3748',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <i className="fab fa-github"></i> Codice GitHub
                    </a>
                  )}
                </div>
              )}

              {/* Anteprima Web Browser Interattiva */}
              {selectedProject.link && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Anteprima Web Live
                  </h4>
                  
                  {/* Browser Mockup Container */}
                  <div style={{
                    width: '100%',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                  }}>
                    {/* Browser Address Bar Header */}
                    <div style={{
                      background: 'linear-gradient(to bottom, #edf2f7 0%, #e2e8f0 100%)',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderBottom: '1px solid #cbd5e0',
                      userSelect: 'none'
                    }}>
                      {/* Semaforo Browser Controls */}
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fc8181' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f6e05e' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#68d391' }} />
                      </div>
                      
                      {/* Frecce Navigazione */}
                      <div style={{ display: 'flex', gap: '8px', color: '#a0aec0', fontSize: '10px' }}>
                        <i className="fas fa-arrow-left"></i>
                        <i className="fas fa-arrow-right"></i>
                        <i className="fas fa-redo"></i>
                      </div>

                      {/* Barra Indirizzo */}
                      <div style={{
                        flex: 1,
                        background: '#fff',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        padding: '2px 10px',
                        fontSize: '11px',
                        color: '#718096',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                      }}>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {selectedProject.link}
                        </span>
                        <i className="fas fa-lock" style={{ fontSize: '9px', color: '#48bb78', marginLeft: '5px' }}></i>
                      </div>
                    </div>

                    {/* IFrame Area */}
                    <div style={{
                      width: '100%',
                      height: windowSize.isMobile ? '250px' : windowSize.isTablet ? '350px' : '400px',
                      background: '#fff'
                    }}>
                      <iframe
                        src={selectedProject.link}
                        title={selectedProject.name}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Window>
  )
}

