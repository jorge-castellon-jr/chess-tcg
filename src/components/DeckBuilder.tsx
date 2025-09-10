'use client'

import React, { useState } from 'react'
import { Card as CardType } from '@/payload-types'
import Card from './Card'
import CardFilters from './CardFilters'

interface DeckCard {
  card: CardType
  quantity: number
}

interface Deck {
  id?: string
  name: string
  cards: DeckCard[]
  isPublic: boolean
}

interface DeckBuilderProps {
  availableCards?: CardType[]
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ availableCards = [] }) => {
  const [deck, setDeck] = useState<Deck>({
    name: '',
    cards: [],
    isPublic: false,
  })
  const [selectedKing, setSelectedKing] = useState<CardType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [pieceTypeFilter, setPieceTypeFilter] = useState('')
  const [setFilter, setSetFilter] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const addCardToDeck = (card: CardType) => {
    const newErrors: string[] = []

    // Check if it's a king
    if (card.pieceType === 'King') {
      if (selectedKing && selectedKing.id !== card.id) {
        newErrors.push('Only one king is allowed per deck')
        setErrors(newErrors)
        setTimeout(() => setErrors([]), 3000)
        return
      } else {
        // Set the king and automatically add it to deck
        setSelectedKing(card)
        
        // Auto-add king to deck if not already there
        setDeck((prev) => {
          const hasKing = prev.cards.some(deckCard => deckCard.card.pieceType === 'King')
          if (!hasKing) {
            return {
              ...prev,
              cards: [...prev.cards, { card, quantity: 1 }]
            }
          }
          return prev
        })
        
        setErrors([])
        return // Don't continue with normal adding logic
      }
    }

    // Check if it's a queen
    if (card.pieceType === 'Queen') {
      const queenCount = deck.cards.reduce(
        (count, deckCard) =>
          deckCard.card.pieceType === 'Queen'
            ? count + deckCard.quantity
            : count,
        0
      )
      if (queenCount >= 1) {
        newErrors.push('Only one queen is allowed per deck')
      }
    }

    // Check card limit (max 3 copies)
    const existingCard = deck.cards.find(
      (deckCard) => deckCard.card.id === card.id
    )
    if (existingCard && existingCard.quantity >= 3) {
      newErrors.push('Maximum 3 copies of any card allowed')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 3000) // Clear errors after 3 seconds
      return
    }

    setErrors([])

    setDeck((prev) => {
      const existingCardIndex = prev.cards.findIndex(
        (deckCard) => deckCard.card.id === card.id
      )

      if (existingCardIndex >= 0) {
        // Increment quantity if card already exists
        const updatedCards = [...prev.cards]
        updatedCards[existingCardIndex] = {
          ...updatedCards[existingCardIndex],
          quantity: updatedCards[existingCardIndex].quantity + 1,
        }
        return { ...prev, cards: updatedCards }
      } else {
        // Add new card with quantity 1
        return {
          ...prev,
          cards: [...prev.cards, { card, quantity: 1 }],
        }
      }
    })
  }

  const removeCardFromDeck = (cardIndex: number) => {
    const deckCard = deck.cards[cardIndex]
    const isKing = deckCard.card.pieceType === 'King'

    // Special handling for king removal
    if (isKing) {
      const confirmRemoval = window.confirm(
        'Removing the king will reset your entire deck. Are you sure?'
      )
      if (confirmRemoval) {
        setSelectedKing(null)
        setDeck((prev) => ({ ...prev, cards: [] }))
        setErrors([])
      }
      return
    }

    setDeck((prev) => {
      const updatedCards = [...prev.cards]

      if (deckCard.quantity > 1) {
        // Decrement quantity
        updatedCards[cardIndex].quantity -= 1
      } else {
        // Remove card entirely
        updatedCards.splice(cardIndex, 1)
      }

      return { ...prev, cards: updatedCards }
    })
  }

  const updateDeckName = (name: string) => {
    setDeck((prev) => ({ ...prev, name }))
  }

  const togglePublic = () => {
    setDeck((prev) => ({ ...prev, isPublic: !prev.isPublic }))
  }

  const validateDeck = (): string[] => {
    const errors: string[] = []

    if (!deck.name.trim()) {
      errors.push('Deck name is required')
    }

    if (deck.cards.length === 0) {
      errors.push('Deck must contain at least one card')
    }

    if (!selectedKing) {
      errors.push('Deck must contain a king')
    }

    return errors
  }

  const saveDeck = async () => {
    const validationErrors = validateDeck()
    if (validationErrors.length > 0) {
      alert('Deck validation failed:\n' + validationErrors.join('\n'))
      return
    }

    try {
      // TODO: Implement save functionality with Payload API
      console.log('Saving deck:', deck)
      alert(
        'Deck saved successfully! (This will be implemented with Payload API)'
      )
    } catch (error) {
      console.error('Error saving deck:', error)
      alert('Error saving deck. Please try again.')
    }
  }

  // Get available cards based on king selection and filters
  const getAvailableCards = (): CardType[] => {
    if (!selectedKing) {
      // Show only kings if no king is selected
      return availableCards.filter((card) => {
        const matchesSearch = card.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesType = !typeFilter || card.type === typeFilter
        const matchesPieceType =
          !pieceTypeFilter || card.pieceType === pieceTypeFilter
        const matchesSet =
          !setFilter ||
          (typeof card.set === 'object' ? card.set?.name === setFilter : false)
        const isKing = card.pieceType === 'King'

        return (
          matchesSearch &&
          matchesType &&
          matchesPieceType &&
          matchesSet &&
          isKing
        )
      })
    }

    // Show cards that match the king's class or are neutral, but exclude other kings
    return availableCards.filter((card) => {
      const matchesSearch = card.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesType = !typeFilter || card.type === typeFilter
      const matchesPieceType =
        !pieceTypeFilter || card.pieceType === pieceTypeFilter
      const matchesSet =
        !setFilter ||
        (typeof card.set === 'object' ? card.set?.name === setFilter : false)
      const matchesKingRule =
        card.class === selectedKing.class || card.class === 'Neutral'
      const isNotOtherKing =
        card.pieceType !== 'King' || card.id === selectedKing.id

      return (
        matchesSearch &&
        matchesType &&
        matchesPieceType &&
        matchesSet &&
        matchesKingRule &&
        isNotOtherKing
      )
    })
  }

  const filteredCards = getAvailableCards()

  const totalCards = deck.cards.reduce(
    (total, deckCard) => total + deckCard.quantity,
    0
  )
  const hasKing = selectedKing !== null
  const queenCount = deck.cards.reduce(
    (count, deckCard) =>
      deckCard.card.pieceType === 'Queen' ? count + deckCard.quantity : count,
    0
  )

  return (
    <div className="deck-builder">
      <div className="deck-builder-content">
        <div className="available-cards-section">
          <h2 className="section-title">
            {!selectedKing
              ? 'Choose a King to Start'
              : `Available Cards (${filteredCards.length})`}
          </h2>

          <CardFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            pieceTypeFilter={pieceTypeFilter}
            onPieceTypeChange={setPieceTypeFilter}
            setFilter={setFilter}
            onSetChange={setSetFilter}
            availableCards={availableCards}
          />

          {!selectedKing ? (
            <div className="instruction-message">
              <p>
                🤴 Select a king first to determine which cards are available
                for your deck.
              </p>
              <p>
                Kings define the class of cards you can include (along with
                Neutral cards).
              </p>
            </div>
          ) : (
            <div className="king-info">
              <strong>Selected King:</strong> {selectedKing.name} (
              {selectedKing.class})
              <p>
                Available cards limited to {selectedKing.class} and Neutral
                classes
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <div key={index} className="error-message">
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="cards-grid">
            {filteredCards.map((card) => {
              const deckCard = deck.cards.find((dc) => dc.card.id === card.id)
              const quantity = deckCard ? deckCard.quantity : 0
              const isMaxed = quantity >= 3
              const isQueen = card.pieceType === 'Queen'
              const queenMaxed = isQueen && queenCount >= 1
              const isSelectedKing = selectedKing && card.id === selectedKing.id
              const cannotAdd = isMaxed || queenMaxed || isSelectedKing

              return (
                <div
                  key={card.id}
                  className={`available-card ${cannotAdd ? 'maxed-out' : ''} ${isSelectedKing ? 'selected-king' : ''}`}
                >
                  <Card
                    card={card}
                    variant="compact"
                    onClick={() => !cannotAdd && addCardToDeck(card)}
                    showDate={false}
                  />
                  {quantity > 0 && !isSelectedKing && (
                    <div className="card-quantity-badge">{quantity}</div>
                  )}
                  {isMaxed && <div className="max-overlay">MAX (3)</div>}
                  {queenMaxed && !isMaxed && <div className="max-overlay">MAX QUEEN</div>}
                  {isSelectedKing && <div className="max-overlay">SELECTED</div>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="deck-section">
          <div className="deck-header">
            <h2 className="section-title">Your Deck</h2>
            <div className="deck-stats">
              <span className="card-count">{totalCards} total cards</span>
              <span className="unique-count">{deck.cards.length} unique</span>
              {hasKing && <span className="has-king">✓ Has King</span>}
              {queenCount > 0 && (
                <span className="queen-count">Queens: {queenCount}</span>
              )}
            </div>
          </div>

          <div className="deck-settings">
            <input
              type="text"
              placeholder="Enter deck name..."
              value={deck.name}
              onChange={(e) => updateDeckName(e.target.value)}
              className="deck-name-input"
            />

            <label className="public-checkbox">
              <input
                type="checkbox"
                checked={deck.isPublic}
                onChange={togglePublic}
              />
              <span>Make deck public</span>
            </label>
          </div>

          <div className="deck-cards">
            {deck.cards.length === 0 ? (
              <div className="empty-deck">
                <div className="empty-icon">🃏</div>
                <p>
                  Start building your deck by clicking cards from the available
                  collection
                </p>
              </div>
            ) : (
              <div className="deck-cards-grid">
                {deck.cards.map((deckCard, index) => {
                  const isKing = deckCard.card.pieceType === 'King'
                  
                  return (
                    <div
                      key={`${deckCard.card.id}-${index}`}
                      className={`deck-card ${isKing ? 'king-card' : ''}`}
                    >
                      <div className="deck-card-header">
                        <div className="deck-card-name">
                          {isKing && '👑 '}{deckCard.card.name || 'Untitled Card'}
                        </div>
                        <div className="card-controls">
                          {!isKing && (
                            <span className="quantity-display">
                              x{deckCard.quantity}
                            </span>
                          )}
                          <button
                            onClick={() => removeCardFromDeck(index)}
                            className="remove-btn"
                            title={isKing ? "Remove king (will reset deck)" : "Remove one copy"}
                          >
                            -
                          </button>
                        </div>
                      </div>
                      <div className="deck-card-info">
                        <span>{deckCard.card.class}</span>
                        <span>{deckCard.card.type}</span>
                        {deckCard.card.pieceType && (
                          <span>{deckCard.card.pieceType}</span>
                        )}
                      </div>
                      {isKing && (
                        <div className="king-overlay">
                          UNIQUE
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="deck-actions">
            <button
              onClick={saveDeck}
              disabled={validateDeck().length > 0}
              className="save-btn"
            >
              Save Deck
            </button>

            <button
              onClick={() => {
                setDeck({ name: '', cards: [], isPublic: false })
                setSelectedKing(null)
                setErrors([])
              }}
              className="clear-btn"
            >
              Clear Deck
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .deck-builder {
          width: 100%;
          background: var(--bg-primary);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .deck-builder-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          height: 800px;
        }

        .available-cards-section {
          padding: 24px;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }

        .deck-section {
          padding: 24px;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
        }

        .section-title {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .card-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-input,
        .filter-select {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .search-input {
          flex: 1;
        }

        .filter-select {
          min-width: 120px;
        }

        .king-info {
          background: var(--bg-primary);
          border: 1px solid var(--link-color);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .king-info p {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .instruction-message {
          background: var(--bg-primary);
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 12px;
          text-align: center;
          color: var(--text-primary);
        }

        .instruction-message p {
          margin: 8px 0;
          font-size: 14px;
        }

        .instruction-message p:first-child {
          font-weight: 600;
          font-size: 16px;
        }

        .error-messages {
          margin-bottom: 12px;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
          max-height: 400px;
        }

        .available-card {
          position: relative;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .available-card.maxed-out {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .available-card.selected-king {
          border: 2px solid #ffd700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .available-card:hover:not(.maxed-out) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow);
        }

        .card-quantity-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--link-color);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 2;
        }

        .max-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          z-index: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .card-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
        }

        .card-cost {
          background: var(--link-color);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .card-type {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .card-stats {
          font-size: 11px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex;
          gap: 8px;
        }

        .card-set {
          font-size: 10px;
          color: var(--text-secondary);
          font-style: italic;
        }

        .deck-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .deck-stats {
          display: flex;
          gap: 12px;
          font-size: 14px;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }

        .has-king {
          color: var(--link-color);
          font-weight: 600;
        }

        .queen-count {
          color: #9c27b0;
        }

        .deck-settings {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .deck-name-input {
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .public-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .deck-cards {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;
          max-height: 400px;
        }

        .empty-deck {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .deck-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .deck-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 8px;
          position: relative;
        }
        
        .deck-card.king-card {
          background: linear-gradient(135deg, var(--bg-primary) 0%, #ffd700 10%, var(--bg-primary) 20%);
          border: 2px solid #ffd700;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .deck-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .card-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quantity-display {
          font-weight: bold;
          color: var(--link-color);
          font-size: 14px;
        }

        .deck-card-name {
          font-weight: 500;
          font-size: 13px;
          color: var(--text-primary);
        }

        .remove-btn {
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
        }

        .remove-btn:hover {
          background: #cc0000;
        }

        .deck-card-info {
          display: flex;
          gap: 8px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .deck-card-info span {
          background: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
        }
        
        .king-overlay {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: rgba(255, 215, 0, 0.9);
          color: #000;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 8px;
          font-weight: bold;
          letter-spacing: 0.5px;
          z-index: 1;
        }

        .deck-actions {
          display: flex;
          gap: 8px;
        }

        .save-btn,
        .clear-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .save-btn {
          background: var(--link-color);
          color: white;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .save-btn:not(:disabled):hover {
          opacity: 0.9;
        }

        .clear-btn {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .clear-btn:hover {
          background: var(--bg-primary);
        }

        @media (max-width: 1024px) {
          .deck-builder-content {
            grid-template-columns: 1fr;
            height: auto;
          }

          .available-cards-section {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }

          .cards-grid {
            max-height: 400px;
          }
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .deck-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default DeckBuilder
