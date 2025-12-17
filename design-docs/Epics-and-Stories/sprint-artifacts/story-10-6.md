# Story 10-6: User Settings Persistence

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** drafted
**Complexity:** Low
**Implementation Tag:** [GREENFIELD] - Settings system

## Story Description

As a player, I want my settings (audio, UI scale, accessibility) to persist and sync across devices.

## Acceptance Criteria

- [ ] AC1: Settings saved to user profile
- [ ] AC2: Settings sync across devices
- [ ] AC3: Local fallback for guests
- [ ] AC4: Settings load on app start
- [ ] AC5: Default settings on first login

## Task Breakdown

### Task 1: Create UserSettingsService
**File:** `src/core/services/UserSettingsService.ts`
**Duration:** ~15 min
- Get/set settings by key
- Sync to Supabase user_settings table
- Local storage fallback

### Task 2: Settings Data Model
**File:** `src/core/models/UserSettings.ts`
**Duration:** ~10 min
- Audio volume settings
- UI scale preference
- Accessibility options
- Keyboard shortcuts

### Task 3: Settings Panel Integration
**File:** `src/scenes/ui/SettingsPanel.ts`
**Duration:** ~15 min
- Load settings on open
- Save on change
- Reset to defaults option

### Task 4: Load Settings on Start
**File:** `src/scenes/BootScene.ts`
**Duration:** ~10 min
- Fetch user settings
- Apply to game systems
- Handle missing settings

## Definition of Done

- [ ] Settings persist across sessions
- [ ] Sync works for logged-in users
- [ ] Local storage for guests
- [ ] 10+ tests passing
