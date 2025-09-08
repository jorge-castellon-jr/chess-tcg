'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TournamentResult {
  rank: number;
  playerName: string;
  deck: {
    id: string;
    name: string;
  };
}

interface Tournament {
  id: string;
  name: string;
  date: string;
  results?: TournamentResult[];
  status?: 'upcoming' | 'active' | 'completed';
  participants?: number;
  description?: string;
  prize?: string;
}

interface TournamentListProps {
  tournaments?: Tournament[];
  onTournamentSelect?: (tournament: Tournament) => void;
  selectedTournament?: string;
  layout?: 'grid' | 'list';
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments = [],
  onTournamentSelect,
  selectedTournament,
  layout = 'grid'
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(tournaments);

  // Get state from URL params
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = (searchParams.get('sort') as 'name' | 'date' | 'participants') || 'date';

  // Function to update URL params
  const updateUrlParams = (updates: { search?: string; status?: string; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all' && value !== 'date') {
        params.set(key, value);
      } else if (key === 'sort' && value === 'date') {
        params.delete(key); // Remove default sort
      } else if (key === 'status' && value === 'all') {
        params.delete(key); // Remove default filter
      } else if (key === 'search' && !value) {
        params.delete(key);
      } else if (value) {
        params.set(key, value);
      }
    });
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Determine tournament status
  const getTournamentStatus = (tournament: Tournament): 'upcoming' | 'active' | 'completed' => {
    if (tournament.status) return tournament.status;
    
    const tournamentDate = new Date(tournament.date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tDate = new Date(tournamentDate.getFullYear(), tournamentDate.getMonth(), tournamentDate.getDate());
    
    if (tDate > today) return 'upcoming';
    if (tDate.getTime() === today.getTime()) return 'active';
    return 'completed';
  };

  useEffect(() => {
    let filtered = tournaments.filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tournament.description && tournament.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || getTournamentStatus(tournament) === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort tournaments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'participants':
          return (b.participants || b.results?.length || 0) - (a.participants || a.results?.length || 0);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setFilteredTournaments(filtered);
  }, [tournaments, searchTerm, statusFilter, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'var(--status-upcoming, #6366f1)';
      case 'active':
        return 'var(--status-active, #10b981)';
      case 'completed':
        return 'var(--status-completed, #6b7280)';
      default:
        return 'var(--border-color)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '⏳';
      case 'active':
        return '🔥';
      case 'completed':
        return '🏆';
      default:
        return '📅';
    }
  };

  return (
    <div className="tournament-list">
      <div className="tournament-list-controls">
        <input
          type="text"
          placeholder="Search tournaments..."
          value={searchTerm}
          onChange={(e) => updateUrlParams({ search: e.target.value })}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => updateUrlParams({ status: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => updateUrlParams({ sort: e.target.value })}
          className="sort-select"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="participants">Sort by Participants</option>
        </select>
      </div>

      <div className={`tournaments-container ${layout}`}>
        {filteredTournaments.length === 0 ? (
          <div className="no-tournaments">
            <div className="no-tournaments-icon">🏆</div>
            <h3>No tournaments found</h3>
            <p>No tournaments match your search criteria.</p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => updateUrlParams({ search: '', status: 'all' })}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredTournaments.map((tournament) => {
            const status = getTournamentStatus(tournament);
            const participantCount = tournament.participants || tournament.results?.length || 0;
            
            return (
              <div
                key={tournament.id}
                className={`tournament-item ${selectedTournament === tournament.id ? 'selected' : ''}`}
                onClick={() => onTournamentSelect?.(tournament)}
              >
                <div className="tournament-header">
                  <div className="tournament-info">
                    <h3 className="tournament-name">{tournament.name}</h3>
                    <div className="tournament-date">{formatDate(tournament.date)}</div>
                  </div>
                  <div 
                    className="tournament-status" 
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    <span className="status-icon">{getStatusIcon(status)}</span>
                    <span className="status-text">{status}</span>
                  </div>
                </div>

                {tournament.description && (
                  <p className="tournament-description">{tournament.description}</p>
                )}

                <div className="tournament-stats">
                  <div className="stat">
                    <span className="stat-icon">👥</span>
                    <span className="stat-text">{participantCount} participants</span>
                  </div>
                  {tournament.prize && (
                    <div className="stat">
                      <span className="stat-icon">💰</span>
                      <span className="stat-text">{tournament.prize}</span>
                    </div>
                  )}
                </div>

                {status === 'completed' && tournament.results && tournament.results.length > 0 && (
                  <div className="tournament-results">
                    <h4>Top 3 Results:</h4>
                    <div className="results-list">
                      {tournament.results.slice(0, 3).map((result) => (
                        <div key={`${tournament.id}-${result.rank}`} className="result-item">
                          <div className="result-rank">
                            <span className="rank-number">{result.rank}</span>
                            {result.rank === 1 && <span className="rank-icon">🥇</span>}
                            {result.rank === 2 && <span className="rank-icon">🥈</span>}
                            {result.rank === 3 && <span className="rank-icon">🥉</span>}
                          </div>
                          <div className="result-info">
                            <div className="player-name">{result.playerName}</div>
                            <div className="deck-name">{result.deck.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .tournament-list {
          width: 100%;
        }

        .tournament-list-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-input,
        .filter-select,
        .sort-select {
          padding: 10px 14px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
        }

        .search-input:focus,
        .filter-select:focus,
        .sort-select:focus {
          outline: none;
          border-color: var(--link-color);
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .tournaments-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .tournaments-container.list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tournament-item {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 12px var(--shadow);
        }

        .tournament-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px var(--shadow);
          border-color: var(--link-color);
        }

        .tournament-item.selected {
          border-color: var(--link-color);
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
        }

        .tournament-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .tournament-info {
          flex: 1;
        }

        .tournament-name {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .tournament-date {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .tournament-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          white-space: nowrap;
        }

        .status-icon {
          font-size: 12px;
        }

        .tournament-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tournament-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .stat-icon {
          font-size: 14px;
        }

        .tournament-results {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          margin-top: 16px;
        }

        .tournament-results h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-secondary);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .result-rank {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 40px;
        }

        .rank-number {
          font-weight: bold;
          color: var(--text-primary);
        }

        .rank-icon {
          font-size: 16px;
        }

        .result-info {
          flex: 1;
        }

        .player-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        .deck-name {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .no-tournaments {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 24px;
          color: var(--text-secondary);
        }

        .no-tournaments-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-tournaments h3 {
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .no-tournaments p {
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .clear-filters-btn {
          background: var(--link-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: opacity 0.2s ease;
        }

        .clear-filters-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .tournament-list-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            min-width: unset;
          }

          .tournaments-container.grid {
            grid-template-columns: 1fr;
          }

          .tournament-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .tournament-status {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default TournamentList;
