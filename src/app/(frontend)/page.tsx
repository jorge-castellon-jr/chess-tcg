import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import ThemeToggle from '../../components/ThemeToggle'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  await payload.auth({ headers })

  // Fetch some sample data to show on homepage
  let recentSets = null
  let upcomingTournaments = null

  try {
    recentSets = await payload.find({
      collection: 'sets',
      limit: 3,
      sort: '-releaseDate',
    })
  } catch (error) {
    console.error('Error fetching sets:', error)
  }

  try {
    upcomingTournaments = await payload.find({
      collection: 'tournaments',
      limit: 3,
      sort: 'date',
    })
  } catch (error) {
    console.error('Error fetching tournaments:', error)
  }

  return (
    <div className="home">
      <ThemeToggle />

      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">♔</div>
          <h1 className="hero-title">Chess Trading Card Game</h1>
          <p className="hero-subtitle">
            Strategic depth meets collectible card gameplay. Build your deck,
            command your pieces, and outmaneuver your opponents in this
            innovative take on chess.
          </p>

          <div className="hero-actions">
            <Link href="/rules" className="cta-button primary">
              Learn to Play
            </Link>
            <Link href="/cards" className="cta-button secondary">
              Browse Cards
            </Link>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-grid">
            <Link href="/cards" className="nav-card">
              <div className="nav-icon">🎴</div>
              <h3>Card Database</h3>
              <p>
                Explore all available cards with detailed stats and abilities
              </p>
            </Link>
            <Link href="/sets" className="nav-card">
              <div className="nav-icon">📦</div>
              <h3>Card Sets</h3>
              <p>Browse releases and discover new expansions</p>
            </Link>
            <Link href="/tournaments" className="nav-card">
              <div className="nav-icon">🏆</div>
              <h3>Tournaments</h3>
              <p>View results and upcoming competitive events</p>
            </Link>
            <Link href="/deck-builder" className="nav-card">
              <div className="nav-icon">⚒️</div>
              <h3>Deck Builder</h3>
              <p>Create and customize your perfect deck</p>
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {recentSets && recentSets.docs && recentSets.docs.length > 0 && (
          <section className="content-section">
            <div className="section-header">
              <h2>Latest Card Sets</h2>
              <Link href="/sets" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="sets-preview">
              {recentSets.docs.map((set: any) => (
                <div key={set.id} className="set-preview-card">
                  <div className="set-date">
                    {new Date(set.releaseDate || '').toLocaleDateString()}
                  </div>
                  <h3 className="set-name">{set.name || 'Unnamed Set'}</h3>
                  <p className="set-description">
                    Explore the latest cards and mechanics
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {upcomingTournaments &&
          upcomingTournaments.docs &&
          upcomingTournaments.docs.length > 0 && (
            <section className="content-section">
              <div className="section-header">
                <h2>Upcoming Tournaments</h2>
                <Link href="/tournaments" className="view-all-link">
                  View All →
                </Link>
              </div>
              <div className="tournaments-preview">
                {upcomingTournaments.docs.map((tournament: any) => (
                  <div key={tournament.id} className="tournament-preview-card">
                    <div className="tournament-date">
                      {new Date(tournament.date || '').toLocaleDateString()}
                    </div>
                    <h3 className="tournament-name">{tournament.name || 'Unnamed Tournament'}</h3>
                    <p className="tournament-description">
                      Join the competition and prove your skills
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        <section className="content-section">
          <div className="section-header">
            <h2>Getting Started</h2>
          </div>
          <div className="getting-started">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Learn the Rules</h3>
                <p>
                  Start with our comprehensive rulebook to understand the game
                  mechanics
                </p>
                <Link href="/rules" className="step-link">
                  Read Rules →
                </Link>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Explore Cards</h3>
                <p>
                  Browse the card database to familiarize yourself with
                  available pieces and tactics
                </p>
                <Link href="/cards" className="step-link">
                  Browse Cards →
                </Link>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Build Your Deck</h3>
                <p>
                  Use our deck builder to create your first competitive deck
                </p>
                <Link href="/deck-builder" className="step-link">
                  Build Deck →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Game</h4>
            <Link href="/rules">Rules</Link>
            <Link href="/cards">Cards</Link>
            <Link href="/sets">Sets</Link>
          </div>
          <div className="footer-section">
            <h4>Community</h4>
            <Link href="/tournaments">Tournaments</Link>
            <Link href="/deck-builder">Deck Builder</Link>
          </div>
          {/* <div className="footer-section"> */}
          {/*   <h4>Admin</h4> */}
          {/*   <a href={payloadConfig.routes.admin} target="_blank" rel="noopener noreferrer"> */}
          {/*     Admin Panel */}
          {/*   </a> */}
          {/*   {user && <span className="user-info">Logged in as {user.email}</span>} */}
          {/* </div> */}
        </div>
      </footer>
    </div>
  )
}
