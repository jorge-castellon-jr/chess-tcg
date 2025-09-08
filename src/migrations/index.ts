import * as migration_20250908_202917 from './20250908_202917';

export const migrations = [
  {
    up: migration_20250908_202917.up,
    down: migration_20250908_202917.down,
    name: '20250908_202917'
  },
];
