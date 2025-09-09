'use client'

import React, { Suspense } from 'react'
import { Set } from '@/payload-types'
import SetList from './SetList'

interface SetListWrapperProps {
  sets?: Set[]
  onSetSelect?: (set: Set) => void
  selectedSet?: string
  layout?: 'grid' | 'list'
}

function SetListFallback() {
  return (
    <div className="set-list-loading">
      <div className="loading-spinner">Loading sets...</div>
    </div>
  )
}

const SetListWrapper: React.FC<SetListWrapperProps> = (props) => {
  return (
    <Suspense fallback={<SetListFallback />}>
      <SetList {...props} />
    </Suspense>
  )
}

export default SetListWrapper
