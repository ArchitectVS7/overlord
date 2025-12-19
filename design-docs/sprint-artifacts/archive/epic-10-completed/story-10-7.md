# Story 10-7: User Statistics Tracking

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** done
**Complexity:** Low
**Implementation Tag:** [GREENFIELD] - Stats aggregation

## Story Description

As a player, I want to view my gameplay statistics (games played, wins, play time), so that I can track my progress.

## Acceptance Criteria

- [x] AC1: Statistics panel accessible from main menu
- [x] AC2: Shows games played, won, lost
- [x] AC3: Total play time tracked
- [x] AC4: Flash Conflict completion stats
- [x] AC5: Statistics sync across devices

## Task Breakdown

### Task 1: Create UserStatsService
**File:** `src/core/services/UserStatsService.ts`
**Duration:** ~15 min
- Track game starts, wins, losses
- Track play time
- Sync to Supabase user_stats table

### Task 2: Create StatsPanel UI
**File:** `src/scenes/ui/StatsPanel.ts`
**Duration:** ~15 min
- Display all statistics
- Visual charts/graphs (optional)
- Refresh on open

### Task 3: Integrate Statistics Tracking
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~15 min
- Track game start
- Track victory/defeat
- Update play time periodically

### Task 4: Flash Conflict Stats
**File:** `src/core/services/UserStatsService.ts`
**Duration:** ~10 min
- Scenarios completed
- Best times
- Star ratings achieved

## Definition of Done

- [x] All statistics tracked
- [x] Stats panel displays correctly
- [x] Sync works across devices
- [x] 26 tests passing (UserStatisticsService.test.ts)
