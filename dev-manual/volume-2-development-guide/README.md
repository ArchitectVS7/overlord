# Volume II: Development Guide - Completing Overlord

**Purpose:** Step-by-step guide to finish the game from current state to release
**Last Updated:** December 13, 2025
**Framework:** Plan-Act-Validate (PAV) methodology

---

## Executive Summary

### Current Status (Verified December 13, 2025)

| Metric | Value |
|--------|-------|
| **Epics Complete** | 10 of 12 (83%) |
| **Tests Passing** | 1,272 |
| **Code Coverage** | 93%+ |
| **UI Components** | 37+ scenes and panels |
| **Scenarios Created** | 7 (1 tutorial + 6 tactical) |

### What's Actually Done

- **Epic 1:** Player Onboarding & Tutorials - DONE
- **Epic 2:** Campaign Setup & Core Loop - DONE
- **Epic 3:** Galaxy Exploration & Planet Discovery - DONE
- **Epic 4:** Planetary Economy & Infrastructure - DONE
- **Epic 5:** Military Forces & Movement - DONE
- **Epic 6:** Combat & Planetary Invasion - DONE
- **Epic 7:** AI Opponent System - DONE
- **Epic 9:** Scenario Pack System - DONE
- **Epic 11:** Accessible User Interface - DONE
- **Epic 12:** Audio Infrastructure - DONE (awaiting assets)

### What Actually Remains

| Item | Type | Time Estimate | Blocker |
|------|------|--------------|---------|
| Audio SFX files | Human Task | 2-3 hours | Asset creation |
| Background music | Human Task | 2-3 hours | Asset creation |
| Art assets (Midjourney) | Human Task | 4-6 hours | Asset generation |
| Supabase setup | Human Task | 30 min | Account creation |
| Epic 10 implementation | AI Development | 8-10 hours | Supabase config |
| Epic 8 scenario review | Human/AI | 2-3 hours | Playtesting |
| Integration testing | Human/AI | 3-4 hours | All assets |
| UAT execution | Human | 4-6 hours | Testing |

**Total Remaining Work:** 26-38 hours

---

## Table of Contents

### Framework & Overview
- [Chapter 1: Status Assessment](#chapter-1-status-assessment)
- [Chapter 2: Plan-Act-Validate Framework](#chapter-2-plan-act-validate-framework)

### Completion Phases (Plan-Act-Validate)
- [Chapter 3: Phase 1 - Art Asset Integration](#chapter-3-phase-1-art-asset-integration)
- [Chapter 4: Phase 2 - Audio Asset Integration](#chapter-4-phase-2-audio-asset-integration)
- [Chapter 5: Phase 3 - Scenario Verification](#chapter-5-phase-3-scenario-verification)
- [Chapter 6: Phase 4 - Cloud Saves & User Accounts](#chapter-6-phase-4-cloud-saves-user-accounts)
- [Chapter 7: Phase 5 - Final Integration & Polish](#chapter-7-phase-5-final-integration-polish)

### Testing & Release
- [Chapter 8: Comprehensive UAT Scripts](#chapter-8-comprehensive-uat-scripts)
- [Chapter 9: Release Checklist](#chapter-9-release-checklist)

### Reference Materials
- [03: Scenario Authoring](03-scenario-authoring.md)
- [Additional Resources](#additional-resources)

---

## Chapter 1: Status Assessment

### Verified Implementation Status

#### Completed Epics (with evidence)

**Epic 11: Accessible User Interface**
- InputSystem.ts, CameraController.ts
- Keyboard shortcuts (Ctrl+M mute, H help, etc.)
- UI scale customization (100%, 125%, 150%)
- High contrast mode
- 8 stories, all tests passing

**Epic 3: Galaxy Exploration**
- GalaxyMapScene.ts, PlanetRenderer.ts, StarFieldRenderer.ts
- Planet selection and highlighting
- PlanetInfoPanel.ts
- 3 stories complete

**Epic 2: Campaign Setup & Core Loop**
- CampaignConfigScene.ts
- TurnSystem integration via TurnHUD.ts
- VictoryScene.ts, DefeatScene.ts
- 5 stories complete

**Epic 4: Planetary Economy**
- ResourceHUD.ts for display
- BuildingMenuPanel.ts for construction
- Automated income processing
- 4 stories complete

**Epic 5: Military Forces**
- PlatoonCommissionPanel.ts
- PlatoonDetailsPanel.ts
- SpacecraftPurchasePanel.ts
- SpacecraftNavigationPanel.ts
- PlatoonLoadingPanel.ts
- 5 stories complete

**Epic 6: Combat & Planetary Invasion**
- InvasionPanel.ts
- BattleResultsPanel.ts
- Combat aggression configuration
- 3 stories complete

**Epic 7: AI Opponent System**
- AIDecisionSystem (Core)
- NotificationToast.ts for AI actions
- OpponentInfoPanel.ts
- 2 stories complete

**Epic 1: Player Onboarding & Tutorials**
- FlashConflictsScene.ts
- ScenarioListPanel.ts, ScenarioDetailPanel.ts
- TutorialManager.ts, TutorialStepPanel.ts, TutorialHighlight.ts
- ObjectivesPanel.ts
- ScenarioResultsPanel.ts, ScenarioCompletionService.ts
- 6 stories complete
- **tutorial-001.json exists with tutorial steps**

**Epic 9: Scenario Pack System**
- ScenarioPackScene.ts
- PackListPanel.ts, PackDetailPanel.ts
- PackSwitchDialog.ts, PackConfigLoader.ts
- PackMetadataHelper.ts
- 3 stories complete

**Epic 12: Audio (Infrastructure)**
- AudioManager.ts (Core)
- VolumeControlPanel.ts
- AudioActivationOverlay.ts
- Stories 12-3, 12-4 complete
- Story 12-5 in review
- **Only awaiting actual audio files**

#### Scenarios Already Created

```
Overlord.Phaser/src/data/scenarios/
├── tutorial-001.json           # First Steps tutorial
├── tactical-001-conquest.json  # Planetary Conquest
├── tactical-002-defense.json   # Defense scenario
├── tactical-003-resource-race.json
├── tactical-004-fleet-battle.json
├── tactical-005-blitz.json
├── tactical-006-last-stand.json
```

#### What's Missing

1. **Audio Asset Files** (Epic 12)
   - Sound effects (SFX) directory doesn't exist
   - Music tracks needed
   - Audio manifest needed

2. **User Account System** (Epic 10)
   - Supabase project not created
   - 7 stories drafted but blocked

3. **Art Assets**
   - Midjourney prompts document complete
   - Images not yet generated
   - Currently using placeholder graphics

4. **Scenario Pack JSON Files**
   - Pack infrastructure exists
   - No pack JSON files in `src/data/packs/`

---

## Chapter 2: Plan-Act-Validate Framework

### Methodology

Every remaining task follows the **Plan-Act-Validate (PAV)** cycle:

```
┌─────────────────────────────────────────────────────────┐
│                         PLAN                             │
│  - Define deliverables clearly                          │
│  - Identify tools and resources needed                  │
│  - Set acceptance criteria before starting              │
│  - Estimate time and dependencies                       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                          ACT                             │
│  - Execute task step by step                            │
│  - Document decisions and changes                       │
│  - Commit progress incrementally                        │
│  - Note any blockers or deviations                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       VALIDATE                           │
│  - Run automated tests (npm test)                       │
│  - Execute manual UAT script                            │
│  - Verify all acceptance criteria met                   │
│  - Document test results                                │
└─────────────────────────────────────────────────────────┘
```

### Phase Execution Order

```
Phase 1: Art Assets ──────┐
                          │
Phase 2: Audio Assets ────┼──► Phase 5: Integration
                          │
Phase 3: Scenarios ───────┤
                          │
Phase 4: Cloud Saves ─────┘
```

**Parallelization:**
- Phases 1-4 can run in parallel (no dependencies)
- Phase 5 requires all previous phases complete

---

## Chapter 3: Phase 1 - Art Asset Integration

### PLAN: Art Assets

**Goal:** Generate and integrate visual assets for all game entities

**Deliverables:**
- 4 spacecraft images (Battle Cruiser, Cargo Cruiser, Solar Satellite, Atmosphere Processor)
- 4 planet images × 3 ownership variants = 12 planet images
- 5 building structure images
- 4 AI leader portraits
- UI icons for resources (5 icons)
- Background images (galaxy map, battle scenes)

**Resources:**
- `design-docs/midjourney-master-prompts.md` - All prompts ready
- Midjourney subscription (or alternative: DALL-E, Stable Diffusion)

**Acceptance Criteria:**
- [ ] All images in `Overlord.Phaser/public/assets/` directory
- [ ] Images load without errors in browser
- [ ] Asset manifest updated
- [ ] No placeholder images remain in production

**Time Estimate:** 4-6 hours

### ACT: Art Assets

**Step 1: Generate Spacecraft (1 hour)**

1. Open Midjourney (or alternative)
2. Run prompts from `midjourney-master-prompts.md` Section: Spacecraft
3. Generate for each:
   - Battle Cruiser (clean, upgraded, damaged variants)
   - Cargo Cruiser (clean, loaded, damaged variants)
   - Solar Satellite (deployed, active, damaged variants)
   - Atmosphere Processor (clean, deployed, malfunctioning variants)
4. Download at 512×512 px resolution
5. Save to `Overlord.Phaser/public/assets/sprites/craft/`

**Step 2: Generate Planets (1.5 hours)**

1. Run prompts from Section: Planets
2. Generate for each planet type × 3 ownership states:
   - Volcanic (neutral, player-blue, AI-red)
   - Desert (neutral, player-blue, AI-red)
   - Tropical (neutral, player-blue, AI-red)
   - Metropolis (neutral, player-blue, AI-red)
3. Save at 512×512 px to `public/assets/sprites/planets/`

**Step 3: Generate Buildings (45 min)**

1. Run prompts from Section: Buildings
2. Generate: DockingBay, SurfacePlatform, MiningStation, HorticulturalStation, OrbitalDefense
3. Save to `public/assets/sprites/buildings/`

**Step 4: Generate AI Leader Portraits (30 min)**

1. Run prompts from Section: AI Leaders
2. Generate: Commander Kratos, Overseer Aegis, Magistrate Midas, General Nexus
3. Save at 1024×1536 px to `public/assets/portraits/`

**Step 5: Generate UI Icons (30 min)**

1. Run prompts from Section: UI Elements
2. Generate: Credits, Minerals, Fuel, Food, Energy icons
3. Save at 128×128 px to `public/assets/ui/icons/`

**Step 6: Generate Backgrounds (30 min)**

1. Run prompts from Section: Backgrounds
2. Generate: Galaxy starfield, Nebula backdrop, Deep space, Asteroid field
3. Save at 1920×1080 px to `public/assets/backgrounds/`

**Step 7: Update Asset Loading (30 min)**

1. Create asset manifest: `public/assets/asset-manifest.json`
2. Update `BootScene.ts` to preload new assets
3. Update renderers to use real sprites instead of primitives

### VALIDATE: Art Assets

**Automated Tests:**
```bash
cd Overlord.Phaser
npm test
npm run build
```

**Manual UAT Script - Art Assets:**

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Run `npm start` | Dev server starts, no asset loading errors | |
| 2 | View Galaxy Map | Planets display with correct type images | |
| 3 | Select planet | PlanetInfoPanel shows planet image | |
| 4 | View AI opponent | Leader portrait displays correctly | |
| 5 | Open build menu | Building icons display correctly | |
| 6 | Commission platoon | Spacecraft images visible | |
| 7 | Check resource HUD | Resource icons visible at 128×128 | |
| 8 | Check backgrounds | Starfield and nebula visible | |
| 9 | Test all 3 ownerships | Neutral/Player/AI colors correct | |
| 10 | Test in Firefox | Images load in non-Chrome browser | |

**Completion Checklist:**
- [ ] 12 planet images working
- [ ] 12 spacecraft images working
- [ ] 5 building images working
- [ ] 4 leader portraits working
- [ ] 5 resource icons working
- [ ] 4 background images working
- [ ] No console errors on load
- [ ] All tests still passing (1272+)

---

## Chapter 4: Phase 2 - Audio Asset Integration

### PLAN: Audio Assets

**Goal:** Add sound effects and background music to the game

**Deliverables:**
- 8+ sound effect files (MP3/OGG)
- 3+ background music tracks (loopable MP3/OGG)
- Audio manifest JSON file

**Resources:**
- Free SFX: Freesound.org, OpenGameArt.org, BFXR (retro generator)
- Free Music: Incompetech.com (Kevin MacLeod), FreePD.com, BenSound.com
- Tools: Audacity (editing), ChipTone (retro SFX)

**Acceptance Criteria:**
- [ ] Audio files in `Overlord.Phaser/public/assets/audio/`
- [ ] AudioManager loads all sounds without errors
- [ ] Volume controls work (Master, SFX, Music)
- [ ] Mute toggle works (Ctrl+M)
- [ ] Audio activation overlay appears on first interaction

**Time Estimate:** 4-6 hours

### ACT: Audio Assets

**Step 1: Create Directory Structure (5 min)**

```bash
mkdir -p Overlord.Phaser/public/assets/audio/sfx
mkdir -p Overlord.Phaser/public/assets/audio/music
```

**Step 2: Gather Sound Effects (1-2 hours)**

Download or generate the following SFX:

| Sound | Source Suggestion | Save As |
|-------|-------------------|---------|
| Button click | BFXR "pickup" preset | `sfx/ui-click.mp3` |
| Button hover | BFXR "blip" preset | `sfx/ui-hover.mp3` |
| Platoon commissioned | BFXR "powerup" | `sfx/platoon-ready.mp3` |
| Building constructed | OpenGameArt "construction" | `sfx/building-complete.mp3` |
| Spacecraft launch | BFXR "laser" + reverb | `sfx/craft-launch.mp3` |
| Combat explosion | Freesound "explosion" | `sfx/combat-explosion.mp3` |
| Victory fanfare | Incompetech short jingle | `sfx/victory.mp3` |
| Defeat sound | BFXR "hurt" | `sfx/defeat.mp3` |
| Turn end | BFXR "notification" | `sfx/turn-end.mp3` |
| Error/invalid | BFXR "hurt" short | `sfx/error.mp3` |

**Step 3: Gather Background Music (1-2 hours)**

| Track | Mood | Source Suggestion | Save As |
|-------|------|-------------------|---------|
| Main Menu | Ambient, welcoming | Kevin MacLeod "Space Jazz" | `music/menu-theme.mp3` |
| Galaxy Map | Strategic, contemplative | Kevin MacLeod "Dark Fog" | `music/galaxy-theme.mp3` |
| Combat | Intense, action | Kevin MacLeod "Volatile Reaction" | `music/combat-theme.mp3` |

**Requirements:**
- Format: MP3 (128-192 kbps) or OGG Vorbis
- Max size: 2 MB per file (web performance)
- Music: Must loop seamlessly (edit loop points in Audacity)
- Volume: Normalized to -14 LUFS

**Step 4: Create Audio Manifest (15 min)**

Create `Overlord.Phaser/public/assets/audio/audio-manifest.json`:

```json
{
  "version": "1.0.0",
  "sfx": {
    "uiClick": "audio/sfx/ui-click.mp3",
    "uiHover": "audio/sfx/ui-hover.mp3",
    "platoonReady": "audio/sfx/platoon-ready.mp3",
    "buildingComplete": "audio/sfx/building-complete.mp3",
    "craftLaunch": "audio/sfx/craft-launch.mp3",
    "combatExplosion": "audio/sfx/combat-explosion.mp3",
    "victory": "audio/sfx/victory.mp3",
    "defeat": "audio/sfx/defeat.mp3",
    "turnEnd": "audio/sfx/turn-end.mp3",
    "error": "audio/sfx/error.mp3"
  },
  "music": {
    "menuTheme": "audio/music/menu-theme.mp3",
    "galaxyTheme": "audio/music/galaxy-theme.mp3",
    "combatTheme": "audio/music/combat-theme.mp3"
  },
  "defaultMusic": "galaxyTheme"
}
```

**Step 5: Integrate with AudioManager (30 min)**

Update `src/core/AudioManager.ts` to load from manifest.

**Step 6: Add Sound Triggers to UI (1 hour)**

Add `AudioManager.playSFX()` calls to:
- Button components (click, hover)
- TurnHUD (turn end)
- BuildingMenuPanel (construction complete)
- PlatoonCommissionPanel (platoon ready)
- SpacecraftPurchasePanel (craft purchase)
- BattleResultsPanel (victory/defeat)
- InvasionPanel (combat explosions)

### VALIDATE: Audio Assets

**Automated Tests:**
```bash
cd Overlord.Phaser
npm test
npm run build
```

**Manual UAT Script - Audio:**

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Load game fresh | Audio activation overlay appears | |
| 2 | Click overlay | Audio unlocks, overlay disappears | |
| 3 | Main menu loads | Menu music plays automatically | |
| 4 | Hover over button | Hover SFX plays | |
| 5 | Click button | Click SFX plays | |
| 6 | Start campaign | Galaxy music starts | |
| 7 | End turn | Turn-end SFX plays | |
| 8 | Build structure | Building-complete SFX plays | |
| 9 | Open volume panel | 3 sliders visible (Master, SFX, Music) | |
| 10 | Drag Master to 0 | All audio muted | |
| 11 | Drag Music to 0 | SFX still plays, music silent | |
| 12 | Press Ctrl+M | Mute toggles (icon changes) | |
| 13 | Win scenario | Victory fanfare plays | |
| 14 | Lose scenario | Defeat sound plays | |
| 15 | Refresh page | Volume settings persist | |

**Completion Checklist:**
- [ ] 10+ SFX files present and loading
- [ ] 3+ music tracks present and loading
- [ ] Audio manifest valid JSON
- [ ] Volume controls functional
- [ ] Mute toggle works
- [ ] Audio persists through scene changes
- [ ] No audio clicks/pops on loop
- [ ] All tests still passing (1272+)

---

## Chapter 5: Phase 3 - Scenario Verification

### PLAN: Scenario Verification

**Goal:** Verify all scenarios are playable and balanced

**Current State:**
- 7 scenarios already exist in `src/data/scenarios/`
- Tutorial system functional
- Scenario selection UI complete

**Deliverables:**
- All 7 scenarios playtested and verified
- Balance adjustments documented
- 2-3 scenario pack JSON files created

**Time Estimate:** 2-3 hours

### ACT: Scenario Verification

**Step 1: Playtest Tutorial (30 min)**

1. Start game → Flash Conflicts → Tutorial 001
2. Follow all 4 tutorial steps
3. Verify highlighting works
4. Complete the scenario
5. Verify star rating displays
6. Document any issues

**Step 2: Playtest Each Tactical Scenario (1.5 hours)**

For each of the 6 tactical scenarios:

| Scenario | Time Target | Focus Area | Notes |
|----------|-------------|------------|-------|
| tactical-001-conquest | 10-15 min | Planet capture | Check turn limit |
| tactical-002-defense | 10-15 min | Defensive play | Check AI aggression |
| tactical-003-resource-race | 10-15 min | Economy | Check resource balance |
| tactical-004-fleet-battle | 10-15 min | Space combat | Check fleet mechanics |
| tactical-005-blitz | 5-10 min | Fast play | Check time pressure |
| tactical-006-last-stand | 10-15 min | Survival | Check difficulty curve |

**Playtest Checklist (per scenario):**
- [ ] Scenario loads correctly
- [ ] Initial state matches JSON
- [ ] Victory conditions achievable
- [ ] Defeat conditions trigger correctly
- [ ] Star rating thresholds reasonable
- [ ] AI behaves appropriately
- [ ] No softlocks or crashes

**Step 3: Create Scenario Packs (1 hour)**

Create `Overlord.Phaser/src/data/packs/` directory and add:

**Pack 1: `aggressive-warlord.json`**
```json
{
  "id": "aggressive-warlord",
  "name": "Aggressive Warlord",
  "description": "Face Commander Vex, a ruthless AI who prioritizes military expansion.",
  "difficulty": "hard",
  "aiPersonality": "Aggressive",
  "aiDifficulty": "Hard",
  "galaxyConfig": {
    "planetCount": { "min": 4, "max": 5 },
    "resourceAbundance": "scarce"
  },
  "scenarios": ["tactical-001-conquest", "tactical-004-fleet-battle"],
  "colorTheme": "#DC2626",
  "leaderName": "Commander Vex",
  "leaderDescription": "Victory through overwhelming force."
}
```

**Pack 2: `defensive-turtle.json`**
```json
{
  "id": "defensive-turtle",
  "name": "Defensive Strategist",
  "description": "Challenge Overseer Aegis, a cautious AI focused on fortification.",
  "difficulty": "medium",
  "aiPersonality": "Defensive",
  "aiDifficulty": "Normal",
  "galaxyConfig": {
    "planetCount": { "min": 5, "max": 6 },
    "resourceAbundance": "abundant"
  },
  "scenarios": ["tactical-002-defense", "tactical-006-last-stand"],
  "colorTheme": "#2563EB",
  "leaderName": "Overseer Aegis",
  "leaderDescription": "Patience and preparation win wars."
}
```

**Pack 3: `balanced-conquest.json`**
```json
{
  "id": "balanced-conquest",
  "name": "Balanced Conquest",
  "description": "The standard experience with General Nexus adapting to your strategy.",
  "difficulty": "normal",
  "aiPersonality": "Balanced",
  "aiDifficulty": "Normal",
  "galaxyConfig": {
    "planetCount": { "min": 4, "max": 6 },
    "resourceAbundance": "normal"
  },
  "scenarios": ["tactical-001-conquest", "tactical-003-resource-race", "tactical-005-blitz"],
  "colorTheme": "#6B7280",
  "leaderName": "General Nexus",
  "leaderDescription": "Tactical flexibility is the key to victory."
}
```

### VALIDATE: Scenario Verification

**Automated Tests:**
```bash
npm test -- ScenarioManager
npm test -- VictoryCondition
npm test -- StarRating
```

**Manual UAT Script - Scenarios:**

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Flash Conflicts menu | All 7 scenarios visible | |
| 2 | Select Tutorial 001 | Detail panel shows objectives | |
| 3 | Start Tutorial 001 | Tutorial step 1 displays | |
| 4 | Complete Tutorial 001 | Results show, stars awarded | |
| 5 | Scenario packs menu | 3 packs visible | |
| 6 | Select "Aggressive Warlord" | Pack details display | |
| 7 | Start conquest scenario | Correct AI personality loaded | |
| 8 | Complete scenario (win) | Star rating calculated | |
| 9 | Check completion history | Best time recorded | |
| 10 | Replay scenario | Previous best time shown | |

**Completion Checklist:**
- [ ] All 7 scenarios playable start to finish
- [ ] Tutorial highlights work correctly
- [ ] Victory conditions trigger properly
- [ ] Defeat conditions trigger properly
- [ ] Star ratings display correctly
- [ ] 3 scenario packs created and loadable
- [ ] Completion history tracks across sessions
- [ ] All tests still passing (1272+)

---

## Chapter 6: Phase 4 - Cloud Saves & User Accounts

### PLAN: Cloud Saves

**Goal:** Enable user accounts, cloud saves, and cross-device sync

**Deliverables:**
- Supabase project configured
- User authentication working (email/password)
- Save/load to cloud functional
- Settings persistence
- Statistics tracking

**Time Estimate:**
- Human: 30-45 min (Supabase setup)
- AI Development: 8-10 hours (Epic 10 stories)

### ACT: Cloud Saves

**Step 1: Create Supabase Project (30 min)**

1. Go to https://supabase.com
2. Sign up / Log in
3. Create new project "Overlord"
4. Wait for project provisioning (~2 min)
5. Go to Settings → API
6. Copy Project URL and anon public key

**Step 2: Configure Environment (10 min)**

Create `Overlord.Phaser/src/config/supabase.ts`:

```typescript
export const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'YOUR_ANON_KEY_HERE'
};
```

Create `.env.local` (git-ignored):
```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Step 3: Create Database Schema (15 min)**

In Supabase SQL Editor, run:

```sql
-- User profiles (extends auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Campaign saves
CREATE TABLE campaign_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  save_name TEXT NOT NULL,
  save_data JSONB NOT NULL,
  turn_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scenario completions
CREATE TABLE scenario_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completion_time_seconds INTEGER,
  star_rating INTEGER CHECK (star_rating >= 0 AND star_rating <= 3),
  attempts INTEGER DEFAULT 1,
  best_time_seconds INTEGER,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, scenario_id)
);

-- User settings
CREATE TABLE user_settings (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users CRUD own saves" ON campaign_saves
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users CRUD own completions" ON scenario_completions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users CRUD own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_saves_user ON campaign_saves(user_id);
CREATE INDEX idx_completions_user ON scenario_completions(user_id);
CREATE INDEX idx_completions_scenario ON scenario_completions(scenario_id);
```

**Step 4: Enable Authentication (5 min)**

1. In Supabase Dashboard → Authentication → Providers
2. Enable Email/Password
3. Configure email templates (optional)
4. Set Site URL to your deployment URL

**Step 5: AI Implementation**

After Supabase is configured, AI can implement:
- Story 10-1: User account creation UI
- Story 10-2: Login/logout flow
- Story 10-3: Cloud save functionality
- Story 10-4: Cloud load functionality
- Story 10-5: Cross-device sync
- Story 10-6: Settings persistence
- Story 10-7: Statistics tracking

### VALIDATE: Cloud Saves

**Manual UAT Script - User Accounts & Cloud Saves:**

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Click "Create Account" | Registration form appears | |
| 2 | Enter email/password | Account created, logged in | |
| 3 | Click "Logout" | Returns to login state | |
| 4 | Click "Login" | Login form appears | |
| 5 | Enter credentials | Logged in successfully | |
| 6 | Start campaign, play 3 turns | Game progresses normally | |
| 7 | Click "Save Game" | Save dialog appears | |
| 8 | Enter save name, confirm | Save successful message | |
| 9 | Close browser | - | |
| 10 | Open on different device | Login with same account | |
| 11 | Click "Load Game" | Previous save appears in list | |
| 12 | Load save | Game state restored exactly | |
| 13 | Complete a scenario | Star rating awarded | |
| 14 | Check statistics | Scenarios completed count updated | |
| 15 | Change volume setting | Setting persists after refresh | |
| 16 | Delete account | Confirmation, all data removed | |

**Completion Checklist:**
- [ ] Account creation works
- [ ] Login/logout works
- [ ] Cloud save creates database record
- [ ] Cloud load restores full game state
- [ ] Cross-device sync verified
- [ ] Settings persist to cloud
- [ ] Statistics track correctly
- [ ] RLS prevents accessing other users' data
- [ ] All tests still passing (1272+)

---

## Chapter 7: Phase 5 - Final Integration & Polish

### PLAN: Final Integration

**Goal:** Integrate all assets, resolve conflicts, performance optimize

**Deliverables:**
- All assets integrated
- Performance optimized (60 FPS desktop, 30 FPS mobile)
- No console errors
- Production build successful

**Time Estimate:** 3-4 hours

### ACT: Final Integration

**Step 1: Asset Integration Verification (1 hour)**

```bash
cd Overlord.Phaser
npm run build
```

Check for:
- [ ] No missing asset errors
- [ ] No TypeScript errors
- [ ] Bundle size < 5 MB (excluding assets)

**Step 2: Performance Optimization (1 hour)**

Profile in Chrome DevTools:
- [ ] Galaxy map renders at 60 FPS
- [ ] Scene transitions < 500ms
- [ ] Memory usage < 200 MB typical

Optimizations if needed:
- Sprite batching
- Texture atlases
- Lazy loading non-critical assets

**Step 3: Cross-Browser Testing (1 hour)**

Test in:
- [ ] Chrome 90+ (Windows, Mac)
- [ ] Firefox 88+ (Windows, Mac)
- [ ] Safari 14+ (Mac)
- [ ] Edge 90+

Mobile:
- [ ] iOS Safari 14+ (iPhone, iPad)
- [ ] Chrome Mobile (Android)

**Step 4: Error Handling Review (30 min)**

- [ ] All async operations have error handlers
- [ ] Network failures show user-friendly messages
- [ ] Save failures don't lose data (LocalStorage fallback)

### VALIDATE: Final Integration

**Full System Test:**
```bash
npm test
npm run build
npm run lint
```

All must pass with zero errors.

---

## Chapter 8: Comprehensive UAT Scripts

### Overview

These UAT (User Acceptance Testing) scripts ensure every feature is manually verified before release. Execute these scripts after all phases are complete.

**Testing Requirements:**
- Fresh browser session (clear cache/cookies)
- Test in both Chrome and Firefox
- Test on mobile device if possible
- Document any failures with screenshots

---

### UAT-1: First-Time User Experience (15 min)

**Purpose:** Verify a new player can learn and enjoy the game

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 1.1 | Navigate to game URL | Page loads within 3 seconds | [ ] | [ ] | |
| 1.2 | Observe loading screen | Loading bar visible, no errors | [ ] | [ ] | |
| 1.3 | Audio activation overlay | Overlay appears, explains click needed | [ ] | [ ] | |
| 1.4 | Click to enable audio | Audio unlocks, overlay disappears | [ ] | [ ] | |
| 1.5 | Main menu displays | Title, menu buttons visible | [ ] | [ ] | |
| 1.6 | Background music plays | Menu theme audible | [ ] | [ ] | |
| 1.7 | Hover over "Play" button | Button highlight, hover SFX | [ ] | [ ] | |
| 1.8 | Click "Flash Conflicts" | Scenario list appears | [ ] | [ ] | |
| 1.9 | Locate Tutorial 001 | "First Steps" visible in list | [ ] | [ ] | |
| 1.10 | Select Tutorial 001 | Detail panel shows description | [ ] | [ ] | |
| 1.11 | Read objectives | Victory condition clear | [ ] | [ ] | |
| 1.12 | Click "Start" | Tutorial begins, Step 1 shown | [ ] | [ ] | |
| 1.13 | Tutorial highlight visible | Planet highlighted with arrow/glow | [ ] | [ ] | |
| 1.14 | Click highlighted planet | Step advances to Step 2 | [ ] | [ ] | |
| 1.15 | Follow all tutorial steps | Each step clear, actionable | [ ] | [ ] | |
| 1.16 | Complete tutorial objective | Victory condition triggers | [ ] | [ ] | |
| 1.17 | Results screen shows | Star rating displayed | [ ] | [ ] | |
| 1.18 | Click "Continue" | Returns to scenario list | [ ] | [ ] | |
| 1.19 | Tutorial shows completion | Checkmark or star icon | [ ] | [ ] | |

**First-Time User Result:** ____/19 passed

---

### UAT-2: Full Campaign Gameplay (30-45 min)

**Purpose:** Verify complete gameplay loop works

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 2.1 | Main menu → New Campaign | Campaign setup appears | [ ] | [ ] | |
| 2.2 | Select AI difficulty | 3 options visible (Easy/Normal/Hard) | [ ] | [ ] | |
| 2.3 | Select galaxy size | Size options visible | [ ] | [ ] | |
| 2.4 | Click "Start Campaign" | Galaxy map loads | [ ] | [ ] | |
| 2.5 | Galaxy music starts | Strategic theme plays | [ ] | [ ] | |
| 2.6 | Star field renders | Background stars visible | [ ] | [ ] | |
| 2.7 | Planets visible | 4-6 planets on map | [ ] | [ ] | |
| 2.8 | Player planet highlighted | Blue color for owned planet | [ ] | [ ] | |
| 2.9 | AI planets visible | Red color for enemy | [ ] | [ ] | |
| 2.10 | Resource HUD visible | Credits, minerals, fuel, food, energy | [ ] | [ ] | |
| 2.11 | Turn counter shows | "Turn 1" displayed | [ ] | [ ] | |
| 2.12 | Click player planet | PlanetInfoPanel opens | [ ] | [ ] | |
| 2.13 | Planet stats displayed | Population, resources, buildings | [ ] | [ ] | |
| 2.14 | Click "Build" button | BuildingMenuPanel opens | [ ] | [ ] | |
| 2.15 | Building options visible | Mining, Farm, etc. | [ ] | [ ] | |
| 2.16 | Select Mining Station | Cost displayed, confirm button | [ ] | [ ] | |
| 2.17 | Confirm building | SFX plays, building added | [ ] | [ ] | |
| 2.18 | Click "Commission Platoon" | PlatoonCommissionPanel opens | [ ] | [ ] | |
| 2.19 | Configure platoon | Troop count, equipment, weapons | [ ] | [ ] | |
| 2.20 | Confirm platoon | SFX plays, platoon created | [ ] | [ ] | |
| 2.21 | Click "Purchase Spacecraft" | SpacecraftPurchasePanel opens | [ ] | [ ] | |
| 2.22 | Select Battle Cruiser | Cost displayed | [ ] | [ ] | |
| 2.23 | Confirm purchase | SFX plays, craft added | [ ] | [ ] | |
| 2.24 | Click "End Turn" | Turn processes, SFX plays | [ ] | [ ] | |
| 2.25 | Turn advances | "Turn 2" displayed | [ ] | [ ] | |
| 2.26 | Resources updated | Income added to totals | [ ] | [ ] | |
| 2.27 | AI notification shows | Toast shows AI action | [ ] | [ ] | |
| 2.28 | Select spacecraft | SpacecraftNavigationPanel opens | [ ] | [ ] | |
| 2.29 | Click enemy planet | Navigation path shown | [ ] | [ ] | |
| 2.30 | Confirm navigation | Spacecraft moves | [ ] | [ ] | |
| 2.31 | Load platoons onto craft | PlatoonLoadingPanel opens | [ ] | [ ] | |
| 2.32 | Confirm loading | Platoons board craft | [ ] | [ ] | |
| 2.33 | End turn, craft arrives | Craft reaches destination | [ ] | [ ] | |
| 2.34 | Click enemy planet | Planet info shows | [ ] | [ ] | |
| 2.35 | Click "Invade" | InvasionPanel opens | [ ] | [ ] | |
| 2.36 | Configure aggression | Slider/options visible | [ ] | [ ] | |
| 2.37 | Start invasion | Combat resolves | [ ] | [ ] | |
| 2.38 | Combat SFX plays | Explosion sounds | [ ] | [ ] | |
| 2.39 | BattleResultsPanel shows | Victory/defeat displayed | [ ] | [ ] | |
| 2.40 | Planet ownership changes | Blue if captured | [ ] | [ ] | |
| 2.41 | Continue playing | Repeat expansion | [ ] | [ ] | |
| 2.42 | Capture all enemy planets | Victory triggered | [ ] | [ ] | |
| 2.43 | VictoryScene shows | Victory fanfare plays | [ ] | [ ] | |
| 2.44 | Final stats displayed | Turns, planets, units | [ ] | [ ] | |
| 2.45 | Return to main menu | Click button returns | [ ] | [ ] | |

**Campaign Gameplay Result:** ____/45 passed

---

### UAT-3: Scenario System (20 min)

**Purpose:** Verify Flash Conflicts / tactical scenarios work

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 3.1 | Main menu → Flash Conflicts | FlashConflictsScene loads | [ ] | [ ] | |
| 3.2 | Scenario list visible | All 7 scenarios displayed | [ ] | [ ] | |
| 3.3 | Tutorial category exists | "Tutorial" section | [ ] | [ ] | |
| 3.4 | Tactical category exists | "Tactical" section | [ ] | [ ] | |
| 3.5 | Select tactical-001 | Detail panel shows | [ ] | [ ] | |
| 3.6 | Difficulty shown | "Medium" displayed | [ ] | [ ] | |
| 3.7 | Duration shown | "10-15 min" displayed | [ ] | [ ] | |
| 3.8 | Objectives shown | "Conquer 3 planets" text | [ ] | [ ] | |
| 3.9 | Prerequisites shown | Tutorial required message | [ ] | [ ] | |
| 3.10 | Start scenario | ScenarioGameScene loads | [ ] | [ ] | |
| 3.11 | ObjectivesPanel visible | Primary objective shown | [ ] | [ ] | |
| 3.12 | Initial state correct | Resources match JSON | [ ] | [ ] | |
| 3.13 | AI personality correct | Defensive behavior | [ ] | [ ] | |
| 3.14 | Play to victory | Capture 3 planets | [ ] | [ ] | |
| 3.15 | Victory detected | Victory condition triggers | [ ] | [ ] | |
| 3.16 | Results panel shows | ScenarioResultsPanel | [ ] | [ ] | |
| 3.17 | Star rating calculated | 1-3 stars based on turns | [ ] | [ ] | |
| 3.18 | Completion recorded | LocalStorage updated | [ ] | [ ] | |
| 3.19 | Return to scenario list | Click returns | [ ] | [ ] | |
| 3.20 | Completion indicator | Stars show on list item | [ ] | [ ] | |
| 3.21 | Best time displayed | Previous best shown | [ ] | [ ] | |
| 3.22 | Replay scenario | Start again works | [ ] | [ ] | |

**Scenario System Result:** ____/22 passed

---

### UAT-4: Scenario Packs (15 min)

**Purpose:** Verify scenario pack system works

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 4.1 | Main menu → Scenario Packs | ScenarioPackScene loads | [ ] | [ ] | |
| 4.2 | Pack list visible | 3+ packs displayed | [ ] | [ ] | |
| 4.3 | Pack thumbnails show | Images/colors visible | [ ] | [ ] | |
| 4.4 | Select "Aggressive Warlord" | PackDetailPanel opens | [ ] | [ ] | |
| 4.5 | Leader name shown | "Commander Vex" | [ ] | [ ] | |
| 4.6 | Difficulty shown | "Hard" displayed | [ ] | [ ] | |
| 4.7 | Description readable | Full text visible | [ ] | [ ] | |
| 4.8 | Included scenarios listed | 2 scenarios shown | [ ] | [ ] | |
| 4.9 | Click "Activate Pack" | Pack becomes active | [ ] | [ ] | |
| 4.10 | Start campaign | Uses pack AI config | [ ] | [ ] | |
| 4.11 | AI behaves aggressively | More frequent attacks | [ ] | [ ] | |
| 4.12 | Switch to different pack | PackSwitchDialog appears | [ ] | [ ] | |
| 4.13 | Confirm switch | New pack active | [ ] | [ ] | |
| 4.14 | Pack persists across sessions | Refresh keeps selection | [ ] | [ ] | |

**Scenario Packs Result:** ____/14 passed

---

### UAT-5: Audio System (10 min)

**Purpose:** Verify all audio features work

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 5.1 | Load game fresh | Audio overlay appears | [ ] | [ ] | |
| 5.2 | Click to enable | Audio unlocks | [ ] | [ ] | |
| 5.3 | Menu music plays | Theme audible | [ ] | [ ] | |
| 5.4 | Hover button | Hover SFX plays | [ ] | [ ] | |
| 5.5 | Click button | Click SFX plays | [ ] | [ ] | |
| 5.6 | Start campaign | Galaxy music starts | [ ] | [ ] | |
| 5.7 | Build structure | Construction SFX | [ ] | [ ] | |
| 5.8 | End turn | Turn-end SFX | [ ] | [ ] | |
| 5.9 | Combat | Explosion SFX | [ ] | [ ] | |
| 5.10 | Open settings/volume | VolumeControlPanel opens | [ ] | [ ] | |
| 5.11 | 3 sliders visible | Master, SFX, Music | [ ] | [ ] | |
| 5.12 | Drag Master to 0 | All audio muted | [ ] | [ ] | |
| 5.13 | Drag Master to 100 | Full volume restored | [ ] | [ ] | |
| 5.14 | Drag SFX to 0 | Music plays, SFX silent | [ ] | [ ] | |
| 5.15 | Drag Music to 0 | SFX plays, music silent | [ ] | [ ] | |
| 5.16 | Press Ctrl+M | Global mute toggles | [ ] | [ ] | |
| 5.17 | Mute icon changes | Visual indicator updates | [ ] | [ ] | |
| 5.18 | Win scenario | Victory fanfare plays | [ ] | [ ] | |
| 5.19 | Lose scenario | Defeat sound plays | [ ] | [ ] | |
| 5.20 | Refresh page | Volume settings persist | [ ] | [ ] | |

**Audio System Result:** ____/20 passed

---

### UAT-6: User Accounts & Cloud Saves (15 min)

**Purpose:** Verify user account and cloud persistence

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 6.1 | Click "Account" | Login/signup options | [ ] | [ ] | |
| 6.2 | Click "Create Account" | Registration form | [ ] | [ ] | |
| 6.3 | Enter valid email | Email field accepts | [ ] | [ ] | |
| 6.4 | Enter password (8+ chars) | Password accepted | [ ] | [ ] | |
| 6.5 | Submit registration | Account created | [ ] | [ ] | |
| 6.6 | Auto-login occurs | Logged in state shown | [ ] | [ ] | |
| 6.7 | Username displayed | Email/name visible | [ ] | [ ] | |
| 6.8 | Start campaign | Game works normally | [ ] | [ ] | |
| 6.9 | Play 5+ turns | Progress made | [ ] | [ ] | |
| 6.10 | Click "Save" | Save dialog appears | [ ] | [ ] | |
| 6.11 | Enter save name | Name field works | [ ] | [ ] | |
| 6.12 | Confirm save | Success message | [ ] | [ ] | |
| 6.13 | Click "Logout" | Returns to guest state | [ ] | [ ] | |
| 6.14 | Click "Login" | Login form appears | [ ] | [ ] | |
| 6.15 | Enter credentials | Login successful | [ ] | [ ] | |
| 6.16 | Click "Load Game" | Save list appears | [ ] | [ ] | |
| 6.17 | Previous save visible | Correct name shown | [ ] | [ ] | |
| 6.18 | Click save to load | Game state restored | [ ] | [ ] | |
| 6.19 | Turn number correct | Same as when saved | [ ] | [ ] | |
| 6.20 | Resources correct | Same as when saved | [ ] | [ ] | |
| 6.21 | Units in correct positions | Same as when saved | [ ] | [ ] | |
| 6.22 | Complete a scenario | Stars awarded | [ ] | [ ] | |
| 6.23 | Check statistics | Completion tracked | [ ] | [ ] | |
| 6.24 | Change settings | Settings update | [ ] | [ ] | |
| 6.25 | Refresh page | Settings persisted | [ ] | [ ] | |

**User Accounts Result:** ____/25 passed

---

### UAT-7: Accessibility & Input (10 min)

**Purpose:** Verify accessibility features

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 7.1 | Press H key | Help overlay appears | [ ] | [ ] | |
| 7.2 | Press Escape | Help closes / menus close | [ ] | [ ] | |
| 7.3 | Press Ctrl+M | Audio mutes/unmutes | [ ] | [ ] | |
| 7.4 | Mouse wheel on map | Camera zooms | [ ] | [ ] | |
| 7.5 | Arrow keys | Camera pans | [ ] | [ ] | |
| 7.6 | Click and drag | Camera pans | [ ] | [ ] | |
| 7.7 | Touch zoom (mobile) | Pinch zooms camera | [ ] | [ ] | |
| 7.8 | Touch pan (mobile) | Swipe pans camera | [ ] | [ ] | |
| 7.9 | Open settings | Accessibility tab | [ ] | [ ] | |
| 7.10 | Change UI scale | 100%, 125%, 150% options | [ ] | [ ] | |
| 7.11 | Set UI to 150% | All UI elements larger | [ ] | [ ] | |
| 7.12 | Enable high contrast | Colors become bolder | [ ] | [ ] | |
| 7.13 | Tab navigation | Focus moves between buttons | [ ] | [ ] | |
| 7.14 | Enter/Space activates | Selected button triggers | [ ] | [ ] | |

**Accessibility Result:** ____/14 passed

---

### UAT-8: Cross-Browser Compatibility (15 min)

**Purpose:** Verify game works in major browsers

Test the following in each browser:

| Browser | Version | Load | Menu | Gameplay | Audio | Save | Pass |
|---------|---------|------|------|----------|-------|------|------|
| Chrome | 90+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Firefox | 88+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Safari | 14+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Edge | 90+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| iOS Safari | 14+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Chrome Mobile | 90+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

**Cross-Browser Result:** ____/6 browsers passing

---

### UAT-9: Performance Validation (10 min)

**Purpose:** Verify acceptable performance

| # | Metric | Target | Actual | Pass | Notes |
|---|--------|--------|--------|------|-------|
| 9.1 | Initial load time | < 5 sec | ___ sec | [ ] | |
| 9.2 | Galaxy map FPS (desktop) | ≥ 60 FPS | ___ FPS | [ ] | |
| 9.3 | Galaxy map FPS (mobile) | ≥ 30 FPS | ___ FPS | [ ] | |
| 9.4 | Scene transition | < 1 sec | ___ sec | [ ] | |
| 9.5 | Memory usage (typical) | < 200 MB | ___ MB | [ ] | |
| 9.6 | Memory after 20 turns | < 300 MB | ___ MB | [ ] | |
| 9.7 | Save/load time | < 2 sec | ___ sec | [ ] | |
| 9.8 | Audio latency | < 100 ms | ___ ms | [ ] | |

**Performance Result:** ____/8 metrics passing

---

### UAT-10: Error Handling (10 min)

**Purpose:** Verify graceful error handling

| # | Action | Expected Result | Pass | Fail | Notes |
|---|--------|-----------------|------|------|-------|
| 10.1 | Disable network, try save | Error message, no crash | [ ] | [ ] | |
| 10.2 | Invalid login credentials | Friendly error message | [ ] | [ ] | |
| 10.3 | Load corrupted save (if any) | Error message, offer retry | [ ] | [ ] | |
| 10.4 | Resize browser rapidly | No visual glitches | [ ] | [ ] | |
| 10.5 | Spam-click buttons | No double-actions | [ ] | [ ] | |
| 10.6 | Open DevTools console | No error spam | [ ] | [ ] | |

**Error Handling Result:** ____/6 passed

---

### UAT Summary

| Test Suite | Passed | Total | Percentage |
|------------|--------|-------|------------|
| UAT-1: First-Time User | | 19 | |
| UAT-2: Campaign Gameplay | | 45 | |
| UAT-3: Scenario System | | 22 | |
| UAT-4: Scenario Packs | | 14 | |
| UAT-5: Audio System | | 20 | |
| UAT-6: User Accounts | | 25 | |
| UAT-7: Accessibility | | 14 | |
| UAT-8: Cross-Browser | | 6 | |
| UAT-9: Performance | | 8 | |
| UAT-10: Error Handling | | 6 | |
| **TOTAL** | | **179** | |

**Minimum for Release:** 95% pass rate (170/179)
**Target:** 100% pass rate (179/179)

**Tester Signature:** _______________
**Date:** _______________
**Build Version:** _______________

---

## Chapter 9: Release Checklist

### Pre-Release Checklist

#### Code Quality
- [ ] All 1272+ tests passing (`npm test`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Code coverage ≥ 70%
- [ ] No console.log() statements in production
- [ ] No TODO comments unresolved

#### Assets
- [ ] All art assets present and loading
- [ ] All audio files present and playing
- [ ] No placeholder assets in production
- [ ] Asset manifest complete and valid
- [ ] Images optimized (compressed)
- [ ] Audio normalized and loops clean

#### Features
- [ ] Tutorial playable start to finish
- [ ] All 7 scenarios playable
- [ ] All 3 scenario packs functional
- [ ] Campaign mode complete
- [ ] Victory/defeat conditions working
- [ ] AI opponent functional
- [ ] Save/load working (local + cloud)
- [ ] Audio system complete
- [ ] Volume controls working
- [ ] Accessibility features working

#### Testing
- [ ] UAT scripts 95%+ passed
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Performance targets met
- [ ] Error handling verified

#### Infrastructure
- [ ] Supabase production database ready
- [ ] RLS policies verified
- [ ] Vercel deployment configured
- [ ] Custom domain (if any) configured
- [ ] SSL certificate active

#### Documentation
- [ ] README.md updated
- [ ] CHANGELOG.md updated
- [ ] Version number bumped (package.json)
- [ ] License file present
- [ ] Credits for audio/art sources documented

### Deployment Steps

1. **Final Build**
   ```bash
   cd Overlord.Phaser
   npm run build
   ```

2. **Verify Build Output**
   - Check `dist/` folder created
   - Verify bundle size reasonable
   - Test local serve: `npx serve dist`

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Post-Deployment Verification**
   - [ ] Site loads at production URL
   - [ ] No console errors
   - [ ] Audio works
   - [ ] Save/load works with Supabase
   - [ ] All scenarios accessible

5. **Announce Release**
   - Create GitHub release tag
   - Write release notes
   - Announce on relevant channels

---

## Additional Resources

### Quick Reference: Human Tasks

| Task | Time | Priority | Dependency |
|------|------|----------|------------|
| Generate art assets (Midjourney) | 4-6 hrs | High | None |
| Gather audio files | 4-6 hrs | High | None |
| Create Supabase project | 30 min | Medium | None |
| Playtest scenarios | 2-3 hrs | Medium | None |
| Create scenario packs | 1 hr | Medium | None |
| Execute UAT scripts | 4-6 hrs | High | All above |

### Quick Reference: AI Tasks

| Task | Time | Dependency |
|------|------|------------|
| Integrate art assets | 2-3 hrs | Art files ready |
| Integrate audio triggers | 2-3 hrs | Audio files ready |
| Implement Epic 10 (cloud) | 8-10 hrs | Supabase setup |
| Fix any UAT failures | 2-4 hrs | UAT execution |
| Performance optimization | 2-3 hrs | Integration complete |

### File Locations

| Asset Type | Directory |
|------------|-----------|
| Spacecraft sprites | `public/assets/sprites/craft/` |
| Planet sprites | `public/assets/sprites/planets/` |
| Building sprites | `public/assets/sprites/buildings/` |
| Leader portraits | `public/assets/portraits/` |
| UI icons | `public/assets/ui/icons/` |
| Backgrounds | `public/assets/backgrounds/` |
| Sound effects | `public/assets/audio/sfx/` |
| Music tracks | `public/assets/audio/music/` |
| Scenario JSON | `src/data/scenarios/` |
| Pack JSON | `src/data/packs/` |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| H | Help overlay |
| Escape | Close dialog/menu |
| Ctrl+M | Mute toggle |
| Ctrl+S | Quick save (if logged in) |
| Arrow keys | Pan camera |
| +/- | Zoom in/out |
| Space | End turn |

---

## Changelog

**v2.0.0 (December 13, 2025)**
- Complete rewrite with accurate status
- Updated from 7/12 epics to 10/12 epics
- Updated test count from 835 to 1,272
- Added Plan-Act-Validate framework
- Added comprehensive UAT scripts (179 test cases)
- Added release checklist
- Documented actual remaining work

**v1.0.0 (December 11, 2025)**
- Initial version (now outdated)

---

**Volume II Status:** Complete
**Last Updated:** December 13, 2025
**Next Review:** After all phases complete
