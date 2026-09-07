import { useState } from 'react'

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const frontendSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Astro', 'Bootstrap']
  const backendSkills = ['Java', 'PHP', 'Laravel', 'Express', '.NET', 'Python', 'MySQL', 'JSON', 'Telegram Bot API']
  const mobileAndTools = ['React Native', 'Flutter', 'Figma', 'Canva', 'Git']
  const softSkills = ['Comunicazione efficace', 'Gestione del tempo', 'Teamwork', 'Organizzazione', 'Problem solving', 'Adattabilità', 'Flessibilità']

  const topSkills = [
    { name: 'React / Frontend', level: 90 },
    { name: 'TypeScript / JS', level: 85 },
    { name: 'Mobile (Flutter & RN)', level: 80 },
    { name: 'Backend (.NET & Node)', level: 75 },
    { name: 'Database (SQL & API)', level: 85 }
  ]

  const badgeStyle = (skill: string) => ({
    fontSize: '12px',
    padding: '6px 12px',
    margin: 0,
    background: hoveredSkill === skill
      ? 'linear-gradient(to bottom, #ebf8ff 0%, #ccebff 100%)'
      : 'linear-gradient(to bottom, #ffffff 0%, #f7fafc 100%)',
    border: hoveredSkill === skill ? '1px solid #63b3ed' : '1px solid #cbd5e0',
    borderRadius: '4px',
    boxShadow: hoveredSkill === skill
      ? '0 0 8px rgba(66, 153, 225, 0.4), inset 0 1px 0 #fff'
      : '0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 #fff',
    color: '#2d3748',
    fontWeight: '500',
    cursor: 'default',
    transform: hoveredSkill === skill ? 'scale(1.04)' : 'none',
    transition: 'all 0.15s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  })

  return (
    <div style={{ padding: '15px', fontFamily: 'Segoe UI, Tahoma, sans-serif', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Livelli Competenze Principali (Stile Risorse di Sistema Windows 7) */}
      <div style={{
        background: '#fff',
        border: '1px solid #cbd5e0',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#2b6cb0', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
          <i className="fas fa-tasks" style={{ marginRight: '6px' }}></i> Livello Tecnologie Principali
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topSkills.map((skill, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ flex: '0 0 160px', fontSize: '12px', fontWeight: '600', color: '#4a5568' }}>{skill.name}</span>
              <div style={{
                flex: 1,
                height: '16px',
                background: 'linear-gradient(to bottom, #e2e8f0 0%, #edf2f7 100%)',
                border: '1px solid #cbd5e0',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {/* Barra verde stile Windows 7 */}
                <div style={{
                  width: `${skill.level}%`,
                  height: '100%',
                  background: 'linear-gradient(to bottom, #a3f7bf 0%, #2ecc71 50%, #27ae60 51%, #2ecc71 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                  position: 'relative'
                }}>
                  {/* Effetto luce riflessa */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'rgba(255,255,255,0.15)'
                  }} />
                </div>
              </div>
              <span style={{ flex: '0 0 35px', fontSize: '12px', fontWeight: 'bold', color: '#2d3748', textAlign: 'right' }}>{skill.level}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Riquadri Hard Skills per Categoria */}
      <div style={{
        background: '#fff',
        border: '1px solid #cbd5e0',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#2b6cb0', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
          <i className="fas fa-code" style={{ marginRight: '6px' }}></i> Categorie Hard Skills
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Frontend */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-laptop-code" style={{ color: '#3182ce' }}></i> Frontend Development
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {frontendSkills.map((skill) => (
                <div
                  key={skill}
                  style={badgeStyle(skill)}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <i className="fas fa-code" style={{ fontSize: '10px', color: '#3182ce' }}></i> {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-server" style={{ color: '#dd6b20' }}></i> Backend & Database
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {backendSkills.map((skill) => (
                <div
                  key={skill}
                  style={badgeStyle(skill)}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <i className="fas fa-database" style={{ fontSize: '10px', color: '#dd6b20' }}></i> {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Strumenti */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-mobile-alt" style={{ color: '#805ad5' }}></i> Mobile & Strumenti
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {mobileAndTools.map((skill) => (
                <div
                  key={skill}
                  style={badgeStyle(skill)}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <i className="fas fa-tools" style={{ fontSize: '10px', color: '#805ad5' }}></i> {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Riquadro Soft Skills */}
      <div style={{
        background: '#fff',
        border: '1px solid #cbd5e0',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#2b6cb0', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
          <i className="fas fa-heart" style={{ marginRight: '6px' }}></i> Soft Skills
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {softSkills.map((skill) => (
            <div
              key={skill}
              style={badgeStyle(skill)}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <i className="fas fa-check" style={{ fontSize: '10px', color: '#38a169' }}></i> {skill}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

