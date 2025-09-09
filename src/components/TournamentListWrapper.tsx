'use client'

import React, { Suspense } from 'react'
import { Tournament } from '@/payload-types'
import TournamentList from './TournamentList'

interface TournamentListWrapperProps {
  tournaments?: Tournament[]
  onTournamentSelect?: (tournament: Tournament) => void
  selectedTournament?: number
  layout?: 'grid' | 'list'
}

function TournamentListFallback() {
  return (
    <div className="tournament-list-loading">
      <div className="loading-spinner">Loading tournaments...</div>
    </div>
  )
}

const TournamentListWrapper: React.FC<TournamentListWrapperProps> = (props) => {
  return (
    <Suspense fallback={<TournamentListFallback />}>
      <TournamentList {...props} />
    </Suspense>
  )
}

export default TournamentListWrapper
