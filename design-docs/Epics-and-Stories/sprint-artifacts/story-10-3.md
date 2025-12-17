# Story 10-3: Save Campaign Progress

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-DONE] - SaveSystem works, needs UI + cloud

## Story Description

As a player, I want to save my campaign progress at any time, so that I can resume later.

## Acceptance Criteria

- [ ] AC1: Save button visible during gameplay
- [ ] AC2: Save creates record in Supabase
- [ ] AC3: Manual save slot selection
- [ ] AC4: Auto-save on turn end (optional)
- [ ] AC5: Save confirmation notification
- [ ] AC6: Offline saves queued for sync

## Task Breakdown

### Task 1: Create CloudSaveService
**File:** `src/core/services/CloudSaveService.ts`
**Duration:** ~20 min
- Save to Supabase campaign_saves table
- List saves for user
- Delete saves
- Offline queue support

### Task 2: Create SavePanel UI
**File:** `src/scenes/ui/SavePanel.ts`
**Duration:** ~15 min
- Save slot selection
- Save name input
- Overwrite confirmation
- Save button

### Task 3: Integrate SaveSystem with Cloud
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~15 min
- Add save button to HUD
- Call SaveSystem.createSaveData()
- Upload via CloudSaveService

### Task 4: Auto-Save Configuration
**File:** `src/core/services/CloudSaveService.ts`
**Duration:** ~10 min
- Auto-save on turn end
- Auto-save toggle in settings
- Timestamp tracking

## Definition of Done

- [ ] Manual save works
- [ ] Cloud persistence functional
- [ ] Auto-save configurable
- [ ] 15+ tests passing
