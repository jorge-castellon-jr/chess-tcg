'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './CardList.module.scss';

interface Card {
  id: string;
  name: string;
  cardType: 'Piece' | 'Tactic' | 'King';
  cost: number;
  materialValue?: number;
  attack?: number;
  health?: number;
  effects: string;
  tacticType?: 'Equip' | 'Static' | 'Action';
  set: {
    id: string;
    name: string;
  };
  image?: string;
}

interface CardListProps {
  cards?: Card[];
  onCardSelect?: (card: Card) => void;
  selectedCards?: string[];
  showFilters?: boolean;
}

const CardList: React.FC<CardListProps> = ({ 
  cards = [], 
  onCardSelect,
  selectedCards = [],
  showFilters = true 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredCards, setFilteredCards] = useState<Card[]>(cards);
  
  // Get state from URL params
  const searchTerm = searchParams.get('search') || '';
  const filterType = searchParams.get('type') || 'all';
  const sortBy = (searchParams.get('sort') as 'name' | 'cost' | 'type') || 'name';

  // Function to update URL params
  const updateUrlParams = (updates: { search?: string; type?: string; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let filtered = cards.filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== 'all') {
      filtered = filtered.filter(card => card.cardType === filterType);
    }

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.cost - b.cost;
        case 'type':
          return a.cardType.localeCompare(b.cardType);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCards(filtered);
  }, [cards, searchTerm, filterType, sortBy]);

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'Piece':
        return 'var(--card-piece, #4ade80)';
      case 'Tactic':
        return 'var(--card-tactic, #60a5fa)';
      case 'King':
        return 'var(--card-king, #f59e0b)';
      default:
        return 'var(--border-color)';
    }
  };

  return (
    <div className={styles.cardList}>
      {showFilters && (
        <div className={styles.cardListFilters}>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => updateUrlParams({ search: e.target.value })}
            className={styles.searchInput}
          />
          
          <select
            value={filterType}
            onChange={(e) => updateUrlParams({ type: e.target.value })}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="Piece">Pieces</option>
            <option value="Tactic">Tactics</option>
            <option value="King">Kings</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => updateUrlParams({ sort: e.target.value })}
            className={styles.sortSelect}
          >
            <option value="name">Sort by Name</option>
            <option value="cost">Sort by Cost</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      )}

      <div className={styles.cardsGrid}>
        {filteredCards.length === 0 ? (
          <div className={styles.noCards}>
            <p>No cards found matching your criteria.</p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <div
              key={card.id}
              className={`${styles.cardItem} ${selectedCards.includes(card.id) ? styles.selected : ''}`}
              onClick={() => onCardSelect?.(card)}
              style={{
                borderColor: getCardTypeColor(card.cardType),
              }}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardName}>{card.name}</h3>
                <div className={styles.cardCost}>{card.cost}</div>
              </div>

              <div className={styles.cardTypeBadge} style={{ backgroundColor: getCardTypeColor(card.cardType) }}>
                {card.cardType}
                {card.tacticType && ` • ${card.tacticType}`}
              </div>

              <div className={styles.cardStats}>
                {card.attack !== undefined && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>ATK</span>
                    <span className={styles.statValue}>{card.attack}</span>
                  </div>
                )}
                {card.health !== undefined && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>HP</span>
                    <span className={styles.statValue}>{card.health}</span>
                  </div>
                )}
                {card.materialValue !== undefined && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>MAT</span>
                    <span className={styles.statValue}>{card.materialValue}</span>
                  </div>
                )}
              </div>

              <div className={styles.cardEffects} dangerouslySetInnerHTML={{ __html: card.effects }} />

              <div className={styles.cardFooter}>
                <span className={styles.cardSet}>{card.set.name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CardList;
