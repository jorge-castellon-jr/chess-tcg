import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import DeckBuilder from '../../../components/DeckBuilder'
import ThemeToggle from '../../../components/ThemeToggle'
import styles from '../../../styles/PageLayout.module.scss'
import { Metadata } from 'next'
import { Card } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Deck Builder - Chess TCG',
  description: 'Build and customize your perfect Chess Trading Card Game deck.',
}

// Revalidate this page every 30 seconds to ensure fresh card data
export const revalidate = 30

interface DeckBuilderPageProps {
  searchParams: Promise<{ clone?: string }>
}

export default async function DeckBuilderPage({ searchParams }: DeckBuilderPageProps) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const resolvedSearchParams = await searchParams
  const cloneData = resolvedSearchParams.clone

  // Fetch all cards for deck building
  let cards: Card[] = []
  try {
    const result = await payload.find({
      collection: 'cards',
      limit: 1000,
      depth: 2, // Include set relationships
    })
    cards = result.docs
  } catch (error) {
    console.error('Error fetching cards:', error)
  }

  return (
    <div className={styles.page}>
      <ThemeToggle />

      <header className={styles.pageHeader}>
        <nav className={styles.pageNavWide}>
          <Link href="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>
            Deck Builder{cloneData ? ' - Cloning Deck' : ''}
          </h1>
        </nav>
      </header>

      <main className={styles.pageContentWide}>
        <div className={styles.contentContainer}>
          {cards.length > 0 ? (
            <DeckBuilder availableCards={cards} cloneData={cloneData} />
          ) : (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>⚒️</div>
              <h2>No Cards Available</h2>
              <p>
                You need cards in the database to build decks. Add some cards
                through the admin panel to start building your collection.
              </p>
              <div className={styles.actionButtons}>
                <Link href="/admin" className={styles.adminLink}>
                  Go to Admin Panel
                </Link>
                <Link href="/cards" className={styles.secondaryLink}>
                  Browse Cards
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
