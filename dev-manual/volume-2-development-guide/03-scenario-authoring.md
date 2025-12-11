# Scenario Authoring Guide

**Volume II - Chapter 3**
**Purpose:** Step-by-step guide for creating Flash Conflict scenarios

---

## Overview

Flash Conflicts are JSON-based tactical scenarios that serve dual purposes:
1. **Tutorials** - Teach specific game mechanics to new players
2. **Tactical Challenges** - Quick-play skirmishes for experienced players

This guide covers:
- Scenario JSON schema
- Creating tutorial scenarios
- Creating tactical challenge scenarios
- Balancing and playtesting
- Common patterns and templates

---

## Scenario JSON Schema

### Required Fields

```typescript
interface Scenario {
  scenarioId: string;           // Unique identifier (kebab-case)
  name: string;                 // Display name
  type: "tutorial" | "tactical"; // Scenario category
  difficulty: "easy" | "medium" | "hard"; // Difficulty rating
  duration: string;             // Estimated play time (e.g., "5-10 min")
  description: string;          // One-sentence summary
  objectives: {                 // Win conditions
    primary: string;
    secondary: string[];        // Optional bonus objectives
  };
  initialSetup: {               // Starting game state
    playerPlanets: string[];
    enemyPlanets: string[];
    neutralPlanets?: string[];
    playerResources: ResourceCollection;
    enemyResources?: ResourceCollection;
    playerStartingUnits?: Unit[];
    enemyStartingUnits?: Unit[];
    playerStartingBuildings?: Building[];
    enemyStartingBuildings?: Building[];
  };
  victoryConditions: VictoryCondition;
  starTargets: {                // Time-based star ratings
    threeStars: number;         // Seconds for 3 stars
    twoStars: number;           // Seconds for 2 stars
  };
  tutorialSteps?: TutorialStep[]; // Only for type: "tutorial"
  metadata?: {                  // Optional metadata
    author: string;
    version: string;
    tags: string[];
  };
}
```

### Optional Fields

```typescript
interface VictoryCondition {
  type: "elimination" | "capture" | "survival" | "economic" | "custom";
  target?: string;              // Description of goal
  turns?: number;               // For survival scenarios
  minimumPlanets?: number;      // For survival scenarios
  resourceTarget?: ResourceCollection; // For economic scenarios
}

interface TutorialStep {
  stepId: number;
  title: string;
  message: string;              // Instruction text
  highlightElement?: string;    // UI element to highlight
  highlightPanel?: string;      // Panel to highlight
  requiredAction?: string;      // Action player must take
  nextStepTrigger: string;      // Event that advances to next step
}

interface Unit {
  type: "platoon" | "scout" | "battleCruiser" | "bomber" | "atmosphereProcessor";
  planet: string;               // Planet ID where unit spawns
  equipment?: "basic" | "standard" | "advanced" | "elite";
  weapons?: "basic" | "standard" | "advanced" | "elite";
  training?: "basic" | "standard" | "advanced" | "elite";
  troopCount?: number;          // For platoons only (100-500)
  loadedPlatoons?: string[];    // For Battle Cruisers (platoon IDs)
}

interface Building {
  planet: string;               // Planet ID where building exists
  building: "MiningStation" | "Factory" | "ResearchLab" | "HabitationModule" |
            "PowerPlant" | "DefenseGrid" | "Starport";
  complete?: boolean;           // Default: true
  progress?: number;            // Construction progress (0-100)
}

interface ResourceCollection {
  credits: number;
  minerals: number;
  fuel: number;
  food: number;
  energy: number;
}
```

---

## Creating a Tutorial Scenario

### Step 1: Define Learning Objective

**Goal:** What should the player learn?

**Examples:**
- Tutorial 01: Basic Combat (commissioning platoons, invasions)
- Tutorial 02: Planetary Management (building construction, resources)
- Tutorial 03: Fleet Operations (spacecraft purchase, navigation)

**Best Practices:**
- Focus on ONE core mechanic per tutorial
- Keep it simple (5-10 minutes max)
- Provide clear success/failure feedback
- Make it impossible to get stuck (generous resources)

---

### Step 2: Design Initial State

**Principle:** Give player everything they need to succeed

**Example: Basic Combat Tutorial**

```json
{
  "scenarioId": "tutorial-01-basic-combat",
  "name": "Basic Combat Tutorial",
  "type": "tutorial",
  "difficulty": "easy",
  "duration": "5-10 min",
  "description": "Learn to commission platoons and execute planetary invasions.",

  "objectives": {
    "primary": "Defeat the AI platoon on Planet Beta",
    "secondary": [
      "Complete with no casualties",
      "Win in under 5 minutes"
    ]
  },

  "initialSetup": {
    "playerPlanets": ["Alpha"],
    "enemyPlanets": ["Beta"],
    "neutralPlanets": [],

    "playerResources": {
      "credits": 10000,
      "minerals": 5000,
      "fuel": 3000,
      "food": 2000,
      "energy": 2000
    },

    "enemyResources": {
      "credits": 1000,
      "minerals": 500,
      "fuel": 200,
      "food": 100,
      "energy": 100
    },

    "playerStartingUnits": [
      {
        "type": "platoon",
        "planet": "Alpha",
        "equipment": "standard",
        "weapons": "standard",
        "training": "standard",
        "troopCount": 300
      },
      {
        "type": "battleCruiser",
        "planet": "Alpha"
      }
    ],

    "enemyStartingUnits": [
      {
        "type": "platoon",
        "planet": "Beta",
        "equipment": "basic",
        "weapons": "basic",
        "training": "basic",
        "troopCount": 150
      }
    ]
  },

  "victoryConditions": {
    "type": "elimination",
    "target": "Defeat all enemy forces and capture Planet Beta"
  },

  "starTargets": {
    "threeStars": 300,
    "twoStars": 600
  }
}
```

**Key Design Choices:**
- **Generous resources:** Player can't fail due to lack of credits
- **Pre-positioned units:** Battle Cruiser already present
- **Weak enemy:** Basic equipment, fewer troops
- **Clear objective:** Eliminate one platoon, capture one planet

---

### Step 3: Write Tutorial Steps

**Principle:** Guide player step-by-step through first completion

**Example: Tutorial Steps for Basic Combat**

```json
{
  "tutorialSteps": [
    {
      "stepId": 1,
      "title": "Welcome to Overlord",
      "message": "In this tutorial, you'll learn basic combat. Let's start by selecting your home planet, Alpha.",
      "highlightElement": "planet-Alpha",
      "requiredAction": "select-planet",
      "nextStepTrigger": "planet-selected"
    },
    {
      "stepId": 2,
      "title": "Commission a Platoon",
      "message": "Click the 'Commission Platoon' button to create ground forces. We've already given you one, but let's create another.",
      "highlightPanel": "PlatoonCommissionPanel",
      "requiredAction": "commission-platoon",
      "nextStepTrigger": "platoon-commissioned"
    },
    {
      "stepId": 3,
      "title": "Load Troops onto Transport",
      "message": "Your Battle Cruiser can carry up to 5 platoons. Load your platoons onto it for transport to Planet Beta.",
      "highlightPanel": "PlatoonLoadingPanel",
      "requiredAction": "load-platoon",
      "nextStepTrigger": "platoon-loaded"
    },
    {
      "stepId": 4,
      "title": "Navigate to Enemy Planet",
      "message": "Select your Battle Cruiser and set a course to Planet Beta (the enemy planet).",
      "highlightElement": "planet-Beta",
      "requiredAction": "navigate-spacecraft",
      "nextStepTrigger": "spacecraft-arrived"
    },
    {
      "stepId": 5,
      "title": "End Your Turn",
      "message": "Click 'End Turn' to let your Battle Cruiser travel. It will take 2-3 turns to arrive.",
      "highlightElement": "end-turn-button",
      "requiredAction": "end-turn",
      "nextStepTrigger": "turn-ended"
    },
    {
      "stepId": 6,
      "title": "Initiate Invasion",
      "message": "Your forces have arrived! Click on Planet Beta and select 'Invade' to launch your attack.",
      "highlightPanel": "InvasionPanel",
      "requiredAction": "initiate-invasion",
      "nextStepTrigger": "invasion-started"
    },
    {
      "stepId": 7,
      "title": "Set Aggression Level",
      "message": "Higher aggression means faster combat but more casualties. Try 50% for balanced tactics.",
      "highlightPanel": "InvasionPanel",
      "requiredAction": "set-aggression",
      "nextStepTrigger": "aggression-set"
    },
    {
      "stepId": 8,
      "title": "Tutorial Complete!",
      "message": "Excellent work! You've captured Planet Beta. Try the next tutorial to learn planetary management.",
      "requiredAction": "none",
      "nextStepTrigger": "auto-complete"
    }
  ]
}
```

**Tutorial Step Best Practices:**
- **Clear instructions:** Tell player exactly what to do
- **Visual cues:** Highlight UI elements they need to click
- **Progressive disclosure:** One step at a time, not overwhelming
- **Positive reinforcement:** Celebrate successes ("Excellent work!")
- **Next steps:** Guide to next tutorial or full campaign

---

## Creating a Tactical Challenge Scenario

### Step 1: Choose a Theme

**Common Tactical Themes:**
- **Defensive Stand:** Survive against overwhelming odds
- **Resource Rush:** Capture resource-rich planets quickly
- **Fleet Superiority:** Destroy enemy spacecraft
- **Economic Victory:** Reach resource thresholds
- **Time Trial:** Capture all planets in X turns
- **Guerrilla Warfare:** Win with limited starting forces

---

### Step 2: Design Challenge State

**Principle:** Create an interesting tactical puzzle

**Example: Defend the Colony (Defensive Stand)**

```json
{
  "scenarioId": "tactical-01-defend-colony",
  "name": "Defend the Colony",
  "type": "tactical",
  "difficulty": "medium",
  "duration": "10-15 min",
  "description": "The enemy is launching a massive assault. Hold your colony for 10 turns.",

  "objectives": {
    "primary": "Survive for 10 turns with at least one planet",
    "secondary": [
      "Destroy all attacking forces",
      "Keep all planets under your control"
    ]
  },

  "initialSetup": {
    "playerPlanets": ["Alpha", "Beta"],
    "enemyPlanets": ["Gamma", "Delta", "Epsilon"],
    "neutralPlanets": [],

    "playerResources": {
      "credits": 8000,
      "minerals": 4000,
      "fuel": 2000,
      "food": 1000,
      "energy": 1000
    },

    "enemyResources": {
      "credits": 20000,
      "minerals": 10000,
      "fuel": 5000,
      "food": 3000,
      "energy": 3000
    },

    "playerStartingUnits": [
      {
        "type": "platoon",
        "planet": "Alpha",
        "equipment": "advanced",
        "weapons": "advanced",
        "training": "standard",
        "troopCount": 400
      },
      {
        "type": "platoon",
        "planet": "Beta",
        "equipment": "standard",
        "weapons": "standard",
        "training": "basic",
        "troopCount": 300
      },
      {
        "type": "battleCruiser",
        "planet": "Alpha"
      }
    ],

    "enemyStartingUnits": [
      {
        "type": "platoon",
        "planet": "Gamma",
        "equipment": "standard",
        "weapons": "standard",
        "training": "standard",
        "troopCount": 500
      },
      {
        "type": "platoon",
        "planet": "Delta",
        "equipment": "standard",
        "weapons": "standard",
        "training": "standard",
        "troopCount": 500
      },
      {
        "type": "platoon",
        "planet": "Epsilon",
        "equipment": "advanced",
        "weapons": "advanced",
        "training": "advanced",
        "troopCount": 600
      },
      {
        "type": "battleCruiser",
        "planet": "Gamma"
      },
      {
        "type": "battleCruiser",
        "planet": "Delta"
      },
      {
        "type": "bomber",
        "planet": "Epsilon"
      }
    ],

    "playerStartingBuildings": [
      { "planet": "Alpha", "building": "DefenseGrid" },
      { "planet": "Beta", "building": "MiningStation" }
    ],

    "enemyStartingBuildings": [
      { "planet": "Gamma", "building": "Starport" },
      { "planet": "Delta", "building": "Factory" },
      { "planet": "Epsilon", "building": "ResearchLab" }
    ]
  },

  "victoryConditions": {
    "type": "survival",
    "target": "Hold at least one planet for 10 turns",
    "turns": 10,
    "minimumPlanets": 1
  },

  "starTargets": {
    "threeStars": 600,
    "twoStars": 900
  },

  "metadata": {
    "author": "Overlord Team",
    "version": "1.0.0",
    "tags": ["defensive", "survival", "difficult"]
  }
}
```

**Tactical Design Choices:**
- **Asymmetric forces:** Enemy has 3 planets vs player's 2
- **Superior enemy:** Better equipment, more troops
- **Time pressure:** Must survive 10 turns (aggressive AI will attack)
- **Strategic decisions:** Build defenses or counterattack?
- **Multiple paths to victory:** Survive (primary) or destroy all (secondary)

---

### Step 3: Balance the Challenge

**Playtesting Checklist:**
- [ ] Scenario completable by skilled player (not impossible)
- [ ] Requires strategic thinking (not trivial)
- [ ] Multiple viable strategies exist
- [ ] Star targets achievable (3-star = expert play, 2-star = competent)
- [ ] Difficulty rating accurate (easy/medium/hard matches experience)

**Balancing Guidelines:**

| Difficulty | Player Advantage | Enemy Advantage | Strategic Depth |
|------------|------------------|------------------|-----------------|
| Easy | Superior forces | Weak AI | One obvious strategy |
| Medium | Equal forces | Equal AI | 2-3 viable strategies |
| Hard | Inferior forces | Superior AI | Multiple required tactics |

**Common Balance Mistakes:**
- Too much randomness (combat RNG swings victory)
- No viable strategy (player always loses)
- Too easy (player always wins)
- Unclear objectives (player doesn't know what to do)

---

## Scenario Templates

### Template 1: Basic Tutorial

**Use Case:** Teach single mechanic (buildings, combat, navigation)

```json
{
  "scenarioId": "tutorial-XX-topic-name",
  "name": "Topic Name Tutorial",
  "type": "tutorial",
  "difficulty": "easy",
  "duration": "5-10 min",
  "description": "Learn [specific mechanic].",

  "objectives": {
    "primary": "[Complete simple task]",
    "secondary": ["[Bonus objective 1]", "[Bonus objective 2]"]
  },

  "initialSetup": {
    "playerPlanets": ["Alpha"],
    "enemyPlanets": ["Beta"],
    "playerResources": {
      "credits": 10000,
      "minerals": 5000,
      "fuel": 3000,
      "food": 2000,
      "energy": 2000
    },
    "playerStartingUnits": [
      { "type": "platoon", "planet": "Alpha", "equipment": "standard", "weapons": "standard", "training": "standard", "troopCount": 300 }
    ]
  },

  "victoryConditions": {
    "type": "capture",
    "target": "Capture Planet Beta"
  },

  "starTargets": {
    "threeStars": 300,
    "twoStars": 600
  },

  "tutorialSteps": [
    { "stepId": 1, "title": "[Step 1]", "message": "[Instructions]", "highlightElement": "[element-id]", "requiredAction": "[action]", "nextStepTrigger": "[trigger]" }
  ]
}
```

---

### Template 2: Defensive Stand

**Use Case:** Survive against superior enemy

```json
{
  "scenarioId": "tactical-XX-defensive-name",
  "name": "Defensive Scenario Name",
  "type": "tactical",
  "difficulty": "medium",
  "duration": "10-15 min",
  "description": "Hold your ground against overwhelming odds.",

  "objectives": {
    "primary": "Survive for [X] turns with at least one planet",
    "secondary": ["Destroy all attackers", "Keep all planets"]
  },

  "initialSetup": {
    "playerPlanets": ["Alpha", "Beta"],
    "enemyPlanets": ["Gamma", "Delta", "Epsilon"],
    "playerResources": { "credits": 8000, "minerals": 4000, "fuel": 2000, "food": 1000, "energy": 1000 },
    "enemyResources": { "credits": 20000, "minerals": 10000, "fuel": 5000, "food": 3000, "energy": 3000 },
    "playerStartingUnits": [
      { "type": "platoon", "planet": "Alpha", "equipment": "advanced", "weapons": "advanced", "training": "standard", "troopCount": 400 }
    ],
    "enemyStartingUnits": [
      { "type": "platoon", "planet": "Gamma", "equipment": "standard", "weapons": "standard", "training": "standard", "troopCount": 500 }
    ]
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

---

### Template 3: Resource Rush

**Use Case:** Economic challenge, capture resources quickly

```json
{
  "scenarioId": "tactical-XX-economic-name",
  "name": "Economic Scenario Name",
  "type": "tactical",
  "difficulty": "hard",
  "duration": "15-20 min",
  "description": "Capture mineral-rich planets before the enemy.",

  "objectives": {
    "primary": "Reach 50,000 minerals before the AI",
    "secondary": ["Reach target in under 10 turns", "Capture all neutral planets"]
  },

  "initialSetup": {
    "playerPlanets": ["Alpha"],
    "enemyPlanets": ["Omega"],
    "neutralPlanets": ["Beta", "Gamma", "Delta"],
    "playerResources": { "credits": 5000, "minerals": 1000, "fuel": 1000, "food": 1000, "energy": 1000 },
    "enemyResources": { "credits": 5000, "minerals": 1000, "fuel": 1000, "food": 1000, "energy": 1000 },
    "playerStartingUnits": [
      { "type": "scout", "planet": "Alpha" }
    ],
    "enemyStartingUnits": [
      { "type": "scout", "planet": "Omega" }
    ]
  },

  "victoryConditions": {
    "type": "economic",
    "resourceTarget": { "credits": 0, "minerals": 50000, "fuel": 0, "food": 0, "energy": 0 }
  },

  "starTargets": {
    "threeStars": 600,
    "twoStars": 900
  }
}
```

---

## Common Scenarios to Create

### Tutorial Scenarios (3 minimum)

1. **Tutorial 01: Basic Combat**
   - Commission platoons
   - Load onto Battle Cruiser
   - Navigate to enemy planet
   - Execute invasion
   - **Star Targets:** 300s (3★), 600s (2★)

2. **Tutorial 02: Planetary Management**
   - Build Mining Station (mineral income)
   - Build Factory (production speed)
   - Manage resources
   - Commission platoon with buildings
   - **Star Targets:** 400s (3★), 700s (2★)

3. **Tutorial 03: Fleet Operations**
   - Purchase Scout (reconnaissance)
   - Purchase Battle Cruiser (transport)
   - Navigate between planets
   - Load/unload platoons
   - **Star Targets:** 350s (3★), 650s (2★)

---

### Tactical Scenarios (4-6 recommended)

1. **Tactical 01: Defend the Colony**
   - **Theme:** Defensive survival
   - **Difficulty:** Medium
   - **Duration:** 10-15 min
   - **Star Targets:** 600s (3★), 900s (2★)

2. **Tactical 02: Resource Rush**
   - **Theme:** Economic race
   - **Difficulty:** Medium
   - **Duration:** 15-20 min
   - **Star Targets:** 700s (3★), 1000s (2★)

3. **Tactical 03: Fleet Superiority**
   - **Theme:** Space combat focus
   - **Difficulty:** Hard
   - **Duration:** 10-15 min
   - **Star Targets:** 500s (3★), 800s (2★)

4. **Tactical 04: Time Trial**
   - **Theme:** Capture all planets quickly
   - **Difficulty:** Easy
   - **Duration:** 5-10 min
   - **Star Targets:** 300s (3★), 500s (2★)

5. **Tactical 05: Guerrilla Warfare**
   - **Theme:** Win with limited forces
   - **Difficulty:** Hard
   - **Duration:** 15-20 min
   - **Star Targets:** 800s (3★), 1200s (2★)

6. **Tactical 06: Economic Victory**
   - **Theme:** Reach resource thresholds
   - **Difficulty:** Medium
   - **Duration:** 10-15 min
   - **Star Targets:** 600s (3★), 900s (2★)

---

## Validation & Testing

### JSON Validation

**Tools:**
- Online: https://jsonlint.com/
- CLI: `npm install -g jsonlint` → `jsonlint scenario.json`

**Common Errors:**
- Missing commas
- Trailing commas (not allowed in JSON)
- Unquoted keys
- Wrong data types (string vs number)

---

### Playtesting Checklist

**Before Submitting:**
- [ ] JSON validates (no syntax errors)
- [ ] Scenario loads in game
- [ ] Victory conditions trigger correctly
- [ ] Star targets achievable (test multiple times)
- [ ] Difficulty rating matches experience
- [ ] Objectives clear and unambiguous
- [ ] No game-breaking bugs (stuck states, crashes)

**Playtesting Process:**
1. Load scenario in game
2. Play through to completion (3-5 times)
3. Try different strategies
4. Verify star targets (speedrun for 3-star)
5. Check edge cases (what if player does nothing?)
6. Adjust balance if needed

---

## File Organization

**Recommended Structure:**

```
Overlord.Phaser/
├── public/
│   └── assets/
│       └── data/
│           ├── scenarios/
│           │   ├── tutorial-01-basic-combat.json
│           │   ├── tutorial-02-planetary-mgmt.json
│           │   ├── tutorial-03-fleet-ops.json
│           │   ├── tactical-01-defend-colony.json
│           │   ├── tactical-02-resource-rush.json
│           │   └── ...
│           └── schemas/
│               └── scenario-schema.json
```

**File Naming Convention:**
- Tutorials: `tutorial-XX-short-name.json` (XX = 01, 02, 03...)
- Tactical: `tactical-XX-short-name.json`
- Use kebab-case (lowercase, hyphens)
- Match scenarioId in JSON

---

## Next Steps

After creating scenarios:
1. Validate JSON syntax (JSONLint)
2. Playtest thoroughly (3-5 complete runs)
3. Adjust balance based on feedback
4. Commit to git repository
5. Update scenario list (if needed)

**Related Guides:**
- [04: Scenario Pack Creation](04-scenario-pack-creation.md) - AI configuration packs
- [05: Content Creation Guide](05-content-creation-guide.md) - General workflows
- [08: Contributing Guide](08-contributing-guide.md) - Git workflow

---

**Chapter Status:** Complete
**Templates Provided:** 3 (Tutorial, Defensive, Economic)
**Example Scenarios:** 6 detailed examples
**Validation Tools:** JSONLint, playtesting checklist
**File Organization:** Documented
