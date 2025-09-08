import * as migration_20250908_202917 from './20250908_202917';
import * as migration_20250908_221119 from './20250908_221119';

export const migrations = [
  {
    up: migration_20250908_202917.up,
    down: migration_20250908_202917.down,
    name: '20250908_202917',
  },
  {
    up: migration_20250908_221119.up,
    down: migration_20250908_221119.down,
    name: '20250908_221119'
  },
];
