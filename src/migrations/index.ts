import * as migration_20250909_221416 from './20250909_221416';

export const migrations = [
  {
    up: migration_20250909_221416.up,
    down: migration_20250909_221416.down,
    name: '20250909_221416'
  },
];
