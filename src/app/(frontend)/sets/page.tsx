import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Set } from '@/payload-types'

import config from '@/payload.config'
import SetList from '../../../components/SetList'
import ThemeToggle from '../../../components/ThemeToggle'
import styles from '../../../styles/PageLayout.module.scss'

export const metadata = {
  title: 'Card Sets - Chess TCG',
  description:
    'Browse all card sets and expansions for Chess Trading Card Game.',
}

export default async function SetsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch all sets
  let sets: Set[] = []
  try {
    const result = await payload.find({
      collection: 'sets',
      limit: 1000,
      sort: '-releaseDate', // Sort by newest first
    })
    sets = result.docs
  } catch (error) {
    console.error('Error fetching sets:', error)
  }

  return (
    <div className={styles.page}>
      <ThemeToggle />

      <header className={styles.pageHeader}>
        <nav className={styles.pageNav}>
          <Link href="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>Card Sets</h1>
        </nav>
      </header>

      <main className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <div className={styles.pageIntro}>
            <p>
              Discover all Chess TCG card sets and expansions. Each set
              introduces new mechanics, pieces, and strategies to enhance your
              gameplay experience.
            </p>
          </div>

          <SetList sets={sets} layout="grid" />
        </div>
      </main>
    </div>
  )
}
