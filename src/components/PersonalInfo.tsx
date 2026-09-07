import { useState } from 'react'
import bsLogo from '../assets/BS.png'

export default function PersonalInfo() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const infoItems = [
    { label: 'Data di nascita', value: '19/11/2004', icon: 'fa-birthday-cake' },
    { label: 'Luogo di nascita', value: 'Bari, Italia', icon: 'fa-map-marker-alt' },
    { label: 'Nazionalità', value: 'Italiana', icon: 'fa-flag' },
    { label: 'Residenza', value: 'Modugno (BA), Italia', icon: 'fa-home' },
  ]

  const contactItems = [
    { label: 'Telefono', value: '(+39) 351 3150134', link: 'tel:+393513150134', icon: 'fa-phone', color: '#3182ce' },
    { label: 'Email', value: 'biagio.scaglia01@gmail.com', link: 'mailto:biagio.scaglia01@gmail.com', icon: 'fa-envelope', color: '#e53e3e' },
    { label: 'LinkedIn', value: 'Biagio Scaglia', link: 'https://linkedin.com/in/biagio-scaglia', icon: 'fa-linkedin-in', color: '#0077b5', isBrand: true },
    { label: 'WhatsApp', value: 'Chat su WhatsApp', link: 'https://wa.me/393513150134', icon: 'fa-whatsapp', color: '#25d366', isBrand: true },
  ]

  return (
    <div className="personal-info-container">
      {/* Profilo Avatar Card (Stile Account Windows 7) */}
      <div className="personal-info-avatar-card">
        {/* Cornice lucida stile Windows 7 */}
        <div style={{
          width: '92px',
          height: '92px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 14px rgba(0, 168, 255, 0.35), 0 0 0 1px rgba(0, 136, 204, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.6)',
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(200, 235, 255, 0.4) 50%, rgba(140, 200, 240, 0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '12px',
          padding: '2px'
        }}>
          <img src={bsLogo} alt="Biagio Scaglia" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#2d3748' }}>Biagio Scaglia</div>
        <div style={{
          fontSize: '10px',
          color: '#2b6cb0',
          background: '#ebf8ff',
          border: '1px solid #bee3f8',
          padding: '2px 8px',
          borderRadius: '10px',
          marginTop: '8px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          Online <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#38a169', boxShadow: '0 0 4px #38a169' }}></span>
        </div>
      </div>

      {/* Riquadri dei Dati */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Dati Anagrafici */}
        <div style={{
          background: '#fff',
          border: '1px solid #cbd5e0',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#2b6cb0', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
            <i className="fas fa-id-card" style={{ marginRight: '6px' }}></i> Dati Anagrafici
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {infoItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  background: '#ebf8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2b6cb0',
                  fontSize: '11px'
                }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: '#2d3748', fontWeight: '500' }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contatti */}
        <div style={{
          background: '#fff',
          border: '1px solid #cbd5e0',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#2b6cb0', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
            <i className="fas fa-address-book" style={{ marginRight: '6px' }}></i> Recapiti & Contatti
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contactItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                transition: 'all 0.15s ease',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    <i className={item.isBrand ? `fab ${item.icon}` : `fas ${item.icon}`}></i>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '10px', color: '#718096', fontWeight: '600' }}>{item.label}</span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '13px',
                      color: '#2d3748',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      wordBreak: 'break-all'
                    }} onMouseEnter={(e) => e.currentTarget.style.color = '#3182ce'} onMouseLeave={(e) => e.currentTarget.style.color = '#2d3748'}>
                      {item.value}
                    </a>
                  </div>
                </div>
                <div style={{ position: 'relative', display: 'flex', gap: '5px', flexShrink: 0 }}>
                  {copiedText === item.label && (
                    <span style={{
                      position: 'absolute',
                      bottom: '100%',
                      right: '0',
                      background: '#2d3748',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      marginBottom: '5px',
                      zIndex: 10
                    }}>
                      Copiato!
                    </span>
                  )}
                  {item.label !== 'WhatsApp' && (
                    <button
                      onClick={() => copyToClipboard(item.value.replace(/\s+/g, ''), item.label)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        background: '#fff',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        margin: 0
                      }}
                    >
                      Copia
                    </button>
                  )}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: item.color,
                      border: `1px solid ${item.color}`,
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: '500'
                    }}
                  >
                    Apri
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota legale/footer */}
        <div style={{
          background: '#ebf8ff',
          border: '1px solid #bee3f8',
          borderRadius: '6px',
          padding: '10px 15px',
          fontSize: '11px',
          color: '#2b6cb0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="fas fa-info-circle"></i>
          <span>Non offro servizi diretti e non vendo prodotti su questo sito. Contattami per opportunità di collaborazione.</span>
        </div>
      </div>
    </div>
  )
}

