import * as migration_20250909_044930 from './20250909_044930';

export const migrations = [
  {
    up: migration_20250909_044930.up,
    down: migration_20250909_044930.down,
    name: '20250909_044930'
  },
];
