# Story 10-5: Cross-Device Save Synchronization

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** done
**Complexity:** Medium
**Implementation Tag:** [GREENFIELD] - Supabase integration

## Story Description

As a player, I want my saves to sync across all my devices automatically, so that I can continue playing anywhere.

## Acceptance Criteria

- [ ] AC1: Saves sync to cloud automatically
- [ ] AC2: Saves appear on all logged-in devices
- [ ] AC3: Conflict resolution for simultaneous edits
- [ ] AC4: Offline saves sync when reconnected
- [ ] AC5: Sync status indicator visible
- [ ] AC6: Manual refresh option available

## Task Breakdown

### Task 1: Real-time Sync Setup
**File:** `src/core/services/CloudSaveService.ts`
**Duration:** ~20 min
- Supabase realtime subscription
- Sync on save changes
- Update local cache

### Task 2: Conflict Resolution
**File:** `src/core/services/SyncService.ts`
**Duration:** ~15 min
- Timestamp-based resolution
- Keep newer save option
- Merge or replace prompt

### Task 3: Offline Queue Sync
**File:** `src/core/services/OfflineQueueService.ts`
**Duration:** ~15 min
- Detect online status
- Process queued saves
- Retry on failure

### Task 4: Sync Status UI
**File:** `src/scenes/ui/components/SyncStatusIndicator.ts`
**Duration:** ~10 min
- Syncing/synced/offline icons
- Last sync timestamp
- Manual refresh button

## Definition of Done

- [ ] Automatic sync works
- [ ] Conflicts handled gracefully
- [ ] Offline queue processes
- [ ] 10+ tests passing
