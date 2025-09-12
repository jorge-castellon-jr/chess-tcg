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
            {/* Top Right Corner - Cost/Material Fraction */}
            <div className={styles.cardCostMaterial}>
              {(card.Cost !== null && card.Cost !== undefined) || (card.Material !== null && card.Material !== undefined) ? (
                <div className={styles.fraction}>
                  <div className={styles.fractionTop}>
                    <span className={styles.fractionLabel}>C</span>
                    <span>{card.Cost ?? '?'}</span>
                  </div>
                  <div className={styles.fractionLine}></div>
                  <div className={styles.fractionBottom}>
                    <span className={styles.fractionLabel}>M</span>
                    <span>{card.Material ?? '?'}</span>
                  </div>
                </div>
              ) : null}
            </div>
            
            <div className={styles.cardPlaceholderContent}>
              {/* Top Half - Card Name */}
              <div className={styles.cardTopHalf}>
                <h3 className={styles.cardPlaceholderName}>{card.name}</h3>
                
                {/* Class Slim Section */}
                <div className={styles.cardClassSection}>
                  <div className={styles.cardClass}>{card.class}</div>
                </div>
              </div>
              
              {/* Bottom Half - Card Effect */}
              <div className={styles.cardBottomHalf}>
                <div className={styles.cardEffect}>
                  {card.effect || 'No effect text'}
                </div>
              </div>
              
              {/* Footer - Attack and Defense (only show if stats exist) */}
              {((card.ATK !== null && card.ATK !== undefined) || (card.DEF !== null && card.DEF !== undefined)) && (
                <div className={styles.cardFooter}>
                  <div className={styles.cardAttack}>
                    {card.ATK !== null && card.ATK !== undefined ? `ATK: ${card.ATK}` : ''}
                  </div>
                  <div className={styles.cardDefense}>
                    {card.DEF !== null && card.DEF !== undefined ? `DEF: ${card.DEF}` : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
