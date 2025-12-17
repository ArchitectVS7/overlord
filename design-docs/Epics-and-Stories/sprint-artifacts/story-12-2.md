# Story 12-2: Background Music During Gameplay

**Epic:** 12 - Audio & Atmospheric Immersion
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [GREENFIELD] - Music playback
**Human Intervention:** YES - Music audio files required

## Story Description

As a player, I want to hear background music during gameplay, so that the game has an atmospheric and immersive feel.

## Acceptance Criteria

- [ ] AC1: Background music plays during gameplay
- [ ] AC2: Different tracks for different contexts (menu, battle, exploration)
- [ ] AC3: Music loops seamlessly
- [ ] AC4: Smooth crossfade between tracks
- [ ] AC5: Music volume independent of SFX

## Task Breakdown

### Task 1: Create MusicManager
**File:** `src/core/MusicManager.ts`
**Duration:** ~20 min
- Play/pause/stop music
- Crossfade between tracks
- Loop management
- Volume control

### Task 2: Define Music Tracks
**File:** `public/assets/audio/music/manifest.json`
**Duration:** ~10 min (HUMAN INPUT)
- List all music tracks
- Context assignments (menu, game, combat)
- Volume levels

### Task 3: Context-Based Music Selection
**File:** `src/scenes/*.ts`
**Duration:** ~15 min
- Play menu music in MainMenuScene
- Play gameplay music in GalaxyMapScene
- Play combat music during battles

### Task 4: Crossfade Implementation
**File:** `src/core/MusicManager.ts`
**Duration:** ~15 min
- Smooth fade out current track
- Fade in new track
- Configurable fade duration

### Task 5: Acquire Music Assets (HUMAN)
**File:** `public/assets/audio/music/*.mp3`
**Duration:** Variable
- Source or commission music
- Loop-friendly edits
- License verification

## Definition of Done

- [ ] Music plays in all scenes
- [ ] Crossfade works smoothly
- [ ] Volume control independent
- [ ] 8+ tests passing

---

## Human Intervention Required

- **Music tracks** - Source or commission background music
- **Loop editing** - Ensure seamless looping
- **License verification** - Ensure music can be used
