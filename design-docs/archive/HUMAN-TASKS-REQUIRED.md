# Human Tasks Required - Sprint Execution Paused

**Generated:** 2025-12-11
**Current Branch:** epic/6-combat
**Autonomous Progress:** 9 of 26 stories completed
**Status:** AWAITING HUMAN INPUT

---

## Executive Summary

All autonomous development stories have been completed. The remaining 17 drafted stories require human content creation, configuration, or depend on stories that need human input.

**Completed Autonomous Work:**
- ✅ Epic 6: Combat & Planetary Invasion (3 stories) - COMPLETE
- ✅ Epic 7: AI Opponent System (2 stories) - COMPLETE
- ✅ Epic 1: Flash Conflicts Menu (1 story) - PARTIAL (1 of 6)
- ⚠️ Epic 1: 5 stories blocked on human content
- ⚠️ Epic 8: 1 story requires human content
- ⚠️ Epic 9: 3 stories blocked on human content
- ⚠️ Epic 10: 7 stories require Supabase setup
- ⚠️ Epic 12: 5 stories blocked on audio files

**Next Steps:**
1. Review this document to understand what content is needed
2. Complete human tasks in recommended order (see below)
3. Commit completed content to appropriate epic branches
4. Resume autonomous development with: `continue with remaining stories`

---

## Stories Requiring Human Input (Priority Order)

### HIGH PRIORITY: Epic 1 - Tutorial Content



#### Story 1-3: Scenario Initialization and Victory Conditions
**Status:** drafted → requires scenario configuration files
**Blocker Type:** Content Design
**Complexity:** Medium
**Time Estimate:** 30-45 minutes

**Required Deliverables:**
1. Create 2-3 initial tutorial scenario JSON files following schema from 1-2
2. Define victory conditions for each scenario
3. Set up initial game state for tutorials

**Scenario Files Needed:**
- `Overlord.Phaser/src/data/scenarios/tutorial-01-basic-combat.json`
- `Overlord.Phaser/src/data/scenarios/tutorial-02-planetary-mgmt.json`
- `Overlord.Phaser/src/data/scenarios/tutorial-03-fleet-ops.json` (optional)

**Example Content:**
```json
{
  "scenarioId": "tutorial-01",
  "name": "Basic Combat Tutorial",
  "type": "tutorial",
  "difficulty": "easy",
  "description": "Learn to commission platoons and engage in combat",
  "objectives": {
    "primary": "Defeat the AI platoon on Planet Beta",
    "secondary": ["Complete with no casualties", "Win in under 5 minutes"]
  },
  "initialSetup": {
    "playerPlanets": ["Alpha"],
    "enemyPlanets": ["Beta"],
    "playerResources": { "credits": 5000, "minerals": 2000, "fuel": 1000 },
    "playerStartingUnits": [
      {
        "type": "platoon",
        "planet": "Alpha",
        "equipment": "basic",
        "weapons": "basic",
        "training": "basic"
      }
    ]
  },
  "victoryConditions": {
    "type": "elimination",
    "target": "All enemy forces destroyed"
  },
  "starTargets": {
    "threeStars": 300,
    "twoStars": 600
  }
}
```

**Dependencies:** Story 1-2 (schema definition)
**Blocks:** Stories 1-4, 1-5, 1-6

---

#### Story 1-4: Tutorial Step Guidance System
**Status:** drafted → requires tutorial step content
**Blocker Type:** Content Design
**Complexity:** HIGH
**Time Estimate:** 90-120 minutes

**Required Deliverables:**
1. Define tutorial step-by-step guidance text
2. Specify UI element highlighting for each step
3. Create action triggers for step progression

**Tutorial Step Template:**
```json
{
  "scenarioId": "tutorial-01",
  "steps": [
    {
      "stepId": 1,
      "title": "Welcome to Overlord",
      "message": "In this tutorial, you'll learn basic combat. Let's start by commissioning a platoon.",
      "highlightElement": "planet-Alpha",
      "highlightPanel": "PlatoonCommissionPanel",
      "requiredAction": "commission-platoon",
      "nextStepTrigger": "platoon-commissioned"
    },
    {
      "stepId": 2,
      "title": "Load Your Troops",
      "message": "Great! Now load your platoon onto a Battle Cruiser for transport.",
      "highlightElement": "spacecraft-list",
      "highlightPanel": "PlatoonLoadingPanel",
      "requiredAction": "load-platoon",
      "nextStepTrigger": "platoon-loaded"
    },
    {
      "stepId": 3,
      "title": "Navigate to Enemy Planet",
      "message": "Select your Battle Cruiser and set a course to Planet Beta.",
      "highlightElement": "planet-Beta",
      "requiredAction": "navigate-spacecraft",
      "nextStepTrigger": "spacecraft-arrived"
    },
    {
      "stepId": 4,
      "title": "Initiate Invasion",
      "message": "Your forces have arrived. Initiate a planetary invasion to defeat the enemy.",
      "highlightPanel": "InvasionPanel",
      "requiredAction": "initiate-invasion",
      "nextStepTrigger": "invasion-complete"
    },
    {
      "stepId": 5,
      "title": "Tutorial Complete!",
      "message": "Excellent work! You've mastered basic combat. Try the next tutorial to learn planetary management.",
      "requiredAction": "none",
      "nextStepTrigger": "auto-complete"
    }
  ]
}
```

**Files to Create:**
- `Overlord.Phaser/src/data/tutorials/tutorial-01-steps.json`
- `Overlord.Phaser/src/data/tutorials/tutorial-02-steps.json`
- `Overlord.Phaser/src/data/tutorials/tutorial-03-steps.json` (optional)

**Dependencies:** Stories 1-2, 1-3
**Blocks:** Story 1-5

---

### MEDIUM PRIORITY: Epic 8 - Tactical Scenarios

#### Story 8-1: Tactical Scenario Content and Variety
**Status:** drafted → requires tactical scenario JSON files
**Blocker Type:** Content Design
**Complexity:** HIGH
**Time Estimate:** 2-3 hours

**Required Deliverables:**
1. Create 4-6 tactical scenario JSON files (non-tutorial)
2. Define unique victory conditions for each
3. Balance difficulty and resource distribution
4. Write scenario descriptions

**Scenario Themes Suggested:**
- "Defend the Colony" - Hold out against waves of attacks
- "Resource Rush" - Capture mineral-rich planets quickly
- "Fleet Superiority" - Destroy enemy spacecraft
- "Economic Victory" - Reach target resource thresholds
- "Time Trial" - Capture all planets within time limit
- "Guerrilla Warfare" - Win with limited starting forces

**Files to Create:**
- `Overlord.Phaser/src/data/scenarios/tactical-01-defend-colony.json`
- `Overlord.Phaser/src/data/scenarios/tactical-02-resource-rush.json`
- `Overlord.Phaser/src/data/scenarios/tactical-03-fleet-superiority.json`
- `Overlord.Phaser/src/data/scenarios/tactical-04-economic-victory.json`
- `Overlord.Phaser/src/data/scenarios/tactical-05-time-trial.json` (optional)
- `Overlord.Phaser/src/data/scenarios/tactical-06-guerrilla.json` (optional)

**Example:**
```json
{
  "scenarioId": "tactical-01",
  "name": "Defend the Colony",
  "type": "tactical",
  "difficulty": "medium",
  "description": "The enemy is launching a massive assault. Hold your colony for 10 turns.",
  "objectives": {
    "primary": "Survive for 10 turns with at least one planet",
    "secondary": ["Destroy all attacking forces", "Keep all planets"]
  },
  "initialSetup": {
    "playerPlanets": ["Alpha", "Beta"],
    "enemyPlanets": ["Gamma", "Delta", "Epsilon"],
    "playerResources": { "credits": 8000, "minerals": 4000, "fuel": 2000 },
    "enemyResources": { "credits": 15000, "minerals": 8000, "fuel": 5000 }
  },
  "victoryConditions": {
    "type": "survival",
    "turns": 10,
    "minimumPlanets": 1
  },
  "starTargets": {
    "threeStars": 600,
    "twoStars": 900
  }
}
```

**Dependencies:** Story 1-2 (scenario schema)
**Blocks:** None (standalone epic)

---

### MEDIUM PRIORITY: Epic 9 - Scenario Packs

#### Story 9-1: Scenario Pack Browsing and Selection
**Status:** drafted → requires pack JSON files
**Blocker Type:** Content Design
**Complexity:** MEDIUM
**Time Estimate:** 1-2 hours

**Required Deliverables:**
1. Create 2-3 scenario pack JSON files
2. Define AI personalities and difficulty modifiers
3. Specify galaxy templates for each pack
4. Write pack descriptions and metadata

**Pack Themes Suggested:**
- "Aggressive Warlord" - Offensive AI, sparse resources, military focus
- "Defensive Strategist" - Defensive AI, rich resources, building focus
- "Balanced Conquest" - Standard settings, balanced gameplay

**Files to Create:**
- `Overlord.Phaser/src/data/packs/pack-aggressive-warlord.json`
- `Overlord.Phaser/src/data/packs/pack-defensive-strategist.json`
- `Overlord.Phaser/src/data/packs/pack-balanced-conquest.json`

**Pack Schema:**
```json
{
  "packId": "aggressive-warlord",
  "name": "Aggressive Warlord",
  "factionLeader": "Commander Vex",
  "description": "Face a ruthless AI opponent who prioritizes military expansion",
  "difficulty": "hard",
  "featured": true,
  "aiConfig": {
    "personality": "Aggressive",
    "difficulty": "Hard",
    "modifiers": {
      "aggressionBonus": 25,
      "economicFocus": -15,
      "militaryFocus": 40
    }
  },
  "galaxyTemplate": {
    "planetCount": { "min": 4, "max": 6 },
    "planetTypes": ["barren", "temperate", "oceanic"],
    "resourceAbundance": "scarce"
  },
  "colorTheme": 0xff4444,
  "portraitUrl": "assets/portraits/vex.png"
}
```

**Dependencies:** None
**Blocks:** Stories 9-2, 9-3

---

### LOW PRIORITY: Epic 10 - User Accounts & Cloud Saves

#### Story 10-1: User Account Creation
**Status:** drafted → requires Supabase project setup
**Blocker Type:** Infrastructure Setup
**Complexity:** LOW (setup), MEDIUM (integration)
**Time Estimate:** 30 minutes setup + 1 hour integration

**Required Deliverables:**
1. Create Supabase project
2. Generate API keys and URL
3. Configure authentication providers
4. Create initial database tables

**Setup Steps:**
1. Go to https://supabase.com and create new project
2. Project name: "Overlord"
3. Enable Email/Password authentication
4. Copy Project URL and Anon Key
5. Create configuration file

**Files to Create:**
- `Overlord.Phaser/src/config/supabase.ts`

**Configuration Template:**
```typescript
// src/config/supabase.ts
export const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'YOUR_ANON_KEY_HERE'
};
```

**Required Environment Variables:**
```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Database Schema (SQL to run in Supabase):**
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Campaign saves
CREATE TABLE campaign_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  save_name TEXT,
  save_data JSONB,
  turn_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scenario completions
CREATE TABLE scenario_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  scenario_id TEXT,
  completed BOOLEAN,
  completion_time_seconds INTEGER,
  star_rating INTEGER,
  attempts INTEGER DEFAULT 1,
  best_time_seconds INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- User settings
CREATE TABLE user_settings (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  settings JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaign_saves_user ON campaign_saves(user_id);
CREATE INDEX idx_scenario_completions_user ON scenario_completions(user_id);
CREATE INDEX idx_scenario_completions_scenario ON scenario_completions(scenario_id);
```

**Dependencies:** None
**Blocks:** Stories 10-2, 10-3, 10-4, 10-5, 10-6, 10-7

---

### LOW PRIORITY: Epic 12 - Audio System

#### Story 12-1: Sound Effects for Game Actions
**Status:** drafted → requires audio files
**Blocker Type:** Asset Creation
**Complexity:** MEDIUM
**Time Estimate:** 1-2 hours

**Required Deliverables:**
1. Sound effect audio files (MP3 or OGG format)
2. Organize files in assets directory
3. Create audio manifest file

**Sound Effects Needed (minimum):**
- Button click/hover (UI feedback)
- Platoon commissioned (military action)
- Building constructed (construction complete)
- Spacecraft launch (movement initiated)
- Combat explosion (battle action)
- Victory fanfare (scenario complete)
- Defeat sound (scenario failed)
- Resource collected (economy event)

**Files to Create:**
- `Overlord.Phaser/public/assets/audio/sfx/button-click.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/button-hover.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/platoon-commissioned.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/building-constructed.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/spacecraft-launch.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/combat-explosion.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/victory-fanfare.mp3`
- `Overlord.Phaser/public/assets/audio/sfx/defeat-sound.mp3`

**Audio Manifest:**
```json
{
  "soundEffects": {
    "ui": {
      "buttonClick": "assets/audio/sfx/button-click.mp3",
      "buttonHover": "assets/audio/sfx/button-hover.mp3"
    },
    "military": {
      "platoonCommissioned": "assets/audio/sfx/platoon-commissioned.mp3",
      "spacecraftLaunch": "assets/audio/sfx/spacecraft-launch.mp3"
    },
    "combat": {
      "explosion": "assets/audio/sfx/combat-explosion.mp3"
    },
    "economy": {
      "buildingConstructed": "assets/audio/sfx/building-constructed.mp3"
    },
    "scenario": {
      "victory": "assets/audio/sfx/victory-fanfare.mp3",
      "defeat": "assets/audio/sfx/defeat-sound.mp3"
    }
  }
}
```

**Recommended Sources:**
- Freesound.org (CC0 licensed sounds)
- OpenGameArt.org (free game audio)
- Incompetech.com (royalty-free music)
- Use online tools like BFXR or ChipTone for retro game sounds

**Dependencies:** None
**Blocks:** Stories 12-3, 12-4, 12-5

---

#### Story 12-2: Background Music During Gameplay
**Status:** drafted → requires music files
**Blocker Type:** Asset Creation
**Complexity:** MEDIUM
**Time Estimate:** 2-3 hours

**Required Deliverables:**
1. Background music tracks (MP3 or OGG, loopable)
2. Organize files in assets directory
3. Define music track assignments

**Music Tracks Needed (minimum):**
- Main menu theme (ambient, welcoming)
- Galaxy map theme (strategic, contemplative)
- Combat music (intense, action-oriented)

**Files to Create:**
- `Overlord.Phaser/public/assets/audio/music/main-menu-theme.mp3`
- `Overlord.Phaser/public/assets/audio/music/galaxy-map-theme.mp3`
- `Overlord.Phaser/public/assets/audio/music/combat-theme.mp3`

**Music Manifest:**
```json
{
  "musicTracks": {
    "mainMenu": "assets/audio/music/main-menu-theme.mp3",
    "galaxyMap": "assets/audio/music/galaxy-map-theme.mp3",
    "combat": "assets/audio/music/combat-theme.mp3"
  },
  "defaultTrack": "galaxyMap"
}
```

**Requirements:**
- Tracks should be seamlessly loopable
- Length: 2-5 minutes per track
- Format: MP3 (128-192 kbps) or OGG
- File size: <2MB per track for web performance

**Recommended Sources:**
- Incompetech.com (Kevin MacLeod's royalty-free music)
- OpenGameArt.org
- FreePD.com (public domain music)
- BenSound.com (free music with attribution)

**Dependencies:** None
**Blocks:** Stories 12-3, 12-4, 12-5

---

## Dependency Chain Summary

```
Epic 1 (Tutorials):
  1-2 (Schema) → 1-3 (Scenarios) → 1-4 (Steps) → 1-5 (Results) → 1-6 (History)
  └─ HUMAN     └─ HUMAN          └─ HUMAN

Epic 8 (Tactical):
  8-1 (Scenarios) → (standalone)
  └─ HUMAN

Epic 9 (Packs):
  9-1 (Pack Files) → 9-2 (Switching) → 9-3 (Metadata)
  └─ HUMAN

Epic 10 (Accounts):
  10-1 (Supabase) → 10-2, 10-3, 10-4, 10-5, 10-6, 10-7
  └─ HUMAN

Epic 12 (Audio):
  12-1 (SFX) ──┐
  12-2 (Music) ┴─→ 12-3 (Volume) → 12-4 (Mute) → 12-5 (Browser)
  └─ HUMAN
  └─ HUMAN
```

---

## Recommended Execution Order

### Phase 1: Critical Path (Epic 1 - Tutorials)
**Priority:** HIGH
**Enables:** 6 stories across Epic 1

1. ✅ **Story 1-2** (45 min) - Scenario JSON schema
2. ✅ **Story 1-3** (30-45 min) - Initial tutorial scenarios
3. ✅ **Story 1-4** (90-120 min) - Tutorial step content

**Total Time:** ~3-4 hours
**Output:** Tutorial system fully functional

### Phase 2: Content Variety (Epic 8 - Tactical Scenarios)
**Priority:** MEDIUM
**Enables:** 1 story

4. ✅ **Story 8-1** (2-3 hours) - Tactical scenario files

**Total Time:** 2-3 hours
**Output:** Quick-play scenarios available

### Phase 3: Parallelizable Tasks
**Priority:** MEDIUM
**Can be done simultaneously**

5. ✅ **Story 9-1** (1-2 hours) - Scenario pack files
6. ✅ **Story 10-1** (30 min) - Supabase setup
7. ✅ **Story 12-1** (1-2 hours) - Sound effects
8. ✅ **Story 12-2** (2-3 hours) - Background music

**Total Time:** 5-8 hours (or 1-2 hours if working in parallel)
**Output:** Packs, cloud saves, and audio ready

**Grand Total Human Time:** 10-15 hours
**Parallelized Total:** 6-9 hours (if multiple people working)

---

## After Completing Human Tasks

### Resume Instructions

1. **Commit Content Files:**
   ```bash
   cd C:\dev\GIT\Overlord
   git add Overlord.Phaser/src/data/**/*.json
   git add Overlord.Phaser/public/assets/audio/**/*.mp3
   git add Overlord.Phaser/src/config/supabase.ts
   git commit -m "content: add human-created scenario, audio, and config files"
   ```

2. **Update Sprint Status:**
   Manually update `design-docs/artifacts/sprint-artifacts/sprint-status.yaml` to remove `[BLOCKED]` tags from completed stories (or ask AI to do this).

3. **Resume Autonomous Development:**
   Simply say: `continue with remaining stories`

   The AI will:
   - Re-read sprint-status.yaml
   - Identify next story (likely 1-2 or 1-3 depending on what you completed)
   - Execute three-agent workflow (tech-writer → game-dev → code-reviewer)
   - Continue through all unblocked stories

---

## Current Sprint Status

### Completed Stories (9)

| Epic | Story | Commit | Tests | Status |
|------|-------|--------|-------|--------|
| 6 | 6-1: Initiate Planetary Invasion | 5d3c367 | 24 | ✅ done |
| 6 | 6-2: Combat Aggression Config | a9e653b | 14+ | ✅ done |
| 6 | 6-3: Battle Results Display | a9e653b | 13+ | ✅ done |
| 7 | 7-1: AI Notifications | a9e653b | 14+ | ✅ done |
| 7 | 7-2: Opponent Info Panel | a9e653b | 12+ | ✅ done |
| 1 | 1-1: Flash Conflicts Menu | 3e1684c | 8+ | ✅ done |

**Total Tests:** 779 + ~85 new = **~864 tests passing**
**Build Status:** SUCCESS
**Branch:** epic/6-combat (needs to be merged and branched for Epic 1)

### Blocked Stories (17)

| Epic | Stories | Blocker |
|------|---------|---------|
| 1 | 1-2, 1-3, 1-4, 1-5, 1-6 | Human content (scenarios, tutorials) |
| 8 | 8-1 | Human content (tactical scenarios) |
| 9 | 9-1, 9-2, 9-3 | Human content (pack files) |
| 10 | 10-1 through 10-7 | Supabase setup + config |
| 12 | 12-1, 12-2, 12-3, 12-4, 12-5 | Audio files |

---

## Questions or Issues?

If any human task is unclear or you need guidance:
1. Review the corresponding story file in `design-docs/artifacts/sprint-artifacts/`
2. Check example templates in this document
3. Ask for clarification before proceeding

**Remember:** Quality over speed. Well-designed content now saves refactoring later.

---

**END OF HUMAN TASKS REPORT**
