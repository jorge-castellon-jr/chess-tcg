import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import CardListWrapper from '../../../components/CardListWrapper'
import ThemeToggle from '../../../components/ThemeToggle'
import styles from '../../../styles/PageLayout.module.scss'
import { Card } from '@/payload-types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Card Database - Chess TCG',
  description:
    'Browse all cards in the Chess Trading Card Game with detailed stats and abilities.',
}

// Revalidate this page every 30 seconds to ensure fresh card data
export const revalidate = 30

export default async function CardsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch all cards
  let cards: Card[] = []
  try {
    const result = await payload.find({
      collection: 'cards',
      limit: 1000, // Adjust as needed
      depth: 1, // Include image data
    })
    cards = result.docs.filter((card) => {
      if (typeof card.set === 'number') return true
      if (card.set.preview) return true
      console.log('card', card)
      return new Date(card.set.releaseDate) <= new Date()
    })
  } catch (error) {
    console.error('Error fetching cards:', error)
  }

  return (
    <div className={styles.page}>
      <ThemeToggle />

      <header className={styles.pageHeader}>
        <nav className={styles.pageNav}>
          <Link href="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>Card Database</h1>
        </nav>
      </header>

      <main className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <div className={styles.pageIntro}>
            <p>
              Explore the complete collection of Chess TCG cards. Use the search
              and filters to find specific cards by type, cost, or abilities.
            </p>
          </div>

          <CardListWrapper cards={cards} showFilters={true} />

          {cards.length === 0 && (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>🎴</div>
              <h2>No Cards Available</h2>
              <p>
                Cards will appear here once they are added to the database.
                Check back soon or visit the admin panel to add cards.
              </p>
              <Link href="/admin" className={styles.adminLink}>
                Go to Admin Panel
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
