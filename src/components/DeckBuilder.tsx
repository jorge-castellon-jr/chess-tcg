'use client'

import React, { useState } from 'react'
import { Card as CardType } from '@/payload-types'
import Card from './Card'

interface Deck {
  id?: string
  name: string
  cards: CardType[]
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

  const [searchTerm, setSearchTerm] = useState('')
  const addCardToDeck = (card: CardType) => {
    setDeck((prev) => ({
      ...prev,
      cards: [...prev.cards, card],
    }))
  }

  const removeCardFromDeck = (cardIndex: number) => {
    setDeck((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, index) => index !== cardIndex),
    }))
  }

  const updateDeckName = (name: string) => {
    setDeck((prev) => ({ ...prev, name }))
  }

  const togglePublic = () => {
    setDeck((prev) => ({ ...prev, isPublic: !prev.isPublic }))
  }

  const saveDeck = async () => {
    if (!deck.name || deck.cards.length === 0) {
      alert('Please provide a deck name and add at least one card')
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

  const filteredCards = availableCards.filter((card) => {
    const matchesSearch = card.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const cardCounts = deck.cards.reduce(
    (counts, card) => {
      counts[card.id.toString()] = (counts[card.id.toString()] || 0) + 1
      return counts
    },
    {} as Record<string, number>
  )

  return (
    <div className="deck-builder">
      <div className="deck-builder-content">
        <div className="available-cards-section">
          <h2 className="section-title">
            Available Cards ({filteredCards.length})
          </h2>

          <div className="card-filters">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="cards-grid">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                variant="compact"
                onClick={() => addCardToDeck(card)}
                showDate={true}
              />
            ))}
          </div>
        </div>

        <div className="deck-section">
          <div className="deck-header">
            <h2 className="section-title">Your Deck</h2>
            <div className="deck-stats">
              <span className="card-count">{deck.cards.length} cards</span>
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
                {deck.cards.map((card, index) => (
                  <div key={`${card.id}-${index}`} className="deck-card">
                    <div className="deck-card-header">
                      <div className="deck-card-name">
                        {card.name || 'Untitled Card'}
                      </div>
                      <button
                        onClick={() => removeCardFromDeck(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="deck-actions">
            <button
              onClick={saveDeck}
              disabled={!deck.name || deck.cards.length === 0}
              className="save-btn"
            >
              Save Deck
            </button>

            <button
              onClick={() => setDeck({ name: '', cards: [], isPublic: false })}
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
        .type-filter {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .search-input {
          flex: 1;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }

        .available-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .available-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow);
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
        }

        .deck-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
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
          width: 20px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .deck-card-info {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-secondary);
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
