'use client'

import React, { Suspense } from 'react'
import { Card as CardType } from '@/payload-types'
import CardList from './CardList'

interface CardListWrapperProps {
  cards?: CardType[]
  onCardSelect?: (card: CardType) => void
  selectedCards?: (string | number)[]
  showFilters?: boolean
}

function CardListFallback() {
  return (
    <div className="card-list-loading">
      <div className="loading-spinner">Loading cards...</div>
    </div>
  )
}

const CardListWrapper: React.FC<CardListWrapperProps> = (props) => {
  return (
    <Suspense fallback={<CardListFallback />}>
      <CardList {...props} />
    </Suspense>
  )
}

export default CardListWrapper
