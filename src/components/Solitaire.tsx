import { useState, useEffect } from 'react'
import Window from './Window'

interface SolitaireProps {
  onClose: () => void
  onMinimize?: () => void
  icon?: React.ReactNode
}

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  value: number // 1 = A, 11 = J, 12 = Q, 13 = K
  faceUp: boolean
}

const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const
const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }
const suitColors = { hearts: '#e74c3c', diamonds: '#e74c3c', clubs: '#2c3e50', spades: '#2c3e50' }
const valueNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export default function Solitaire({ onClose, onMinimize, icon }: SolitaireProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [columns, setColumns] = useState<Card[][]>([[], [], [], [], [], [], []])
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []])
  const [waste, setWaste] = useState<Card[]>([])
  const [stock, setStock] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<{ type: 'column' | 'waste' | 'foundation', index: number, cardIndex?: number } | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    newGame()
  }, [])

  const createDeck = (): Card[] => {
    const newDeck: Card[] = []
    for (const suit of suits) {
      for (let value = 1; value <= 13; value++) {
        newDeck.push({ suit, value, faceUp: false })
      }
    }
    return shuffleDeck(newDeck)
  }

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const newGame = () => {
    const newDeck = createDeck()
    const newColumns: Card[][] = [[], [], [], [], [], [], []]
    const newStock: Card[] = []
    const newWaste: Card[] = []
    const newFoundations: Card[][] = [[], [], [], []]

    // Distribuisci le carte nelle colonne
    let cardIndex = 0
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = { ...newDeck[cardIndex], faceUp: row === col }
        newColumns[col].push(card)
        cardIndex++
      }
    }

    // Le carte rimanenti vanno nello stock
    for (let i = cardIndex; i < newDeck.length; i++) {
      newStock.push(newDeck[i])
    }

    setColumns(newColumns)
    setStock(newStock)
    setWaste(newWaste)
    setFoundations(newFoundations)
    setSelectedCard(null)
  }

  const drawCard = () => {
    if (stock.length === 0 && waste.length > 0) {
      // Ricicla le carte di scarto nello stock
      const recycled = waste.map(card => ({ ...card, faceUp: false })).reverse()
      setStock(recycled)
      setWaste([])
    } else if (stock.length > 0) {
      const drawn = stock[stock.length - 1]
      setStock(stock.slice(0, -1))
      setWaste([...waste, { ...drawn, faceUp: true }])
    }
  }

  const canPlaceOnColumn = (card: Card, column: Card[]): boolean => {
    if (column.length === 0) {
      return card.value === 13 // Solo i K possono andare su colonna vuota
    }
    const topCard = column[column.length - 1]
    if (!topCard.faceUp) return false
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds'
    const isTopRed = topCard.suit === 'hearts' || topCard.suit === 'diamonds'
    return card.value === topCard.value - 1 && isRed !== isTopRed
  }

  const canPlaceOnFoundation = (card: Card, foundation: Card[]): boolean => {
    if (foundation.length === 0) {
      return card.value === 1 // Solo A possono iniziare una fondazione
    }
    const topCard = foundation[foundation.length - 1]
    return card.suit === topCard.suit && card.value === topCard.value + 1
  }

  const handleCardClick = (type: 'column' | 'waste' | 'foundation', index: number, cardIndex?: number) => {
    if (selectedCard) {
      // Prova a muovere la carta
      let sourceCard: Card | null = null
      
      if (selectedCard.type === 'column' && selectedCard.cardIndex !== undefined) {
        const col = columns[selectedCard.index]
        if (col[selectedCard.cardIndex]) {
          sourceCard = col[selectedCard.cardIndex]
        }
      } else if (selectedCard.type === 'waste') {
        sourceCard = waste[waste.length - 1]
      } else if (selectedCard.type === 'foundation') {
        sourceCard = foundations[selectedCard.index][foundations[selectedCard.index].length - 1]
      }

      if (sourceCard && type === 'column') {
        if (canPlaceOnColumn(sourceCard, columns[index])) {
          // Muovi la carta
          if (selectedCard.type === 'column' && selectedCard.cardIndex !== undefined) {
            const newColumns = [...columns]
            const cardsToMove = newColumns[selectedCard.index].slice(selectedCard.cardIndex)
            newColumns[selectedCard.index] = newColumns[selectedCard.index].slice(0, selectedCard.cardIndex)
            if (newColumns[selectedCard.index].length > 0) {
              newColumns[selectedCard.index][newColumns[selectedCard.index].length - 1].faceUp = true
            }
            newColumns[index] = [...newColumns[index], ...cardsToMove]
            setColumns(newColumns)
          } else if (selectedCard.type === 'waste') {
            const newWaste = waste.slice(0, -1)
            const newColumns = [...columns]
            newColumns[index] = [...newColumns[index], sourceCard]
            setWaste(newWaste)
            setColumns(newColumns)
          }
        }
      } else if (sourceCard && type === 'foundation') {
        if (canPlaceOnFoundation(sourceCard, foundations[index])) {
          if (selectedCard.type === 'column' && selectedCard.cardIndex !== undefined) {
            const newColumns = [...columns]
            const card = newColumns[selectedCard.index].pop()!
            if (newColumns[selectedCard.index].length > 0) {
              newColumns[selectedCard.index][newColumns[selectedCard.index].length - 1].faceUp = true
            }
            setColumns(newColumns)
            setFoundations(foundations.map((f, i) => i === index ? [...f, card] : f))
          } else if (selectedCard.type === 'waste') {
            const newWaste = waste.slice(0, -1)
            setWaste(newWaste)
            setFoundations(foundations.map((f, i) => i === index ? [...f, sourceCard!] : f))
          }
        }
      }
      
      setSelectedCard(null)
    } else {
      // Seleziona la carta
      if (type === 'column' && cardIndex !== undefined) {
        const col = columns[index]
        if (col[cardIndex]?.faceUp) {
          setSelectedCard({ type, index, cardIndex })
        }
      } else if (type === 'waste' && waste.length > 0) {
        setSelectedCard({ type, index })
      } else if (type === 'foundation' && foundations[index].length > 0) {
        setSelectedCard({ type, index })
      }
    }
  }

  const renderCard = (card: Card, isSelected: boolean = false) => {
    if (!card.faceUp) {
      return (
        <div
          style={{
            width: windowWidth <= 480 ? '40px' : '50px',
            height: windowWidth <= 480 ? '56px' : '70px',
            background: '#2c3e50',
            border: '2px solid #34495e',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: windowWidth <= 480 ? '20px' : '24px',
            cursor: 'pointer',
            boxShadow: isSelected ? '0 0 8px #3498db' : '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          🂠
        </div>
      )
    }

    return (
      <div
        style={{
          width: windowWidth <= 480 ? '40px' : '50px',
          height: windowWidth <= 480 ? '56px' : '70px',
          background: '#fff',
          border: isSelected ? '2px solid #3498db' : '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isSelected ? '0 0 8px #3498db' : '0 2px 4px rgba(0,0,0,0.2)',
          fontSize: windowWidth <= 480 ? '10px' : '12px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ color: suitColors[card.suit] }}>
          {valueNames[card.value - 1]} {suitSymbols[card.suit]}
        </div>
        <div style={{ alignSelf: 'center', fontSize: windowWidth <= 480 ? '16px' : '20px', color: suitColors[card.suit] }}>
          {suitSymbols[card.suit]}
        </div>
        <div style={{ color: suitColors[card.suit], transform: 'rotate(180deg)' }}>
          {valueNames[card.value - 1]} {suitSymbols[card.suit]}
        </div>
      </div>
    )
  }

  const isWon = foundations.every(f => f.length === 13)

  return (
    <Window
      title="Solitario"
      width={windowWidth <= 480 ? Math.min(400, window.innerWidth - 20) : windowWidth <= 768 ? Math.min(700, window.innerWidth - 40) : 800}
      height={windowWidth <= 480 ? Math.min(600, window.innerHeight - 100) : windowWidth <= 768 ? Math.min(700, window.innerHeight - 80) : 700}
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
        gap: '15px',
        background: '#2ecc71',
        overflow: 'auto'
      }}>
        {isWon && (
          <div style={{
            padding: '20px',
            background: '#f39c12',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontSize: windowWidth <= 480 ? '16px' : '20px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            🎉 Hai vinto! 🎉
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <button onClick={newGame} style={{ marginRight: '10px' }}>
            Nuova Partita
          </button>
        </div>

        {/* Stock e Waste */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div onClick={drawCard} style={{ cursor: 'pointer' }}>
            {stock.length > 0 ? (
              <div style={{
                width: windowWidth <= 480 ? '40px' : '50px',
                height: windowWidth <= 480 ? '56px' : '70px',
                background: '#2c3e50',
                border: '2px solid #34495e',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: windowWidth <= 480 ? '20px' : '24px',
              }}>
                🂠
              </div>
            ) : (
              <div style={{
                width: windowWidth <= 480 ? '40px' : '50px',
                height: windowWidth <= 480 ? '56px' : '70px',
                border: '2px dashed #ccc',
                borderRadius: '4px',
              }} />
            )}
          </div>
          
          <div onClick={() => waste.length > 0 && handleCardClick('waste', 0)}>
            {waste.length > 0 ? renderCard(waste[waste.length - 1], selectedCard?.type === 'waste' && selectedCard.index === 0) : (
              <div style={{
                width: windowWidth <= 480 ? '40px' : '50px',
                height: windowWidth <= 480 ? '56px' : '70px',
                border: '2px dashed #ccc',
                borderRadius: '4px',
              }} />
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* Foundations */}
          {foundations.map((foundation, index) => (
            <div
              key={index}
              onClick={() => handleCardClick('foundation', index)}
              style={{ cursor: 'pointer' }}
            >
              {foundation.length > 0 ? (
                renderCard(foundation[foundation.length - 1], selectedCard?.type === 'foundation' && selectedCard.index === index)
              ) : (
                <div style={{
                  width: windowWidth <= 480 ? '40px' : '50px',
                  height: windowWidth <= 480 ? '56px' : '70px',
                  border: '2px dashed #95a5a6',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: windowWidth <= 480 ? '16px' : '20px',
                  color: '#95a5a6',
                }}>
                  {suitSymbols[suits[index]]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Colonne */}
        <div style={{ display: 'flex', gap: '8px', flex: 1, overflowX: 'auto' }}>
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: column.length > 0 ? (windowWidth <= 480 ? '-36px' : '-50px') : '0',
                minWidth: windowWidth <= 480 ? '40px' : '50px',
              }}
            >
              {column.length === 0 ? (
                <div
                  onClick={() => handleCardClick('column', colIndex, 0)}
                  style={{
                    width: windowWidth <= 480 ? '40px' : '50px',
                    height: windowWidth <= 480 ? '56px' : '70px',
                    border: '2px dashed #95a5a6',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                column.map((card, cardIndex) => (
                  <div
                    key={cardIndex}
                    onClick={() => handleCardClick('column', colIndex, cardIndex)}
                    style={{
                      marginTop: cardIndex > 0 ? (windowWidth <= 480 ? '36px' : '50px') : '0',
                    }}
                  >
                    {renderCard(
                      card,
                      selectedCard?.type === 'column' && selectedCard.index === colIndex && selectedCard.cardIndex === cardIndex
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}

