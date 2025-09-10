'use client'

import React from 'react'
import { Card as CardType } from '@/payload-types'
import styles from './CardFilters.module.scss'

interface CardFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  
  // Optional filters - only show if provided
  showClassFilter?: boolean
  classFilter?: string
  onClassChange?: (value: string) => void
  
  typeFilter?: string
  onTypeChange?: (value: string) => void
  
  pieceTypeFilter?: string
  onPieceTypeChange?: (value: string) => void
  
  setFilter?: string
  onSetChange?: (value: string) => void
  
  // Sort functionality
  showSortBy?: boolean
  sortBy?: string
  onSortChange?: (value: string) => void
  
  // Available cards for dynamic set options
  availableCards?: CardType[]
  
  className?: string
}

const CardFilters: React.FC<CardFiltersProps> = ({
  searchTerm,
  onSearchChange,
  showClassFilter = false,
  classFilter = '',
  onClassChange,
  typeFilter = '',
  onTypeChange,
  pieceTypeFilter = '',
  onPieceTypeChange,
  setFilter = '',
  onSetChange,
  showSortBy = false,
  sortBy = 'name',
  onSortChange,
  availableCards = [],
  className = '',
}) => {
  const availableSets = Array.from(new Set(availableCards.map(card => 
    typeof card.set === 'object' ? card.set?.name : null
  ).filter(Boolean) as string[]))

  return (
    <div className={`${styles.cardFilters} ${className}`}>
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />

      {showClassFilter && onClassChange && (
        <select
          value={classFilter}
          onChange={(e) => onClassChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Classes</option>
          <option value="Neutral">Neutral</option>
          <option value="Hearts">Hearts</option>
          <option value="Diamonds">Diamonds</option>
          <option value="Clubs">Clubs</option>
          <option value="Spades">Spades</option>
        </select>
      )}

      {onTypeChange && (
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          <option value="Piece">Piece</option>
          <option value="Tactic">Tactic</option>
        </select>
      )}

      {onPieceTypeChange && (
        <select
          value={pieceTypeFilter}
          onChange={(e) => onPieceTypeChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Piece Types</option>
          <option value="Basic">Basic</option>
          <option value="Queen">Queen</option>
          <option value="King">King</option>
        </select>
      )}

      {onSetChange && availableSets.length > 0 && (
        <select
          value={setFilter}
          onChange={(e) => onSetChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Sets</option>
          {availableSets.map(setName => (
            <option key={setName} value={setName}>{setName}</option>
          ))}
        </select>
      )}

      {showSortBy && onSortChange && (
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date Created</option>
        </select>
      )}
    </div>
  )
}

export default CardFilters
