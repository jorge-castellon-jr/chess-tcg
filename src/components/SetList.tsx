'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Set {
  id: string;
  name: string;
  releaseDate: string;
  cardCount?: number;
  description?: string;
  image?: string;
}

interface SetListProps {
  sets?: Set[];
  onSetSelect?: (set: Set) => void;
  selectedSet?: string;
  layout?: 'grid' | 'list';
}

const SetList: React.FC<SetListProps> = ({
  sets = [],
  onSetSelect,
  selectedSet,
  layout = 'grid'
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredSets, setFilteredSets] = useState<Set[]>(sets);

  // Get state from URL params
  const searchTerm = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') as 'name' | 'date' | 'cards') || 'name';

  // Function to update URL params
  const updateUrlParams = (updates: { search?: string; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'name') {
        params.set(key, value);
      } else if (key === 'sort' && value === 'name') {
        params.delete(key); // Remove default sort
      } else if (key === 'search' && !value) {
        params.delete(key);
      } else if (value) {
        params.set(key, value);
      }
    });
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let filtered = sets.filter(set =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (set.description && set.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort sets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'cards':
          return (b.cardCount || 0) - (a.cardCount || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredSets(filtered);
  }, [sets, searchTerm, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Upcoming';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="set-list">
      <div className="set-list-controls">
        <input
          type="text"
          placeholder="Search sets..."
          value={searchTerm}
          onChange={(e) => updateUrlParams({ search: e.target.value })}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => updateUrlParams({ sort: e.target.value })}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
          <option value="cards">Sort by Card Count</option>
        </select>
      </div>

      <div className={`sets-container ${layout}`}>
        {filteredSets.length === 0 ? (
          <div className="no-sets">
            <div className="no-sets-icon">📦</div>
            <h3>No sets found</h3>
            <p>No card sets match your search criteria.</p>
            {searchTerm && (
              <button
                onClick={() => updateUrlParams({ search: '' })}
                className="clear-search-btn"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredSets.map((set) => (
            <div
              key={set.id}
              className={`set-item ${selectedSet === set.id ? 'selected' : ''}`}
              onClick={() => onSetSelect?.(set)}
            >
              <div className="set-image-container">
                {set.image ? (
                  <img src={set.image} alt={set.name} className="set-image" />
                ) : (
                  <div className="set-image-placeholder">
                    <span className="set-icon">🎴</span>
                  </div>
                )}
                {set.cardCount && (
                  <div className="card-count-badge">
                    {set.cardCount} cards
                  </div>
                )}
              </div>

              <div className="set-content">
                <h3 className="set-name">{set.name}</h3>
                
                <div className="set-date">
                  <span className="date-full">{formatDate(set.releaseDate)}</span>
                  <span className="date-relative">{getRelativeDate(set.releaseDate)}</span>
                </div>

                {set.description && (
                  <p className="set-description">{set.description}</p>
                )}

                <div className="set-stats">
                  <div className="stat">
                    <span className="stat-icon">📅</span>
                    <span className="stat-text">{getRelativeDate(set.releaseDate)}</span>
                  </div>
                  {set.cardCount && (
                    <div className="stat">
                      <span className="stat-icon">🎯</span>
                      <span className="stat-text">{set.cardCount} cards</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .set-list {
          width: 100%;
        }

        .set-list-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-input,
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
        .sort-select:focus {
          outline: none;
          border-color: var(--link-color);
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .sets-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .sets-container.list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .set-item {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 12px var(--shadow);
          overflow: hidden;
        }

        .set-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px var(--shadow);
          border-color: var(--link-color);
        }

        .set-item.selected {
          border-color: var(--link-color);
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
        }

        .sets-container.list .set-item {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .sets-container.list .set-item:hover {
          transform: translateX(4px);
        }

        .set-image-container {
          position: relative;
          width: 100%;
          height: 160px;
          margin-bottom: 16px;
          border-radius: 8px;
          overflow: hidden;
        }

        .sets-container.list .set-image-container {
          width: 120px;
          height: 80px;
          margin-bottom: 0;
          flex-shrink: 0;
        }

        .set-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .set-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--bg-secondary), var(--border-color));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .set-icon {
          font-size: 32px;
        }

        .sets-container.list .set-icon {
          font-size: 24px;
        }

        .card-count-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .set-content {
          flex: 1;
        }

        .set-name {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .sets-container.list .set-name {
          font-size: 18px;
        }

        .set-date {
          margin-bottom: 12px;
        }

        .date-full {
          display: block;
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .date-relative {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .set-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sets-container.list .set-description {
          -webkit-line-clamp: 2;
        }

        .set-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
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

        .no-sets {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 24px;
          color: var(--text-secondary);
        }

        .no-sets-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-sets h3 {
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .no-sets p {
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .clear-search-btn {
          background: var(--link-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: opacity 0.2s ease;
        }

        .clear-search-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .set-list-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            min-width: unset;
          }

          .sets-container.grid {
            grid-template-columns: 1fr;
          }

          .sets-container.list .set-item {
            flex-direction: column;
            text-align: center;
          }

          .sets-container.list .set-image-container {
            width: 100%;
            height: 120px;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SetList;
