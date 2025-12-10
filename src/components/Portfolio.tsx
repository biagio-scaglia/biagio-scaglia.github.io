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
      github: 'https://github.com/biagio-scaglia/portfolio',
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
      image: swipeImage,
    },
    {
      id: 6,
      name: 'Cats Angular',
      description: 'Sito web per un centro di adozione felini sviluppato con Angular. Include galleria di gatti disponibili, informazioni sulle adozioni e sistema di gestione per il centro.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/cats-angular',
      image: catsImage,
    },
    {
      id: 7,
      name: 'Raidou Angular',
      description: 'Sito web tematico dedicato alla serie Devil Summoner: Raidou Kuzunoha. Sviluppato con Angular per esplorare lo styling e il design ispirato alla serie.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/raidou-angular',
      image: raidouImage,
    },
    {
      id: 8,
      name: 'Angular PS2',
      description: 'Sito web tematico dedicato alla PlayStation 2. Progetto Angular focalizzato sullo styling e il design ispirato alla console e ai suoi giochi iconici.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/angular-ps2',
      image: ps2Image,
    },
    {
      id: 9,
      name: 'Persona Angular',
      description: 'Sito web tematico dedicato alla serie Persona. Sviluppato con Angular per esplorare lo styling e creare un\'esperienza visiva ispirata al mondo di Persona.',
      technologies: ['Angular', 'TypeScript', 'Web Design'],
      github: 'https://github.com/biagio-scaglia/persona-angular',
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
        gap: windowSize.isMobile ? '10px' : '15px'
      }}>
        {!selectedProject ? (
          <>
            <h2 style={{ 
              marginTop: 0, 
              fontSize: windowSize.isMobile ? '18px' : windowSize.isTablet ? '19px' : '20px',
              marginBottom: '10px'
            }}>
              I Miei Progetti
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: windowSize.isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: windowSize.isMobile ? '10px' : '15px',
              overflowY: 'auto',
              flex: 1,
              paddingRight: windowSize.isMobile ? '5px' : '0'
            }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="field-row"
                  style={{
                    padding: '15px',
                    cursor: 'pointer',
                  }}
                >
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: windowSize.isMobile ? '120px' : '150px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        border: '1px solid #ddd'
                      }}
                    />
                  )}
                  <h3 style={{ 
                    marginTop: 0, 
                    marginBottom: '10px',
                    fontSize: windowSize.isMobile ? '16px' : windowSize.isTablet ? '17px' : '18px',
                    color: '#333'
                  }}>
                    {project.name}
                  </h3>
                  <p style={{ 
                    fontSize: windowSize.isMobile ? '11px' : windowSize.isTablet ? '11.5px' : '12px',
                    color: '#666',
                    marginBottom: '10px',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: windowSize.isMobile ? '4px' : '5px',
                    marginTop: '10px'
                  }}>
                    {project.technologies.map((tech, index) => (
                      <button
                        key={index}
                        type="button"
                        style={{
                          padding: windowSize.isMobile ? '3px 6px' : '4px 8px',
                          fontSize: windowSize.isMobile ? '10px' : '11px',
                        }}
                        disabled
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <button
              onClick={handleBack}
              style={{
                marginBottom: '15px',
                alignSelf: 'flex-start',
              }}
            >
              ← Torna ai progetti
            </button>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: windowSize.isMobile ? '5px' : '0' }}>
              <h2 style={{ 
                marginTop: 0, 
                fontSize: windowSize.isMobile ? '20px' : windowSize.isTablet ? '22px' : '24px',
                marginBottom: '15px'
              }}>
                {selectedProject.name}
              </h2>
              
              {selectedProject.image && (
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: windowSize.isMobile ? '200px' : windowSize.isTablet ? '250px' : '300px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              )}
              
              <p style={{ 
                fontSize: windowSize.isMobile ? '13px' : windowSize.isTablet ? '13.5px' : '14px',
                color: '#333',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                {selectedProject.description}
              </p>

              <h3 style={{ 
                fontSize: windowSize.isMobile ? '16px' : windowSize.isTablet ? '17px' : '18px',
                marginBottom: '10px'
              }}>
                Tecnologie Utilizzate:
              </h3>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: windowSize.isMobile ? '6px' : '8px',
                marginBottom: '20px'
              }}>
                {selectedProject.technologies.map((tech, index) => (
                  <button
                    key={index}
                    type="button"
                    style={{
                      padding: windowSize.isMobile ? '5px 10px' : '6px 12px',
                      fontSize: windowSize.isMobile ? '11px' : '12px',
                    }}
                    disabled
                  >
                    {tech}
                  </button>
                ))}
              </div>

              {(selectedProject.link || selectedProject.github) && (
                <div style={{ 
                  display: 'flex', 
                  gap: windowSize.isMobile ? '8px' : '10px',
                  flexWrap: 'wrap'
                }}>
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: windowSize.isMobile ? '12px' : windowSize.isTablet ? '13px' : '14px',
                        display: 'inline-block',
                      }}
                    >
                      <button type="button">🔗 Vedi Progetto</button>
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: windowSize.isMobile ? '12px' : windowSize.isTablet ? '13px' : '14px',
                        display: 'inline-block',
                      }}
                    >
                      <button type="button">📂 GitHub</button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Window>
  )
}

