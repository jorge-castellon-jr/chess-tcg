'use client'

import React from 'react'
import { Card as CardType } from '@/payload-types'
import styles from './Card.module.scss'

interface CardProps {
  card: CardType
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'compact' | 'mini'
  showDate?: boolean
  className?: string
}

const Card: React.FC<CardProps> = ({
  card,
  onClick,
  selected = false,
  variant = 'default',
  showDate: _showDate = true,
  className = '',
}) => {
  // Helper function to get image URL
  const getImageUrl = (card: CardType): string | null => {
    if (!card.image) return null
    
    // Handle both populated and non-populated image relationships
    if (typeof card.image === 'object' && card.image.filename) {
      return `${process.env.NEXT_PUBLIC_R2_URL}${card.image.filename}`
    }
    
    return null
  }

  // Helper function to get image alt text
  const getImageAlt = (cardName?: string | null): string => {
    return cardName ? `${cardName} card` : 'Card image'
  }

  const imageUrl = getImageUrl(card)
  const imageAlt = getImageAlt(card.name)

  const cardClasses = [
    styles.card,
    styles[variant],
    selected ? styles.selected : '',
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className={styles.cardImageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} className={styles.cardImage} />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <div className={styles.cardPlaceholderContent}>
              <h3 className={styles.cardPlaceholderName}>{card.name}</h3>
              <div className={styles.cardPlaceholderDetails}>
                <div>{card.class}</div>
                <div>{card.type}</div>
                {card.pieceType && <div>{card.pieceType}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
