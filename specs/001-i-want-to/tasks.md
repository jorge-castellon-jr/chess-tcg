# Tasks: Payload CMS TCG Website

**Input**: Design documents from `/specs/001-i-want-to/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup

- [x] T001: Initialize Payload CMS project in the root directory.
- [x] T002: [P] Install dependencies using pnpm install.
- [x] T003: [P] Configure linting and formatting.

## Phase 3.2: Payload CMS Collections

- [x] T004: [P] Create `Card` collection in `src/collections/Cards.ts`.
- [x] T005: [P] Create `Set` collection in `src/collections/Sets.ts`.
- [x] T006: [P] Create `Tournament` collection in `src/collections/Tournaments.ts`.
- [x] T007: [P] Create `Deck` collection in `src/collections/Decks.ts`.
- [x] T008: [P] Create `User` collection in `src/collections/Users.ts`.

## Phase 3.3: Payload CMS Globals

- [x] T009: Create `Rules` global in `src/globals/Rules.ts`.

## Phase 3.4: Frontend Components

- [x] T010: [P] Create `CardList` component in `src/admin/components/CardList.tsx`.
- [x] T011: [P] Create `SetList` component in `src/admin/components/SetList.tsx`.
- [x] T012: [P] Create `TournamentList` component in `src/admin/components/TournamentList.tsx`.
- [x] T013: [P] Create `DeckBuilder` component in `src/admin/components/DeckBuilder.tsx`.
- [x] T014: Implement light and dark mode theme.

## Phase 3.5: Frontend Pages

- [x] T015: [P] Create `RulesPage` in `src/admin/pages/Rules.tsx`.
- [x] T016: [P] Create `HomePage` in `src/admin/pages/Home.tsx`.

## Phase 3.6: Integration

- [ ] T017: Integrate Discord OAuth for user authentication.
- [ ] T018: Integrate LogRocket for frontend logging and session replay.
- [x] T019: Configure Turso as the database adapter.

## Phase 3.7: Testing

- [ ] T020: [P] Write contract test for `POST /decks`.
- [ ] T021: [P] Write contract test for `GET /decks/{id}`.
- [ ] T022: [P] Write integration test for user creating a deck.
- [ ] T023: [P] Write integration test for user sharing a deck.

## Phase 3.8: Polish

- [ ] T024: [P] Write unit tests for `DeckBuilder` component.
- [ ] T025: [P] Update `README.md` with setup and usage instructions.

## Dependencies

- T001 blocks all other tasks.
- T002, T003 can run after T001.
- T004-T008 can run in parallel after T002, T003.
- T009 can run after T002, T003.
- T010-T014 can run in parallel after T002, T003.
- T015, T016 can run in parallel after T010-T014.
- T017, T018, T019 can run after T016.
- T020-T023 can run in parallel after T004-T009.
- T024, T025 can run at the end.

## Parallel Example

```
# Launch T004-T008 together:
Task: "[P] Create Card collection in src/collections/Cards.ts"
Task: "[P] Create Set collection in src/collections/Sets.ts"
Task: "[P] Create Tournament collection in src/collections/Tournaments.ts"
Task: "[P] Create Deck collection in src/collections/Decks.ts"
Task: "[P] Create User collection in src/collections/Users.ts"

# Launch T010-T013 together:
Task: "[P] Create CardList component in src/admin/components/CardList.tsx"
Task: "[P] Create SetList component in src/admin/components/SetList.tsx"
Task: "[P] Create TournamentList component in src/admin/components/TournamentList.tsx"
Task: "[P] Create DeckBuilder component in src/admin/components/DeckBuilder.tsx"
```
