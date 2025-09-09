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
  const getImageUrl = (image: CardType['image']): string | null => {
    if (!image) return null
    if (typeof image === 'object' && 'url' in image) {
      return image.url || null
    }
    return null
  }

  // Helper function to get image alt text
  const getImageAlt = (
    image: CardType['image'],
    cardName?: string | null
  ): string => {
    if (image === null) return 'Card image'
    if (typeof image === 'object' && 'alt' in image && image.alt) {
      return image.alt
    }
    return cardName ? `${cardName} card` : 'Card image'
  }

  const imageUrl = getImageUrl(card.image)
  const imageAlt = getImageAlt(card.image, card.name)

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
            <span>🎴</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
