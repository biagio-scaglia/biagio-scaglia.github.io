import { useState, useEffect } from 'react'
import Window from './Window'
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
  ]

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const handleBack = () => {
    setSelectedProject(null)
  }

  return (
    <Window
      title="Portfolio - Progetti"
      width={windowWidth <= 480 ? Math.min(400, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(700, window.innerWidth - 40) : 800}
      height={windowWidth <= 480 ? Math.min(500, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(600, window.innerHeight - 80) : 600}
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
        gap: '15px'
      }}>
        {!selectedProject ? (
          <>
            <h2 style={{ 
              marginTop: 0, 
              fontSize: windowWidth <= 480 ? '18px' : '20px',
              marginBottom: '10px'
            }}>
              I Miei Progetti
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: windowWidth <= 480 ? '1fr' : windowWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
              gap: '15px',
              overflowY: 'auto',
              flex: 1
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
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '150px',
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
                    fontSize: windowWidth <= 480 ? '16px' : '18px',
                    color: '#333'
                  }}>
                    {project.name}
                  </h3>
                  <p style={{ 
                    fontSize: windowWidth <= 480 ? '11px' : '12px',
                    color: '#666',
                    marginBottom: '10px',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '5px',
                    marginTop: '10px'
                  }}>
                    {project.technologies.map((tech, index) => (
                      <button
                        key={index}
                        type="button"
                        style={{
                          padding: '4px 8px',
                          fontSize: windowWidth <= 480 ? '10px' : '11px',
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

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <h2 style={{ 
                marginTop: 0, 
                fontSize: windowWidth <= 480 ? '20px' : '24px',
                marginBottom: '15px'
              }}>
                {selectedProject.name}
              </h2>
              
              {selectedProject.image && (
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              )}
              
              <p style={{ 
                fontSize: windowWidth <= 480 ? '13px' : '14px',
                color: '#333',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                {selectedProject.description}
              </p>

              <h3 style={{ 
                fontSize: windowWidth <= 480 ? '16px' : '18px',
                marginBottom: '10px'
              }}>
                Tecnologie Utilizzate:
              </h3>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                marginBottom: '20px'
              }}>
                {selectedProject.technologies.map((tech, index) => (
                  <button
                    key={index}
                    type="button"
                    style={{
                      padding: '6px 12px',
                      fontSize: windowWidth <= 480 ? '11px' : '12px',
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
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: windowWidth <= 480 ? '12px' : '14px',
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
                        fontSize: windowWidth <= 480 ? '12px' : '14px',
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

