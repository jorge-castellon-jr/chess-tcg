import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import ThemeToggle from '../../../components/ThemeToggle'
import styles from './RulesPage.module.scss'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Game Rules - Chess TCG',
  description: 'Learn the rules and mechanics of Chess Trading Card Game.',
}

export default async function RulesPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch rules from the global
  let rules = null
  try {
    rules = await payload.findGlobal({
      slug: 'rules',
    })
  } catch (error) {
    console.error('Error fetching rules:', error)
  }

  return (
    <div className={styles.rulesPage}>
      <ThemeToggle />

      <header className={styles.rulesHeader}>
        <nav className={styles.rulesNav}>
          <Link href="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>Game Rules</h1>
        </nav>
      </header>

      <main className={styles.rulesContent}>
        <div className={styles.rulesContainer}>
          {rules && rules.content ? (
            <div
              className={styles.rulesText}
              dangerouslySetInnerHTML={{ __html: rules.content }}
            />
          ) : (
            <div className={styles.noRules}>
              <div className={styles.noRulesIcon}>📖</div>
              <h2>Rules Coming Soon</h2>
              <p>
                The game rules are being finalized. Check back soon for the
                complete Chess Trading Card Game rulebook.
              </p>
              <div className={styles.placeholderRules}>
                <h3>Quick Overview</h3>
                <ul>
                  <li>Build your deck with Piece, Tactic, and King cards</li>
                  <li>Each card has a mana cost and unique abilities</li>
                  <li>Deploy pieces strategically on the board</li>
                  <li>
                    Use tactics to enhance your pieces or disrupt opponents
                  </li>
                  <li>Protect your King while capturing your opponent's</li>
                </ul>
              </div>
            </div>
          )}

          <div className={styles.rulesSidebar}>
            <div className={styles.sidebarSection}>
              <h3>Quick Reference</h3>
              <div className={styles.referenceGrid}>
                <div className={styles.referenceItem}>
                  <div className={`${styles.refIcon} ${styles.piece}`}>♟</div>
                  <div className={styles.refContent}>
                    <div className={styles.refTitle}>Piece Cards</div>
                    <div className={styles.refDesc}>
                      Units with attack, health, and material value
                    </div>
                  </div>
                </div>
                <div className={styles.referenceItem}>
                  <div className={`${styles.refIcon} ${styles.tactic}`}>⚡</div>
                  <div className={styles.refContent}>
                    <div className={styles.refTitle}>Tactic Cards</div>
                    <div className={styles.refDesc}>
                      Spells and equipment to enhance gameplay
                    </div>
                  </div>
                </div>
                <div className={styles.referenceItem}>
                  <div className={`${styles.refIcon} ${styles.king}`}>👑</div>
                  <div className={styles.refContent}>
                    <div className={styles.refTitle}>King Cards</div>
                    <div className={styles.refDesc}>
                      Your most important piece to protect
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h3>Useful Links</h3>
              <div className={styles.linksList}>
                <Link href="/cards" className={styles.sidebarLink}>
                  View All Cards
                </Link>
                <Link href="/sets" className={styles.sidebarLink}>
                  Browse Card Sets
                </Link>
                <Link href="/tournaments" className={styles.sidebarLink}>
                  Tournament Results
                </Link>
                <Link href="/deck-builder" className={styles.sidebarLink}>
                  Build a Deck
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
