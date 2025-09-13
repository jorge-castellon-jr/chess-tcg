import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { Deck } from '@/payload-types'

import config from '@/payload.config'
import DeckViewer from '../../../../components/DeckViewer'
import ThemeToggle from '../../../../components/ThemeToggle'
import styles from '../../../../styles/PageLayout.module.scss'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const deck = await payload.findByID({
      collection: 'decks',
      id: parseInt(params.id),
      depth: 2,
    })

    return {
      title: `${deck.name} - Chess TCG Deck`,
      description: `View the complete ${deck.name} deck for Chess Trading Card Game.`,
    }
  } catch (error) {
    return {
      title: 'Deck Not Found - Chess TCG',
      description: 'The requested deck could not be found.',
    }
  }
}

export default async function DeckDetailPage({ params }: PageProps) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let deck: Deck
  try {
    deck = await payload.findByID({
      collection: 'decks',
      id: parseInt(params.id),
      depth: 2, // Include card relationships and their images
    })
  } catch (error) {
    console.error('Error fetching deck:', error)
    notFound()
  }

  return (
    <div className={styles.page}>
      <ThemeToggle />

      <header className={styles.pageHeader}>
        <nav className={styles.pageNav}>
          <Link href="/decks" className={styles.homeLink}>
            ← Back to Decks
          </Link>
          <h1 className={styles.pageTitle}>{deck.name}</h1>
        </nav>
      </header>

      <main className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <DeckViewer deck={deck} />
        </div>
      </main>
    </div>
  )
}
