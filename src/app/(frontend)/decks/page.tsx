import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Deck } from '@/payload-types'

import config from '@/payload.config'
import ThemeToggle from '../../../components/ThemeToggle'
import styles from '../../../styles/PageLayout.module.scss'

export const metadata = {
  title: 'Saved Decks - Chess TCG',
  description:
    'Browse all saved decks for Chess Trading Card Game.',
}

// Revalidate this page every 30 seconds to ensure fresh deck data
export const revalidate = 30

export default async function DecksPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch all decks
  let decks: Deck[] = []
  try {
    const result = await payload.find({
      collection: 'decks',
      limit: 1000,
      sort: '-createdAt', // Sort by newest first
      depth: 2, // Include card relationships
    })
    decks = result.docs
  } catch (error) {
    console.error('Error fetching decks:', error)
  }

  return (
    <div className={styles.page}>
      <ThemeToggle />

      <header className={styles.pageHeader}>
        <nav className={styles.pageNav}>
          <Link href="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>Saved Decks</h1>
        </nav>
      </header>

      <main className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <div className={styles.pageIntro}>
            <p>
              Browse all saved Chess TCG decks. Click on any deck to view its
              full card list and get shareable images.
            </p>
            <Link href="/deck-builder" className={styles.primaryButton}>
              Build New Deck
            </Link>
          </div>

          {decks.length === 0 ? (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>🃏</div>
              <h2>No Decks Available</h2>
              <p>
                No decks have been saved yet. Start by building your first deck!
              </p>
              <div className={styles.actionButtons}>
                <Link href="/deck-builder" className={styles.primaryButton}>
                  Build Your First Deck
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.gridContainer}>
              {decks.map((deck) => {
                // Calculate deck statistics
                const uniqueCards = deck.deckCards?.length || 0
                
                // Find deck class from King card
                const deckClass = deck.deckCards?.find(deckCard => {
                  const card = typeof deckCard.card === 'object' ? deckCard.card : null
                  return card?.pieceType === 'King'
                })?.card
                const className = typeof deckClass === 'object' ? deckClass.class : 'Unknown'
                
                // Count pieces and tactics
                const pieceCount = deck.deckCards?.reduce((count, deckCard) => {
                  const card = typeof deckCard.card === 'object' ? deckCard.card : null
                  return card?.type === 'Piece' ? count + (deckCard.quantity || 0) : count
                }, 0) || 0
                
                const tacticCount = deck.deckCards?.reduce((count, deckCard) => {
                  const card = typeof deckCard.card === 'object' ? deckCard.card : null
                  return card?.type === 'Tactic' ? count + (deckCard.quantity || 0) : count
                }, 0) || 0

                return (
                  <Link
                    key={deck.id}
                    href={`/decks/${deck.id}`}
                    className={styles.gridItem}
                  >
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemTitle}>{deck.name}</h3>
                      <div className={styles.itemMeta}>
                        <span className={styles.deckClass}>
                          {className}
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemContent}>
                      <div className={styles.deckStatsGrid}>
                        <div className={styles.statGroup}>
                          <span className={styles.statValue}>{uniqueCards}</span>
                          <span className={styles.statLabel}>Unique</span>
                        </div>
                        <div className={styles.statGroup}>
                          <span className={styles.statValue}>{pieceCount}</span>
                          <span className={styles.statLabel}>Pieces</span>
                        </div>
                        <div className={styles.statGroup}>
                          <span className={styles.statValue}>{tacticCount}</span>
                          <span className={styles.statLabel}>Tactics</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.itemFooter}>
                      <span className={styles.createdDate}>
                        {new Date(deck.createdAt).toLocaleDateString()}
                      </span>
                      <span className={styles.viewButton}>View Deck →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
