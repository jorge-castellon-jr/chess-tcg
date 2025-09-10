'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card as CardType } from '@/payload-types'
import Card from './Card'
import CardFilters from './CardFilters'
import styles from './CardList.module.scss'

interface CardListProps {
  cards?: CardType[]
  onCardSelect?: (card: CardType) => void
  selectedCards?: (string | number)[]
  showFilters?: boolean
}

const CardList: React.FC<CardListProps> = ({
  cards = [],
  onCardSelect,
  selectedCards = [],
  showFilters = true,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filteredCards, setFilteredCards] = useState<CardType[]>(cards)

  // Get state from URL params
  const searchTerm = searchParams.get('search') || ''
  const sortBy = (searchParams.get('sort') as 'name' | 'date') || 'name'
  const classFilter = searchParams.get('class') || ''
  const typeFilter = searchParams.get('type') || ''
  const pieceTypeFilter = searchParams.get('pieceType') || ''
  const setFilter = searchParams.get('set') || ''

  // Local state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState(searchTerm)

  // Update local search input when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchInput(searchTerm)
  }, [searchTerm])

  // Function to update URL params
  const updateUrlParams = useCallback(
    (updates: { 
      search?: string; 
      sort?: string; 
      class?: string;
      type?: string;
      pieceType?: string;
      set?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== '') {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      router.push(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  // Debounced search update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== searchTerm) {
        updateUrlParams({ search: searchInput })
      }
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timeoutId)
  }, [searchInput, searchTerm, updateUrlParams])

  useEffect(() => {
    const filtered = cards.filter((card) => {
      const matchesSearch = card.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = !classFilter || card.class === classFilter
      const matchesType = !typeFilter || card.type === typeFilter
      const matchesPieceType = !pieceTypeFilter || card.pieceType === pieceTypeFilter
      const matchesSet = !setFilter || (typeof card.set === 'object' ? card.set?.name === setFilter : false)
      
      return matchesSearch && matchesClass && matchesType && matchesPieceType && matchesSet
    })

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '')
      }
    })

    setFilteredCards(filtered)
  }, [cards, searchTerm, sortBy, classFilter, typeFilter, pieceTypeFilter, setFilter])

  return (
    <div className={styles.cardList}>
      {showFilters && (
        <CardFilters
          searchTerm={searchInput}
          onSearchChange={setSearchInput}
          showClassFilter={true}
          classFilter={classFilter}
          onClassChange={(value) => updateUrlParams({ class: value })}
          typeFilter={typeFilter}
          onTypeChange={(value) => updateUrlParams({ type: value })}
          pieceTypeFilter={pieceTypeFilter}
          onPieceTypeChange={(value) => updateUrlParams({ pieceType: value })}
          setFilter={setFilter}
          onSetChange={(value) => updateUrlParams({ set: value })}
          showSortBy={true}
          sortBy={sortBy}
          onSortChange={(value) => updateUrlParams({ sort: value })}
          availableCards={cards}
        />
      )}

      <div className={styles.cardsGrid}>
        {filteredCards.length === 0 ? (
          <div className={styles.noCards}>
            <p>No cards found matching your criteria.</p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              selected={selectedCards.includes(card.id)}
              onClick={() => onCardSelect?.(card)}
              variant="default"
              showDate={true}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CardList
