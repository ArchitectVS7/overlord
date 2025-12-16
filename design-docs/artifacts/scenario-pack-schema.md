# Scenario Pack JSON Schema

**Version:** 1.0.0
**Date:** 2025-12-09
**Author:** Venomous
**Status:** Draft

---

## Overview

This document defines the JSON schema for Scenario Packs in Overlord. Scenario Packs enable data-driven extensibility by allowing hot-swappable AI configurations, galaxy templates, and enemy faction profiles without code changes.

**Purpose:**
- **FR34 Compliance:** System can load scenario pack configurations from JSON data files
- **NFR-S3 Compliance:** Scenario pack JSON must be validated against schema before loading
- **Extensibility:** Enable community-created content and unlimited strategic variations

**Scenario Pack vs Flash Conflict:**
- **Scenario Pack:** Defines the campaign-level configuration (AI personality, galaxy layout, resources, enemy faction profile)
- **Flash Conflict:** Defines a specific tactical challenge with pre-configured initial state and victory conditions
- **Relationship:** Flash Conflicts can reference Scenario Packs for their AI and galaxy configuration

---

## Schema Version Strategy

**Schema Versioning:**
- Field: `schema_version` (string, required)
- Format: Semantic Versioning (e.g., `"1.0.0"`)
- Compatibility: Breaking changes increment major version, backward-compatible changes increment minor version

**Example:**
```json
{
  "schema_version": "1.0.0",
  "pack_id": "default_balanced",
  ...
}
```

**Version Compatibility Table:**

| Schema Version | Game Version | Breaking Changes |
|----------------|--------------|------------------|
| 1.0.0          | 0.1.0+       | Initial schema   |
| 1.1.0          | 0.2.0+       | Added optional `lore.backstory` field |
| 2.0.0          | 1.0.0+       | Changed `ai_config.aggression_curve` from number to object |

**Validation Strategy:**
- Game validates `schema_version` matches supported versions (major version must match)
- Unsupported schema versions display error: `"Scenario pack requires schema version X.Y.Z, but game supports A.B.C"`
- Future-proof: Game ignores unknown optional fields (forward compatibility)

---

## JSON Schema Definition

**Specification:** JSON Schema Draft-07
**Validation Library:** ajv (JavaScript), jsonschema (Python)

### Root Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://overlord-game.com/schemas/scenario-pack/v1.0.0.json",
  "title": "Overlord Scenario Pack",
  "description": "Defines an AI opponent faction with personality, galaxy layout, and visual theme",
  "type": "object",
  "required": [
    "schema_version",
    "pack_id",
    "name",
    "version",
    "faction",
    "ai_config",
    "galaxy_template"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
      "description": "Semantic version of the schema this pack conforms to",
      "examples": ["1.0.0"]
    },
    "pack_id": {
      "type": "string",
      "pattern": "^[a-z0-9_]+$",
      "minLength": 3,
      "maxLength": 50,
      "description": "Unique identifier for this scenario pack (snake_case)",
      "examples": ["default_balanced", "warmonger_kratos", "economic_midas"]
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Human-readable display name for the scenario pack",
      "examples": ["Balanced AI (General Nexus)", "Warmonger AI (Commander Kratos)"]
    },
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
      "description": "Version of this specific scenario pack content",
      "examples": ["1.0.0", "1.2.3"]
    },
    "description": {
      "type": "string",
      "maxLength": 500,
      "description": "Optional short description of the scenario pack (displayed in browser UI)",
      "examples": ["A balanced AI opponent suitable for learning the game. General Nexus employs mixed strategies."]
    },
    "author": {
      "type": "string",
      "maxLength": 100,
      "description": "Optional creator name (for community-created packs)",
      "examples": ["Venomous", "Community Contributor"]
    },
    "difficulty": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced", "expert"],
      "description": "Recommended difficulty level for this scenario pack",
      "default": "intermediate"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z0-9_]+$",
        "maxLength": 30
      },
      "maxItems": 10,
      "description": "Optional searchable tags (e.g., 'aggressive', 'tutorial', 'lore_heavy')",
      "examples": [["aggressive", "military_focused"], ["economic", "builder"]]
    },
    "icon_url": {
      "type": "string",
      "format": "uri",
      "description": "Optional URL to faction icon/portrait (256x256 PNG recommended)",
      "examples": ["https://overlord-game.com/assets/factions/general_nexus.png"]
    },
    "faction": {
      "$ref": "#/definitions/Faction"
    },
    "ai_config": {
      "$ref": "#/definitions/AIConfig"
    },
    "galaxy_template": {
      "$ref": "#/definitions/GalaxyTemplate"
    }
  },
  "definitions": {
    "Faction": {
      "type": "object",
      "required": ["faction_id", "display_name"],
      "properties": {
        "faction_id": {
          "type": "string",
          "pattern": "^[a-z0-9_]+$",
          "description": "Unique identifier for this faction",
          "examples": ["general_nexus", "commander_kratos", "magistrate_midas"]
        },
        "display_name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100,
          "description": "Full name/title of the AI faction leader",
          "examples": ["General Nexus", "Commander Kratos", "Magistrate Midas"]
        },
        "species": {
          "type": "string",
          "maxLength": 50,
          "description": "Optional alien species name",
          "examples": ["Synthetic Intelligence", "Kreelon Warlords", "Aurelian Traders"]
        },
        "lore": {
          "type": "object",
          "properties": {
            "tagline": {
              "type": "string",
              "maxLength": 200,
              "description": "Short one-line description",
              "examples": ["A balanced AI strategist with no weaknesses", "Relentless military expansion at all costs"]
            },
            "backstory": {
              "type": "string",
              "maxLength": 2000,
              "description": "Optional detailed lore text (displayed in faction browser)",
              "examples": ["General Nexus is a synthetic intelligence created by the Terran Coalition..."]
            }
          }
        },
        "visual_theme": {
          "type": "object",
          "description": "Optional UI theming for this faction",
          "properties": {
            "primary_color": {
              "type": "string",
              "pattern": "^#[0-9A-Fa-f]{6}$",
              "description": "Primary faction color (hex code)",
              "examples": ["#4CAF50", "#F44336", "#FFC107"]
            },
            "secondary_color": {
              "type": "string",
              "pattern": "^#[0-9A-Fa-f]{6}$",
              "description": "Secondary accent color",
              "examples": ["#81C784", "#E57373", "#FFD54F"]
            },
            "icon_style": {
              "type": "string",
              "enum": ["military", "economic", "balanced", "alien"],
              "description": "Icon theme for UI elements"
            }
          }
        }
      }
    },
    "AIConfig": {
      "type": "object",
      "required": ["personality", "difficulty"],
      "properties": {
        "personality": {
          "type": "string",
          "enum": ["aggressive", "defensive", "economic", "balanced"],
          "description": "Core AI personality type (matches AIDecisionSystem.ts)"
        },
        "difficulty": {
          "type": "string",
          "enum": ["easy", "normal", "hard"],
          "description": "AI difficulty level"
        },
        "aggression_modifier": {
          "type": "number",
          "minimum": 0.0,
          "maximum": 2.0,
          "default": 1.0,
          "description": "Multiplier for AI aggression (1.0 = normal, 1.5 = 50% more aggressive)"
        },
        "economic_focus": {
          "type": "number",
          "minimum": 0.0,
          "maximum": 1.0,
          "default": 0.5,
          "description": "Economic building priority (0.0 = military only, 1.0 = economic only)"
        },
        "expansion_priority": {
          "type": "number",
          "minimum": 0.0,
          "maximum": 1.0,
          "default": 0.5,
          "description": "Expansion vs consolidation balance (0.0 = defend existing, 1.0 = always expand)"
        },
        "tech_priority": {
          "type": "number",
          "minimum": 0.0,
          "maximum": 1.0,
          "default": 0.5,
          "description": "Tech upgrade priority (0.0 = quantity over quality, 1.0 = quality over quantity)"
        },
        "risk_tolerance": {
          "type": "number",
          "minimum": 0.0,
          "maximum": 1.0,
          "default": 0.5,
          "description": "Willingness to take risky actions (0.0 = cautious, 1.0 = reckless)"
        },
        "decision_weights": {
          "type": "object",
          "description": "Optional custom weights for AI decision priorities",
          "properties": {
            "defense": {
              "type": "integer",
              "minimum": 0,
              "maximum": 100,
              "default": 40
            },
            "military": {
              "type": "integer",
              "minimum": 0,
              "maximum": 100,
              "default": 30
            },
            "economy": {
              "type": "integer",
              "minimum": 0,
              "maximum": 100,
              "default": 20
            },
            "attack": {
              "type": "integer",
              "minimum": 0,
              "maximum": 100,
              "default": 10
            }
          }
        }
      }
    },
    "GalaxyTemplate": {
      "type": "object",
      "required": ["planet_count", "seed"],
      "properties": {
        "planet_count": {
          "type": "integer",
          "minimum": 4,
          "maximum": 6,
          "description": "Number of planets in the galaxy (original game: 4-6)"
        },
        "seed": {
          "type": "integer",
          "minimum": 0,
          "maximum": 2147483647,
          "description": "Deterministic RNG seed for galaxy generation (0 = random)"
        },
        "planet_types": {
          "type": "object",
          "description": "Optional distribution of planet types",
          "properties": {
            "desert": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0,
              "description": "Probability of desert planets (0.0-1.0)"
            },
            "volcanic": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0,
              "description": "Probability of volcanic planets"
            },
            "ice": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0,
              "description": "Probability of ice planets"
            },
            "terran": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0,
              "description": "Probability of terran (earth-like) planets"
            },
            "gas_giant": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0,
              "description": "Probability of gas giant planets"
            }
          }
        },
        "resource_abundance": {
          "type": "string",
          "enum": ["scarce", "standard", "abundant", "unlimited"],
          "default": "standard",
          "description": "Global resource availability modifier"
        },
        "resource_modifiers": {
          "type": "object",
          "description": "Optional fine-grained resource multipliers",
          "properties": {
            "credits": {
              "type": "number",
              "minimum": 0.1,
              "maximum": 10.0,
              "default": 1.0,
              "description": "Credits generation multiplier"
            },
            "minerals": {
              "type": "number",
              "minimum": 0.1,
              "maximum": 10.0,
              "default": 1.0,
              "description": "Minerals generation multiplier"
            },
            "fuel": {
              "type": "number",
              "minimum": 0.1,
              "maximum": 10.0,
              "default": 1.0,
              "description": "Fuel generation multiplier"
            },
            "food": {
              "type": "number",
              "minimum": 0.1,
              "maximum": 10.0,
              "default": 1.0,
              "description": "Food generation multiplier"
            },
            "energy": {
              "type": "number",
              "minimum": 0.1,
              "maximum": 10.0,
              "default": 1.0,
              "description": "Energy generation multiplier"
            }
          }
        },
        "starting_resources": {
          "type": "object",
          "description": "Optional custom starting resources for player and AI",
          "properties": {
            "player": {
              "$ref": "#/definitions/ResourceSet"
            },
            "ai": {
              "$ref": "#/definitions/ResourceSet"
            }
          }
        },
        "custom_planets": {
          "type": "array",
          "maxItems": 6,
          "description": "Optional explicit planet definitions (overrides procedural generation)",
          "items": {
            "$ref": "#/definitions/PlanetDefinition"
          }
        }
      }
    },
    "ResourceSet": {
      "type": "object",
      "properties": {
        "credits": {
          "type": "integer",
          "minimum": 0,
          "maximum": 1000000
        },
        "minerals": {
          "type": "integer",
          "minimum": 0,
          "maximum": 1000000
        },
        "fuel": {
          "type": "integer",
          "minimum": 0,
          "maximum": 1000000
        },
        "food": {
          "type": "integer",
          "minimum": 0,
          "maximum": 1000000
        },
        "energy": {
          "type": "integer",
          "minimum": 0,
          "maximum": 1000000
        }
      }
    },
    "PlanetDefinition": {
      "type": "object",
      "required": ["name", "type", "position"],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50,
          "description": "Planet name"
        },
        "type": {
          "type": "string",
          "enum": ["desert", "volcanic", "ice", "terran", "gas_giant"],
          "description": "Planet type"
        },
        "position": {
          "type": "object",
          "required": ["x", "y", "z"],
          "properties": {
            "x": {
              "type": "number"
            },
            "y": {
              "type": "number"
            },
            "z": {
              "type": "number"
            }
          }
        },
        "initial_owner": {
          "type": "string",
          "enum": ["player", "ai", "neutral"],
          "description": "Starting ownership"
        },
        "resource_richness": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 5.0,
          "default": 1.0,
          "description": "Planet-specific resource multiplier"
        }
      }
    }
  }
}
```

---

## Validation Rules

### Schema-Level Validation

1. **Required Fields:**
   - All fields marked `"required": true` must be present
   - Missing required fields trigger validation error: `"Missing required field: {field_name}"`

2. **Type Validation:**
   - All fields must match declared types (string, number, integer, boolean, object, array)
   - Type mismatches trigger: `"Field '{field_name}' must be of type {expected_type}"`

3. **Pattern Validation:**
   - `pack_id` must match `^[a-z0-9_]+$` (snake_case, lowercase, alphanumeric + underscore)
   - `schema_version` and `version` must match semantic versioning pattern `^[0-9]+\.[0-9]+\.[0-9]+$`
   - Hex colors must match `^#[0-9A-Fa-f]{6}$`

4. **Range Validation:**
   - Numbers with `minimum`/`maximum` constraints must be within range
   - String lengths must respect `minLength`/`maxLength`
   - Arrays must respect `maxItems`

5. **Enum Validation:**
   - Enum fields must match one of the allowed values exactly
   - Invalid enum triggers: `"Field '{field_name}' must be one of: {allowed_values}"`

### Business Logic Validation

1. **Planet Type Distribution:**
   - If `planet_types` is specified, sum of all probabilities should equal 1.0 (±0.01 tolerance)
   - Warning (non-blocking): `"Planet type probabilities sum to {sum}, expected 1.0"`

2. **Decision Weights:**
   - If `ai_config.decision_weights` is specified, sum should equal 100
   - Warning (non-blocking): `"Decision weights sum to {sum}, expected 100"`

3. **Custom Planets:**
   - If `custom_planets` is specified, array length must equal `planet_count`
   - Error: `"custom_planets array length ({length}) must match planet_count ({count})"`

4. **Seed Validation:**
   - Seed value 0 is special (random generation)
   - Non-zero seeds must produce deterministic results (validated by tests)

### Cross-Field Validation

1. **Personality Consistency:**
   - `ai_config.personality = "aggressive"` should have `aggression_modifier >= 1.0` (recommendation)
   - `ai_config.personality = "defensive"` should have `aggression_modifier <= 1.0` (recommendation)
   - These are warnings, not errors (allow creative configurations)

2. **Difficulty Modifiers:**
   - `difficulty = "easy"` should have lower AI modifiers
   - `difficulty = "hard"` should have higher AI modifiers
   - Warning only (allow experimentation)

---

## Example Files

### Example 1: Minimal Scenario Pack

**Filename:** `default_balanced.json`

```json
{
  "schema_version": "1.0.0",
  "pack_id": "default_balanced",
  "name": "Balanced AI (General Nexus)",
  "version": "1.0.0",
  "description": "A balanced AI opponent suitable for learning the game. General Nexus employs mixed strategies with no particular weakness.",
  "difficulty": "intermediate",
  "faction": {
    "faction_id": "general_nexus",
    "display_name": "General Nexus",
    "species": "Synthetic Intelligence",
    "lore": {
      "tagline": "A balanced AI strategist with no weaknesses"
    }
  },
  "ai_config": {
    "personality": "balanced",
    "difficulty": "normal"
  },
  "galaxy_template": {
    "planet_count": 5,
    "seed": 42,
    "resource_abundance": "standard"
  }
}
```

### Example 2: Full-Featured Scenario Pack

**Filename:** `warmonger_kratos.json`

```json
{
  "schema_version": "1.0.0",
  "pack_id": "warmonger_kratos",
  "name": "Warmonger AI (Commander Kratos)",
  "version": "1.2.0",
  "description": "Face the relentless military might of Commander Kratos. This aggressive AI prioritizes military expansion and early attacks. Recommended for experienced players seeking a challenge.",
  "author": "Venomous",
  "difficulty": "advanced",
  "tags": ["aggressive", "military_focused", "early_game_pressure"],
  "icon_url": "https://overlord-game.com/assets/factions/commander_kratos.png",
  "faction": {
    "faction_id": "commander_kratos",
    "display_name": "Commander Kratos",
    "species": "Kreelon Warlords",
    "lore": {
      "tagline": "Relentless military expansion at all costs",
      "backstory": "Commander Kratos leads the Kreelon Warlords, a militaristic species that values conquest above all else. The Kreelons believe that strength through warfare is the only path to galactic dominance. Kratos himself earned his rank by conquering 47 star systems in under 5 standard years, a record that still stands in Kreelon military history.\n\nUnder Kratos's command, every resource is channeled into military production. Civilian infrastructure is minimal—only enough to sustain the war machine. His fleets strike early and often, using overwhelming force to crush resistance before enemies can mount effective defenses.\n\nKratos's tactical doctrine is simple but effective: identify the weakest target, mass forces, strike decisively, and move to the next target without pause. Diplomacy is seen as weakness. Retreat is forbidden. Only total victory is acceptable."
    },
    "visual_theme": {
      "primary_color": "#F44336",
      "secondary_color": "#E57373",
      "icon_style": "military"
    }
  },
  "ai_config": {
    "personality": "aggressive",
    "difficulty": "hard",
    "aggression_modifier": 1.8,
    "economic_focus": 0.2,
    "expansion_priority": 0.9,
    "tech_priority": 0.3,
    "risk_tolerance": 0.85,
    "decision_weights": {
      "defense": 10,
      "military": 50,
      "economy": 15,
      "attack": 25
    }
  },
  "galaxy_template": {
    "planet_count": 4,
    "seed": 12345,
    "planet_types": {
      "desert": 0.1,
      "volcanic": 0.5,
      "ice": 0.2,
      "terran": 0.1,
      "gas_giant": 0.1
    },
    "resource_abundance": "abundant",
    "resource_modifiers": {
      "credits": 1.0,
      "minerals": 1.8,
      "fuel": 1.2,
      "food": 0.8,
      "energy": 1.0
    },
    "starting_resources": {
      "player": {
        "credits": 1000,
        "minerals": 500,
        "fuel": 300,
        "food": 400,
        "energy": 300
      },
      "ai": {
        "credits": 1200,
        "minerals": 800,
        "fuel": 500,
        "food": 300,
        "energy": 400
      }
    }
  }
}
```

### Example 3: Economic Focus Scenario Pack

**Filename:** `economic_midas.json`

```json
{
  "schema_version": "1.0.0",
  "pack_id": "economic_midas",
  "name": "Economic AI (Magistrate Midas)",
  "version": "1.0.0",
  "description": "Magistrate Midas prioritizes economic development and technological advancement. This builder AI focuses on long-term growth over early aggression, creating a slow-burn challenge for patient strategists.",
  "difficulty": "intermediate",
  "tags": ["economic", "builder", "late_game_challenge"],
  "faction": {
    "faction_id": "magistrate_midas",
    "display_name": "Magistrate Midas",
    "species": "Aurelian Traders",
    "lore": {
      "tagline": "Prosperity through commerce and technological superiority",
      "backstory": "The Aurelian Traders are a mercantile species that values wealth accumulation and technological advancement. Magistrate Midas is their most successful leader, having transformed the Aurelian economy into the galaxy's most productive industrial complex."
    },
    "visual_theme": {
      "primary_color": "#FFC107",
      "secondary_color": "#FFD54F",
      "icon_style": "economic"
    }
  },
  "ai_config": {
    "personality": "economic",
    "difficulty": "normal",
    "aggression_modifier": 0.5,
    "economic_focus": 0.9,
    "expansion_priority": 0.3,
    "tech_priority": 0.85,
    "risk_tolerance": 0.2,
    "decision_weights": {
      "defense": 30,
      "military": 10,
      "economy": 50,
      "attack": 10
    }
  },
  "galaxy_template": {
    "planet_count": 6,
    "seed": 99999,
    "resource_abundance": "abundant",
    "resource_modifiers": {
      "credits": 1.5,
      "minerals": 1.2,
      "fuel": 1.0,
      "food": 1.3,
      "energy": 1.4
    }
  }
}
```

---

## Integration Guide

### Loading Scenario Packs

**TypeScript Implementation (Overlord.Phaser):**

```typescript
// src/core/ScenarioPackLoader.ts
import Ajv from 'ajv';
import scenarioPackSchema from './schemas/scenario-pack-schema.json';

export interface ScenarioPack {
  schema_version: string;
  pack_id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags?: string[];
  icon_url?: string;
  faction: Faction;
  ai_config: AIConfig;
  galaxy_template: GalaxyTemplate;
}

export class ScenarioPackLoader {
  private ajv: Ajv;
  private validator: any;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.validator = this.ajv.compile(scenarioPackSchema);
  }

  /**
   * Load and validate a scenario pack from JSON
   * @throws {Error} If validation fails
   */
  public loadPack(jsonData: string): ScenarioPack {
    // Parse JSON
    let pack: any;
    try {
      pack = JSON.parse(jsonData);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }

    // Validate against schema
    const valid = this.validator(pack);
    if (!valid) {
      const errors = this.validator.errors
        .map((err: any) => `${err.dataPath} ${err.message}`)
        .join(', ');
      throw new Error(`Schema validation failed: ${errors}`);
    }

    // Check schema version compatibility
    const [major] = pack.schema_version.split('.').map(Number);
    const SUPPORTED_MAJOR_VERSION = 1;
    if (major !== SUPPORTED_MAJOR_VERSION) {
      throw new Error(
        `Unsupported schema version ${pack.schema_version}. Game supports v${SUPPORTED_MAJOR_VERSION}.x.x`
      );
    }

    // Business logic validation
    this.validateBusinessRules(pack);

    return pack as ScenarioPack;
  }

  private validateBusinessRules(pack: any): void {
    // Validate custom_planets count matches planet_count
    if (pack.galaxy_template.custom_planets) {
      if (pack.galaxy_template.custom_planets.length !== pack.galaxy_template.planet_count) {
        throw new Error(
          `custom_planets array length (${pack.galaxy_template.custom_planets.length}) must match planet_count (${pack.galaxy_template.planet_count})`
        );
      }
    }

    // Validate planet type distribution sums to ~1.0
    if (pack.galaxy_template.planet_types) {
      const sum = Object.values(pack.galaxy_template.planet_types).reduce(
        (acc: number, val: any) => acc + val,
        0
      );
      if (Math.abs(sum - 1.0) > 0.01) {
        console.warn(
          `Planet type probabilities sum to ${sum.toFixed(2)}, expected 1.0`
        );
      }
    }

    // Validate decision weights sum to 100
    if (pack.ai_config.decision_weights) {
      const sum = Object.values(pack.ai_config.decision_weights).reduce(
        (acc: number, val: any) => acc + val,
        0
      );
      if (sum !== 100) {
        console.warn(`Decision weights sum to ${sum}, expected 100`);
      }
    }
  }
}
```

### Using Scenario Packs in Game

```typescript
// Example: Load scenario pack and configure game
import { ScenarioPackLoader } from './ScenarioPackLoader';
import { GameState } from './GameState';
import { GalaxyGenerator } from './GalaxyGenerator';
import { AIDecisionSystem } from './AIDecisionSystem';

const loader = new ScenarioPackLoader();

// Load from local file or Supabase
const packJson = await fetch('/assets/packs/warmonger_kratos.json').then(r => r.text());
const pack = loader.loadPack(packJson);

// Initialize game state with scenario pack
const gameState = new GameState();
const generator = new GalaxyGenerator();

// Generate galaxy from template
const galaxy = generator.generateGalaxyFromTemplate(
  pack.galaxy_template.planet_count,
  pack.galaxy_template.seed,
  pack.galaxy_template.planet_types,
  pack.galaxy_template.resource_abundance
);

// Configure AI with scenario pack settings
const aiSystem = new AIDecisionSystem(
  gameState,
  pack.ai_config.personality,
  pack.ai_config.difficulty
);
aiSystem.applyModifiers({
  aggressionModifier: pack.ai_config.aggression_modifier,
  economicFocus: pack.ai_config.economic_focus,
  expansionPriority: pack.ai_config.expansion_priority,
  techPriority: pack.ai_config.tech_priority,
  riskTolerance: pack.ai_config.risk_tolerance
});

// Start campaign with configured scenario pack
gameState.startCampaign(galaxy, pack);
```

---

## Storage and Distribution

### File Structure

**Local Development:**
```
Overlord.Phaser/
└── public/
    └── assets/
        └── packs/
            ├── default_balanced.json
            ├── warmonger_kratos.json
            ├── economic_midas.json
            └── defensive_bastion.json
```

**Supabase Storage (Production):**
```
bucket: scenario-packs
├── official/
│   ├── default_balanced.json
│   ├── warmonger_kratos.json
│   └── economic_midas.json
└── community/
    ├── user_12345/
    │   └── custom_pack_v1.json
    └── user_67890/
        └── experimental_ai.json
```

### Supabase Integration

**Table Schema:**
```sql
CREATE TABLE scenario_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  json_data JSONB NOT NULL,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pack_id ON scenario_packs(pack_id);
CREATE INDEX idx_author ON scenario_packs(author_id);
CREATE INDEX idx_rating ON scenario_packs(rating DESC);
```

**RLS Policies:**
```sql
-- Anyone can read official packs
CREATE POLICY "Official packs are publicly readable"
  ON scenario_packs FOR SELECT
  USING (author_id IS NULL OR author_id = '00000000-0000-0000-0000-000000000000');

-- Users can read their own packs
CREATE POLICY "Users can read own packs"
  ON scenario_packs FOR SELECT
  USING (auth.uid() = author_id);

-- Users can insert their own packs
CREATE POLICY "Users can create packs"
  ON scenario_packs FOR INSERT
  WITH CHECK (auth.uid() = author_id);
```

---

## Testing and Validation

### Unit Tests

**Test Coverage Requirements:**
- Schema validation: 100% (all field types, ranges, patterns)
- Business rules: 100% (planet count, distribution sums, weight sums)
- Error messages: 100% (meaningful error messages for all failure modes)

**Example Test Suite:**
```typescript
// tests/unit/ScenarioPackLoader.test.ts
import { ScenarioPackLoader } from '@core/ScenarioPackLoader';

describe('ScenarioPackLoader', () => {
  let loader: ScenarioPackLoader;

  beforeEach(() => {
    loader = new ScenarioPackLoader();
  });

  describe('Schema Validation', () => {
    test('should accept valid minimal pack', () => {
      const json = JSON.stringify({
        schema_version: '1.0.0',
        pack_id: 'test_pack',
        name: 'Test Pack',
        version: '1.0.0',
        faction: {
          faction_id: 'test_faction',
          display_name: 'Test Faction'
        },
        ai_config: {
          personality: 'balanced',
          difficulty: 'normal'
        },
        galaxy_template: {
          planet_count: 5,
          seed: 42
        }
      });

      expect(() => loader.loadPack(json)).not.toThrow();
    });

    test('should reject missing required field', () => {
      const json = JSON.stringify({
        schema_version: '1.0.0',
        pack_id: 'test_pack'
        // Missing name, version, faction, ai_config, galaxy_template
      });

      expect(() => loader.loadPack(json)).toThrow(/required/i);
    });

    test('should reject invalid pack_id pattern', () => {
      const json = JSON.stringify({
        schema_version: '1.0.0',
        pack_id: 'Invalid-Pack-ID', // Contains uppercase and hyphens
        name: 'Test Pack',
        version: '1.0.0',
        faction: { faction_id: 'test', display_name: 'Test' },
        ai_config: { personality: 'balanced', difficulty: 'normal' },
        galaxy_template: { planet_count: 5, seed: 42 }
      });

      expect(() => loader.loadPack(json)).toThrow(/pack_id.*pattern/i);
    });

    test('should reject invalid planet_count range', () => {
      const json = JSON.stringify({
        schema_version: '1.0.0',
        pack_id: 'test_pack',
        name: 'Test Pack',
        version: '1.0.0',
        faction: { faction_id: 'test', display_name: 'Test' },
        ai_config: { personality: 'balanced', difficulty: 'normal' },
        galaxy_template: {
          planet_count: 10, // Invalid: max is 6
          seed: 42
        }
      });

      expect(() => loader.loadPack(json)).toThrow(/planet_count/i);
    });
  });

  describe('Business Logic Validation', () => {
    test('should warn if planet type distribution does not sum to 1.0', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const json = JSON.stringify({
        schema_version: '1.0.0',
        pack_id: 'test_pack',
        name: 'Test Pack',
        version: '1.0.0',
        faction: { faction_id: 'test', display_name: 'Test' },
        ai_config: { personality: 'balanced', difficulty: 'normal' },
        galaxy_template: {
          planet_count: 5,
          seed: 42,
          planet_types: {
            desert: 0.3,
            volcanic: 0.3,
            ice: 0.3
            // Sum = 0.9, not 1.0
          }
        }
      });

      loader.loadPack(json);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Planet type probabilities')
      );
      consoleWarnSpy.mockRestore();
    });
  });
});
```

### Integration Tests

**Test Scenarios:**
1. Load official packs from Supabase
2. Validate community-created packs before allowing upload
3. Generate galaxies from scenario pack templates
4. Configure AI systems with scenario pack settings
5. Verify scenario pack switching updates game state correctly

---

## Changelog

### Version 1.0.0 (2025-12-09)

**Initial Release:**
- Defined root schema with required/optional fields
- Added `Faction`, `AIConfig`, `GalaxyTemplate` definitions
- Defined validation rules (schema-level, business logic, cross-field)
- Created 3 example scenario packs (minimal, full-featured, economic)
- Documented integration guide and TypeScript implementation
- Defined Supabase storage structure and RLS policies
- Created test suite specifications

**Requirements Addressed:**
- ✅ FR34: System can load scenario pack configurations from JSON data files
- ✅ NFR-S3: Scenario pack JSON must be validated against schema before loading
- ✅ Implementation Readiness Report Action Item: Define Scenario Pack JSON Schema

---

## Future Enhancements (Post-v1.0.0)

**Potential Schema Extensions:**

1. **Advanced Galaxy Configuration (v1.1.0):**
   - Wormhole connections between planets
   - Asteroid fields and space phenomena
   - Dynamic events (meteor showers, alien artifacts)

2. **Diplomacy and Alliances (v2.0.0):**
   - Multi-faction scenarios (2+ AI opponents)
   - Alliance mechanics and trade agreements
   - Victory conditions beyond military conquest

3. **Custom Assets (v1.2.0):**
   - Sprite URLs for faction-specific ships and buildings
   - Audio URLs for faction-specific music and sound effects
   - Custom UI themes and icon packs

4. **Scenario Pack Metadata (v1.1.0):**
   - Steam Workshop integration fields
   - Update notifications and versioning
   - Dependency chains (pack A requires pack B)

**Breaking Changes Policy:**
- Major version increments (2.0.0) can introduce breaking schema changes
- Minor version increments (1.1.0) add optional fields only (backward compatible)
- Patch version increments (1.0.1) fix bugs without schema changes

---

## References

- **JSON Schema Specification:** [json-schema.org/draft-07](https://json-schema.org/draft-07/schema)
- **Ajv Validator:** [ajv.js.org](https://ajv.js.org/)
- **PRD:** `design-docs/artifacts/prd.md` (FR32-FR35, NFR-S3)
- **Epics:** `design-docs/artifacts/epics.md` (Epic 1: Flash Conflict System, Epic 8: Scenario Pack Hot-Swap System)
- **Implementation Readiness Report:** `design-docs/artifacts/implementation-readiness-report-2025-12-09.md`

---

## Implementation Status

**Status:** ✅ Implemented (v0.9.0-packs)

**Completed:**
1. ✅ Schema reviewed and finalized
2. ✅ `ScenarioPackManager.ts` implemented (52 tests)
3. ✅ `PackConfigLoader.ts` implemented (23 tests)
4. ✅ `PackMetadataHelper.ts` implemented (18 tests)
5. ✅ UI: PackListPanel, PackDetailPanel, PackSwitchDialog
6. ✅ ScenarioPackScene integrated with main menu

**Deferred to Post-MVP:**
- Scenario pack dependencies
- User-uploaded custom sprites/audio
- Versioning/update notification system
- Supabase integration for community packs

---

**Document Metadata:**
- **File:** `scenario-pack-schema.md`
- **Location:** `design-docs/artifacts/`
- **Created:** 2025-12-09
- **Last Updated:** 2025-12-16
- **Related Documents:** prd.md, epics.md, implementation-readiness-report-2025-12-09.md
