# Story 10-4: Load Previously Saved Campaigns

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-DONE] - LoadSystem works, needs UI + cloud

## Story Description

As a player, I want to load a previously saved campaign, so that I can continue from where I left off.

## Acceptance Criteria

- [ ] AC1: Load option visible on main menu
- [ ] AC2: List of saved campaigns displayed
- [ ] AC3: Save metadata shown (date, turn, pack)
- [ ] AC4: Load restores exact game state
- [ ] AC5: Delete save option available
- [ ] AC6: Confirmation before overwriting current game

## Task Breakdown

### Task 1: Create LoadPanel UI
**File:** `src/scenes/ui/LoadPanel.ts`
**Duration:** ~15 min
- Display save list
- Show save metadata
- Load and delete buttons

### Task 2: Fetch Saves from Cloud
**File:** `src/core/services/CloudSaveService.ts`
**Duration:** ~15 min
- Query Supabase for user saves
- Sort by last modified
- Handle empty list

### Task 3: Load and Restore State
**File:** `src/scenes/MainMenuScene.ts`
**Duration:** ~15 min
- Fetch save data from cloud
- Use SaveSystem.deserialize()
- Start GalaxyMapScene with state

### Task 4: Delete Save Functionality
**File:** `src/scenes/ui/LoadPanel.ts`
**Duration:** ~10 min
- Confirmation dialog
- Delete from Supabase
- Refresh list after delete

## Definition of Done

- [ ] Save list displays correctly
- [ ] Load restores game state
- [ ] Delete works with confirmation
- [ ] 12+ tests passing
