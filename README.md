# Portfolio CV - Biagio Scaglia | Sviluppatore Software & UX/UI Designer

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

**Portfolio interattivo ispirato all'interfaccia Windows 7** - Un'esperienza unica per esplorare le competenze, l'esperienza lavorativa e i progetti di Biagio Scaglia, sviluppatore software e UX/UI designer italiano.

## 🌐 Live Demo

**🔗 [Visita il Portfolio Live](https://biagio-scaglia.github.io/portfolio-cv)**

Portfolio interattivo completamente responsive ottimizzato per desktop, tablet e dispositivi mobili.

## 👨‍💻 Chi Sono

**Biagio Scaglia** è uno sviluppatore software e UX/UI designer con sede a Modugno (Bari), Italia. Specializzato in sviluppo web frontend e mobile, con competenze in React, TypeScript, React Native, e design di interfacce utente.

### 🎓 Formazione
- **ITS Academy APULIA DIGITAL** - Diploma Specialistico in Sviluppo e Analisi di Software (EQF 5) - In corso
- **Master in UX/UI Design** - Meridia Formazione, Talent Garden, Università degli Studi Aldo Moro (BA) - Voto 30/30
- **I.I.S.S. Tommaso Fiore** - Diploma di Scuola Superiore - Voto 85/100

### 💼 Esperienza Professionale
- **PASSBARI** - Sviluppatore di Software (2025)
- **Consorzio Artemide** - Consulente AI (2024)
- **Freelance** - Esperto di Contenuti Digitali (2018 - Attuale)

## ✨ Caratteristiche Principali

### 🖥️ Interfaccia Windows 7 Autentica
- Design fedele all'interfaccia Windows 7 con effetti glass e animazioni fluide
- Sistema di finestre completamente funzionale con drag & drop
- Taskbar interattiva con gestione finestre
- Boot screen con animazioni e suoni
- Start menu funzionale

### 🎨 Funzionalità Interattive
- **Finestre Interattive**: Minimizzazione, massimizzazione, ridimensionamento e spostamento
- **Slideshow Sfondi**: Sistema automatico per cambiare gli sfondi del desktop
- **Desktop Personalizzabile**: Icone trascinabili e organizzabili
- **Player Musicale**: Lettore audio integrato
- **Visualizzatore Documenti**: Supporto per PDF e immagini
- **Browser Integrato**: Navigazione web simulata
- **Paint App**: Applicazione di disegno integrata

### 📱 Design Responsive
- **Desktop**: Layout completo con tutte le funzionalità
- **Tablet**: Layout adattato con griglia icone ottimizzata
- **Mobile**: Interfaccia touch-friendly con scroll fluido
- **Breakpoints**: Mobile (≤480px), Tablet (481-768px), Desktop (>768px)

### ⚡ Performance Ottimizzate
- Lazy loading dei componenti
- GPU acceleration per animazioni fluide
- Debounce per eventi resize
- Ottimizzazioni touch per dispositivi mobili
- Code splitting automatico

## 🛠️ Stack Tecnologico

### Frontend
- **React 19** - Libreria UI moderna con TypeScript
- **TypeScript** - Tipizzazione statica per codice robusto
- **Vite** - Build tool veloce e moderno
- **7.css** - Framework CSS per Windows 7 UI
- **98.css** - Framework CSS per retro UI

### Styling & UI
- **Font Awesome** - Icone vettoriali
- **CSS3** - Animazioni, trasformazioni e effetti glass
- **Responsive Design** - Mobile-first approach

### Audio & Media
- **Howler.js** - Gestione audio avanzata per effetti sonori

### Build & Deploy
- **Vite** - Build tool e dev server
- **GitHub Pages** - Hosting statico gratuito
- **gh-pages** - Deploy automatico

## 📦 Installazione

### Prerequisiti
- Node.js 18+ e npm/yarn
- Git

### Setup Locale

```bash
# Clona il repository
git clone https://github.com/biagio-scaglia/portfolio-cv.git

# Entra nella directory
cd portfolio-cv

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173`

## 🚀 Script Disponibili

```bash
# Sviluppo
npm run dev          # Avvia il server di sviluppo con hot reload

# Build
npm run build        # Crea il build di produzione ottimizzato
npm run preview      # Preview del build di produzione

# Deploy
npm run deploy       # Build e deploy automatico su GitHub Pages

# Linting
npm run lint         # Verifica la qualità del codice
```

## 📁 Struttura del Progetto

```
portfolio-cv/
├── public/                  # File statici pubblici
├── src/
│   ├── assets/             # Risorse (immagini, suoni, PDF, icone)
│   │   ├── icone/          # Icone delle applicazioni
│   │   ├── sfondo/         # Immagini di sfondo per slideshow
│   │   └── ...
│   ├── components/         # Componenti React
│   │   ├── Window.tsx      # Componente finestra base riutilizzabile
│   │   ├── BootScreen.tsx  # Schermata di avvio
│   │   ├── StartMenu.tsx   # Menu Start
│   │   ├── TaskbarThumbnail.tsx  # Anteprima finestre nella taskbar
│   │   ├── DesktopIcon.tsx # Icone desktop
│   │   ├── About.tsx       # Sezione About
│   │   ├── PersonalInfo.tsx # Informazioni personali
│   │   ├── WorkExperience.tsx # Esperienze lavorative
│   │   ├── Skills.tsx      # Competenze tecniche e soft skills
│   │   ├── Education.tsx   # Formazione
│   │   ├── Certifications.tsx # Certificazioni
│   │   ├── MusicWindow.tsx # Player musicale
│   │   ├── BrowserWindow.tsx # Browser integrato
│   │   ├── PaintWindow.tsx # Applicazione Paint
│   │   └── ...
│   ├── App.tsx             # Componente principale
│   ├── App.css             # Stili globali dell'app
│   ├── main.tsx            # Entry point
│   └── index.css           # Stili globali e reset CSS
├── index.html              # Template HTML principale
├── package.json            # Dipendenze e script
├── tsconfig.json           # Configurazione TypeScript
├── vite.config.ts         # Configurazione Vite
└── README.md               # Questo file
```

## 🎨 Funzionalità Dettagliate

### Finestre
- **Drag & Drop**: Trascina le finestre cliccando sulla title bar
- **Ridimensionamento**: Trascina i bordi per ridimensionare
- **Minimizzazione**: Riduci a icona nella taskbar
- **Massimizzazione**: Ingrandisci a schermo intero
- **Gestione Z-index**: Le finestre attive vengono portate in primo piano
- **Resize Handles**: 8 punti di ridimensionamento (4 lati + 4 angoli)

### Desktop
- **Icone Trascinabili**: Organizza le icone sul desktop
- **Slideshow Automatico**: Cambio automatico degli sfondi
- **Selezione Manuale**: Scegli lo sfondo preferito
- **Responsive Layout**: Adattamento automatico per mobile/tablet

### Taskbar
- **Pulsanti Finestre**: Un pulsante per ogni finestra aperta
- **Indicatore Attivo**: Evidenzia la finestra attualmente attiva
- **Gestione Minimizzate**: Ripristina le finestre minimizzate
- **Orologio**: Ora corrente in tempo reale
- **Thumbnail Preview**: Anteprima delle finestre al hover (desktop)

### Start Menu
- **Navigazione Completa**: Accesso a tutte le sezioni del portfolio
- **Categorie Organizzate**: Informazioni, Documenti, Applicazioni
- **Ricerca**: Funzionalità di ricerca integrata
- **Shutdown**: Opzione per chiudere l'applicazione

## 🔍 SEO e Ottimizzazioni

### Meta Tags
- Meta description ottimizzata
- Open Graph tags per social sharing
- Twitter Cards
- Structured Data (JSON-LD)
- Canonical URL
- Robots meta tag

### Performance
- Lazy loading componenti
- Code splitting automatico
- Immagini ottimizzate
- CSS minificato
- JavaScript bundle ottimizzato

### Accessibilità
- ARIA labels completi
- Navigazione da tastiera
- Contrasto colori WCAG compliant
- Screen reader friendly

## 📱 Compatibilità Browser

- ✅ Chrome/Edge (ultime 2 versioni)
- ✅ Firefox (ultime 2 versioni)
- ✅ Safari (ultime 2 versioni)
- ✅ Opera (ultime 2 versioni)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚢 Deploy

Il progetto è configurato per il deploy automatico su GitHub Pages:

```bash
npm run deploy
```

Il sito sarà disponibile su: **https://biagio-scaglia.github.io/portfolio-cv**

### Configurazione GitHub Pages
1. Vai su Settings del repository
2. Sezione Pages
3. Source: `gh-pages` branch
4. Il sito sarà disponibile dopo il deploy

## 🤝 Contribuire

Questo è un progetto personale/portfolio. Non accetto contribuzioni esterne al momento, ma puoi:
- ⭐ Fare star al repository se ti piace
- 🐛 Segnalare bug aprendo una issue
- 💡 Suggerire miglioramenti

## 📝 Licenza

Questo progetto è privato. Tutti i diritti riservati.

## 👤 Contatti

**Biagio Scaglia**

- 📧 Email: biagio.scaglia01@gmail.com
- 📱 Telefono: (+39) 3513150134
- 💼 LinkedIn: [Biagio Scaglia](https://www.linkedin.com/in/biagio-scaglia)
- 🌐 Portfolio: [biagio-scaglia.github.io/portfolio-cv](https://biagio-scaglia.github.io/portfolio-cv)
- 🐙 GitHub: [@biagio-scaglia](https://github.com/biagio-scaglia)
- 📍 Località: Modugno, Bari, Italia

## 🔑 Keywords

Portfolio developer, Sviluppatore software, React developer, TypeScript developer, Frontend developer, Web developer Italia, Portfolio interattivo, Windows 7 UI, React portfolio, Developer portfolio, CV online, Portfolio Bari, Portfolio Modugno, Full stack developer, UX/UI designer, React Native developer, JavaScript developer, Biagio Scaglia, Portfolio CV, Sviluppatore web, Programmatore web, Designer UI/UX, Portfolio creativo, Portfolio moderno, Portfolio responsive

---

**⭐ Se ti piace questo progetto, considera di fare una star al repository!**

Made with ❤️ by Biagio Scaglia
