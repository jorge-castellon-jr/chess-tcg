import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import TournamentList from '../../../components/TournamentList'
import ThemeToggle from '../../../components/ThemeToggle'
import styles from '../../../styles/PageLayout.module.scss'
import { Tournament } from '@/payload-types'

export const metadata = {
  title: 'Tournaments - Chess TCG',
  description:
    'View tournament results and upcoming competitive events for Chess Trading Card Game.',
}

export default async function TournamentsPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch all tournaments
  let tournaments: Tournament[] = []
  try {
    const result = await payload.find({
      collection: 'tournaments',
      limit: 1000,
      sort: '-date', // Sort by newest first
      depth: 2, // Include deck relationships
    })
    tournaments = result.docs
  } catch (error) {
    console.error('Error fetching tournaments:', error)
  }

  return (
    <div className={styles.page}>
      <ThemeToggle />

      <header className={styles.pageHeader}>
        <nav className={styles.pageNav}>
          <Link href="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>Tournaments</h1>
        </nav>
      </header>

      <main className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <div className={styles.pageIntro}>
            <p>
              Stay up to date with competitive Chess TCG events. View past
              results, check upcoming tournaments, and discover winning deck
              strategies.
            </p>
          </div>

          <TournamentList tournaments={tournaments} layout="grid" />
        </div>
      </main>
    </div>
  )
}
