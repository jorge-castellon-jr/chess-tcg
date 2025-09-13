'use client'

import React, { useState, useRef } from 'react'
import { Deck, Card } from '@/payload-types'
import html2canvas from 'html2canvas'

interface DeckViewerProps {
  deck: Deck
}

const DeckViewer: React.FC<DeckViewerProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unique'>('all')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const deckRef = useRef<HTMLDivElement>(null)

  // Deck sorting function
  const sortDeckCards = (cards: { card: Card; quantity: number }[]) => {
    return cards.sort((a, b) => {
      const cardA = a.card
      const cardB = b.card
      
      // Priority 1: King first
      if (cardA.pieceType === 'King' && cardB.pieceType !== 'King') return -1
      if (cardB.pieceType === 'King' && cardA.pieceType !== 'King') return 1
      
      // Priority 2: Queen second
      if (cardA.pieceType === 'Queen' && cardB.pieceType !== 'Queen' && cardB.pieceType !== 'King') return -1
      if (cardB.pieceType === 'Queen' && cardA.pieceType !== 'Queen' && cardA.pieceType !== 'King') return 1
      
      // Get the deck's king to determine the main class
      const kingCard = cards.find(c => c.card.pieceType === 'King')?.card
      const mainClass = kingCard?.class || 'Neutral'
      
      // Priority 3: Same class pieces (excluding King/Queen)
      const isAPieceSameClass = cardA.type === 'Piece' && cardA.class === mainClass && cardA.pieceType !== 'King' && cardA.pieceType !== 'Queen'
      const isBPieceSameClass = cardB.type === 'Piece' && cardB.class === mainClass && cardB.pieceType !== 'King' && cardB.pieceType !== 'Queen'
      
      if (isAPieceSameClass && !isBPieceSameClass) return -1
      if (isBPieceSameClass && !isAPieceSameClass) return 1
      
      // Within same class pieces, sort by quantity then alphabetical
      if (isAPieceSameClass && isBPieceSameClass) {
        if (a.quantity !== b.quantity) return b.quantity - a.quantity // Higher count first
        return cardA.name.localeCompare(cardB.name) // Alphabetical
      }
      
      // Priority 4: Neutral class pieces (excluding King/Queen)
      const isAPieceNeutral = cardA.type === 'Piece' && cardA.class === 'Neutral' && cardA.pieceType !== 'King' && cardA.pieceType !== 'Queen'
      const isBPieceNeutral = cardB.type === 'Piece' && cardB.class === 'Neutral' && cardB.pieceType !== 'King' && cardB.pieceType !== 'Queen'
      
      if (isAPieceNeutral && !isBPieceNeutral && !isBPieceSameClass) return -1
      if (isBPieceNeutral && !isAPieceNeutral && !isAPieceSameClass) return 1
      
      // Within neutral pieces, sort by quantity then alphabetical
      if (isAPieceNeutral && isBPieceNeutral) {
        if (a.quantity !== b.quantity) return b.quantity - a.quantity // Higher count first
        return cardA.name.localeCompare(cardB.name) // Alphabetical
      }
      
      // Priority 5: Same class tactics
      const isATacticSameClass = cardA.type === 'Tactic' && cardA.class === mainClass
      const isBTacticSameClass = cardB.type === 'Tactic' && cardB.class === mainClass
      
      if (isATacticSameClass && !isBTacticSameClass) return -1
      if (isBTacticSameClass && !isATacticSameClass) return 1
      
      // Within same class tactics, sort by quantity then alphabetical
      if (isATacticSameClass && isBTacticSameClass) {
        if (a.quantity !== b.quantity) return b.quantity - a.quantity // Higher count first
        return cardA.name.localeCompare(cardB.name) // Alphabetical
      }
      
      // Priority 6: Neutral class tactics
      const isATacticNeutral = cardA.type === 'Tactic' && cardA.class === 'Neutral'
      const isBTacticNeutral = cardB.type === 'Tactic' && cardB.class === 'Neutral'
      
      if (isATacticNeutral && !isBTacticNeutral) return -1
      if (isBTacticNeutral && !isATacticNeutral) return 1
      
      // Within neutral tactics, sort by quantity then alphabetical
      if (isATacticNeutral && isBTacticNeutral) {
        if (a.quantity !== b.quantity) return b.quantity - a.quantity // Higher count first
        return cardA.name.localeCompare(cardB.name) // Alphabetical
      }
      
      // Fallback: alphabetical by name
      return cardA.name.localeCompare(cardB.name)
    })
  }

  // Prepare card data
  const allCards: { card: Card; quantity: number }[] = []
  const uniqueCards: { card: Card; quantity: number }[] = []

  if (deck.deckCards) {
    deck.deckCards.forEach((deckCard) => {
      if (typeof deckCard.card === 'object') {
        const card = deckCard.card as Card
        const quantity = deckCard.quantity || 1
        
        uniqueCards.push({ card, quantity })
        
        // Add card multiple times for all cards view
        for (let i = 0; i < quantity; i++) {
          allCards.push({ card, quantity: 1 })
        }
      }
    })
  }

  // Sort both arrays
  const sortedUniqueCards = sortDeckCards(uniqueCards)
  const sortedAllCards = sortDeckCards(allCards)

  // Separate King and other cards for All Cards view
  const kingCard = sortedAllCards.find(item => item.card.pieceType === 'King')
  const nonKingCards = sortedAllCards.filter(item => item.card.pieceType !== 'King')

  // Calculate deck statistics
  const deckClass = sortedUniqueCards.find(c => c.card.pieceType === 'King')?.card.class || 'Unknown'
  const pieceCount = sortedUniqueCards.reduce((count, item) => {
    return item.card.type === 'Piece' ? count + item.quantity : count
  }, 0)
  const tacticCount = sortedUniqueCards.reduce((count, item) => {
    return item.card.type === 'Tactic' ? count + item.quantity : count
  }, 0)

  const copyShareLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      // You could add a toast notification here
      alert('Deck link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Failed to copy link')
    }
  }

  const generateDeckImage = async () => {
    if (!deckRef.current) return

    setIsGeneratingImage(true)
    try {
      const canvas = await html2canvas(deckRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false, // Disable html2canvas logging for cleaner console
      } as any)
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            alert('Deck image copied to clipboard!')
          } catch (error) {
            console.error('Failed to copy image:', error)
            // Fallback: download the image
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${deck.name}-deck.png`
            link.click()
            URL.revokeObjectURL(url)
            alert('Deck image downloaded!')
          }
        }
        setIsGeneratingImage(false)
      })
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate deck image')
      setIsGeneratingImage(false)
    }
  }

  const renderCard = (card: Card, quantity?: number, showQuantity: boolean = false) => {
    const imageUrl = typeof card.image === 'object' && card.image?.url 
      ? card.image.url 
      : '/placeholder-card.png' // You'll need a placeholder image

    return (
      <div 
        key={`${card.id}-${Math.random()}`} 
        className="deck-card"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          aspectRatio: '2.5 / 3.5',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {showQuantity && quantity && quantity > 1 && (
          <div 
            className="quantity-badge"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'linear-gradient(135deg, #ff4444, #cc0000)',
              color: 'white',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '900',
              zIndex: 100,
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.5)',
              border: '2px solid white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            {quantity}
          </div>
        )}
        <img
          src={imageUrl}
          alt={card.name}
          className="card-image"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: '12px'
          }}
        />
      </div>
    )
  }

  return (
    <div className="deck-viewer">
      <div className="deck-controls">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Cards ({sortedAllCards.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'unique' ? 'active' : ''}`}
            onClick={() => setActiveTab('unique')}
          >
            Unique Cards ({sortedUniqueCards.length})
          </button>
        </div>

        <div className="action-buttons">
          <button
            onClick={copyShareLink}
            className="share-button"
          >
            📋 Copy Link
          </button>
          <button
            onClick={generateDeckImage}
            className="image-button"
            disabled={isGeneratingImage}
          >
            {isGeneratingImage ? '⏳ Generating...' : '📸 Save Image'}
          </button>
        </div>
      </div>

      <div className="deck-content" ref={deckRef}>
        <div className="deck-header-print">
          <h2>{deck.name}</h2>
          <p>{deckClass} Deck • {sortedUniqueCards.length} Unique • {pieceCount} Pieces • {tacticCount} Tactics</p>
        </div>

        {activeTab === 'all' && kingCard && (
          <div className="king-section">
            <div className="king-container">
              {renderCard(kingCard.card, kingCard.quantity, false)}
            </div>
          </div>
        )}

        <div className="cards-grid">
          {activeTab === 'all'
            ? nonKingCards.map((item, _index) =>
                renderCard(item.card, item.quantity, false)
              )
            : sortedUniqueCards.map((item, _index) =>
                renderCard(item.card, item.quantity, true)
              )}
        </div>
      </div>

      <style jsx>{`
        .deck-viewer {
          width: 100%;
        }

        .deck-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .tab-buttons {
          display: flex;
          gap: 8px;
        }

        .tab-button {
          padding: 14px 28px;
          border: 2px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .tab-button:hover {
          background: var(--bg-secondary);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tab-button.active {
          background: var(--link-color);
          color: white;
          border-color: var(--link-color);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .share-button,
        .image-button {
          padding: 14px 20px;
          border: 2px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .share-button:hover,
        .image-button:hover:not(:disabled) {
          background: var(--bg-secondary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--link-color);
        }

        .image-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .deck-content {
          background: var(--bg-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 32px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .deck-header-print {
          margin-bottom: 32px;
          text-align: center;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 24px;
        }

        .deck-header-print h2 {
          margin: 0 0 12px 0;
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .deck-header-print p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 18px;
          font-weight: 500;
        }

        .king-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid var(--border-color);
        }

        .king-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          padding: 0;
          justify-content: center;
          width: 207.5px;
          margin: 0 auto;
        }

        .king-container .deck-card {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          padding: 0;
        }

        .deck-card {
          position: relative !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          aspect-ratio: 2.5 / 3.5 !important;
          border: none !important;
        }

        .deck-card:hover {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25) !important;
        }

        .quantity-badge {
          position: absolute !important;
          top: 10px !important;
          left: 10px !important;
          background: linear-gradient(135deg, #ff4444, #cc0000) !important;
          color: white !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 18px !important;
          font-weight: 900 !important;
          z-index: 100 !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5) !important;
          padding: 0 !important;
          border: 2px solid white !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
          font-family: 'Inter', 'Arial', sans-serif !important;
        }

        .card-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          background: var(--bg-primary) !important;
          display: block !important;
          border-radius: 12px !important;
          border: none !important;
        }

        @media (max-width: 768px) {
          .deck-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .tab-buttons,
          .action-buttons {
            justify-content: center;
          }

          .cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 10px;
          }

          .quantity-badge {
            top: 8px !important;
            left: 8px !important;
            width: 30px !important;
            height: 30px !important;
            min-width: 30px !important;
            font-size: 16px !important;
            border-width: 2px !important;
          }

          .king-section {
            margin-bottom: 24px;
            padding-bottom: 20px;
          }

          .king-container {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            width: auto;
            max-width: none;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  )
}

export default DeckViewer
