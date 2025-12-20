# Core Systems Reference

**Volume I - Chapter 3**
**Purpose:** Detailed explanation of all 18 platform-agnostic game systems

---

## Table of Contents

1. [State Management Systems](#state-management-systems)
2. [Economy Systems](#economy-systems)
3. [Entity Systems](#entity-systems)
4. [Infrastructure Systems](#infrastructure-systems)
5. [Combat Systems](#combat-systems)
6. [AI Systems](#ai-systems)
7. [Galaxy Systems](#galaxy-systems)

---

## Overview

The core game logic is organized into 18 platform-agnostic systems located in `Overlord.Phaser/src/core/`. Each system:

- Has **zero Phaser dependencies** (pure TypeScript business logic)
- Operates on `GameState` as the central data store
- Fires **callback events** for Phaser scenes to subscribe to
- Is **fully tested** (90%+ coverage for critical systems)
- Can be **ported to any rendering engine** (Unity, Godot, Native, etc.)

---

## State Management Systems

### 1. GameState (`GameState.ts`)

**Purpose:** Central container for all game state with O(1) entity lookups

**Location:** `src/core/GameState.ts`

**Core Responsibilities:**
- Store all entities (planets, craft, platoons)
- Maintain faction states (player vs AI)
- Provide O(1) lookups via Map structures
- Validate state consistency

**Key Data Structures:**

```typescript
export class GameState {
  // Turn tracking
  public currentTurn: number = 1;
  public currentPhase: TurnPhase = TurnPhase.Action;
  public lastActionTime: Date = new Date();

  // Campaign configuration
  public campaignConfig?: CampaignConfig;

  // Entity arrays (source of truth)
  public planets: PlanetEntity[] = [];
  public craft: CraftEntity[] = [];
  public platoons: PlatoonEntity[] = [];

  // Faction states
  public playerFaction: FactionState = new FactionState();
  public aiFaction: FactionState = new FactionState();

  // O(1) lookup maps (rebuilt after deserialization)
  public planetLookup: Map<number, PlanetEntity> = new Map();
  public craftLookup: Map<number, CraftEntity> = new Map();
  public platoonLookup: Map<number, PlatoonEntity> = new Map();
}
```

**Key Methods:**

```typescript
// Rebuild all lookup maps from entity arrays
// Call after loading a save or modifying arrays
public rebuildLookups(): void;

// Validate game state for consistency
// Returns true if valid, false otherwise
public validate(): boolean;
```

**Usage Example:**

```typescript
// Initialize game state
const gameState = new GameState();
gameState.planets = galaxy.planets;
gameState.rebuildLookups();

// O(1) planet lookup by ID
const planet = gameState.planetLookup.get(planetId);

// Validate before saving
if (!gameState.validate()) {
  throw new Error('Invalid game state');
}
```

**Validation Rules:**
- Maximum 6 planets (Proottype early - this is NOT a constraint for full game. Original game had more planets per level, for four enemies.)
- Turn number must be positive
- No duplicate entity IDs
- All faction-owned planet IDs must exist in planet array

---

### 2. SaveSystem (`SaveSystem.ts`)

**Purpose:** Platform-agnostic save/load with JSON serialization and checksum validation

**Location:** `src/core/SaveSystem.ts`

**Core Responsibilities:**
- Create save data snapshots with metadata
- Serialize GameState to JSON string
- Deserialize JSON back to SaveData
- Validate data integrity with checksums
- Apply loaded state to GameState

**Save Data Structure:**

```typescript
export interface SaveData {
  version: string;           // Game version (e.g., "0.1.0")
  savedAt: string;           // ISO timestamp
  turnNumber: number;        // Current turn
  playtime: number;          // Total playtime in seconds
  gameState: GameState;      // Full game state
  thumbnail?: string;        // Optional base64 PNG
  saveName?: string;         // Optional player-defined name
  victoryStatus: VictoryResult;
  checksum?: string;         // SHA256 for validation
}
```

**Key Methods:**

```typescript
// Create save data snapshot
public createSaveData(
  version: string,
  playtime: number,
  saveName?: string,
  thumbnail?: string
): SaveData;

// Serialize to JSON string
public serialize(saveData: SaveData): string;

// Deserialize from JSON string
public deserialize(json: string): SaveData;

// Apply save data to game state
public applyToGameState(saveData: SaveData): void;

// Calculate SHA256 checksum
public calculateChecksum(saveData: SaveData): string;

// Validate checksum integrity
public validateChecksum(saveData: SaveData): boolean;
```

**Save/Load Flow:**

```mermaid
graph LR
    A[GameState] --> B[createSaveData]
    B --> C[SaveData Object]
    C --> D[serialize]
    D --> E[JSON String]
    E --> F[Store to Supabase/LocalStorage]

    F --> G[Load JSON String]
    G --> H[deserialize]
    H --> I[SaveData Object]
    I --> J[validateChecksum]
    J --> K[applyToGameState]
    K --> L[GameState Restored]
```

**Usage Example:**

```typescript
// Saving
const saveSystem = new SaveSystem(gameState);
const saveData = saveSystem.createSaveData("0.1.0", 3600, "My Campaign");
const checksum = saveSystem.calculateChecksum(saveData);
saveData.checksum = checksum;
const json = saveSystem.serialize(saveData);
// Store json to Supabase or LocalStorage

// Loading
const json = /* load from storage */;
const saveData = saveSystem.deserialize(json);
if (saveSystem.validateChecksum(saveData)) {
  saveSystem.applyToGameState(saveData);
  gameState.rebuildLookups();
} else {
  throw new Error('Save data corrupted');
}
```

**Events:**

```typescript
public onSaveCompleted?: (saveData: SaveData) => void;
public onLoadCompleted?: (saveData: SaveData) => void;
public onSaveLoadError?: (error: Error) => void;
```

---

### 3. TurnSystem (`TurnSystem.ts`)

**Purpose:** Manages turn-based game loop with Income → Action → Combat → End phases

**Location:** `src/core/TurnSystem.ts`

**Turn Phase Flow:**

```mermaid
graph LR
    A[Income Phase] --> B[Auto-Process Income]
    B --> C[Action Phase]
    C --> D[Player/AI Actions]
    D --> E[Combat Phase]
    E --> F[Resolve Battles]
    F --> G[End Phase]
    G --> H[Check Victory/Defeat]
    H --> I[New Turn]
    I --> A
```

**Key Methods:**

```typescript
// Advance to next phase (called when player clicks "End Turn")
public advancePhase(): void;

// Process income phase (resource generation, population growth)
public processIncomePhase(): ResourceDelta;

// Process action phase (player/AI building, recruiting)
public processActionPhase(): void;

// Process combat phase (resolve battles)
public processCombatPhase(): void;

// Check victory/defeat conditions
public checkVictoryConditions(): VictoryResult;

// Complete current turn and start new turn
private completeTurn(): void;
```

**Phase Transitions:**

```typescript
switch (currentPhase) {
  case TurnPhase.Income:
    // Auto-transition to Action after income calculation
    this.transitionToPhase(TurnPhase.Action);
    break;

  case TurnPhase.Action:
    // Player ended turn → Combat
    this.transitionToPhase(TurnPhase.Combat);
    break;

  case TurnPhase.Combat:
    // Combat resolved → End
    this.transitionToPhase(TurnPhase.End);
    break;

  case TurnPhase.End:
    // End complete → New turn at Income
    this.completeTurn();
    break;
}
```

**Events:**

```typescript
public onPhaseChanged?: (phase: TurnPhase) => void;
public onTurnStarted?: (turn: number) => void;
public onTurnEnded?: (turn: number) => void;
public onVictoryAchieved?: (result: VictoryResult) => void;
public onIncomeCalculated?: (income: ResourceDelta) => void;
```

**Usage in Phaser Scene:**

```typescript
// Subscribe to turn events
this.turnSystem.onPhaseChanged = (phase) => {
  this.turnHUD.setPhase(phase);
};

this.turnSystem.onTurnStarted = (turn) => {
  this.turnHUD.setTurn(turn);
};

this.turnSystem.onVictoryAchieved = (result) => {
  if (result === VictoryResult.PlayerVictory) {
    this.scene.start('VictoryScene');
  }
};

// Player clicks "End Turn" button
this.endTurnButton.on('pointerdown', () => {
  this.turnSystem.advancePhase();
});
```

---

## Economy Systems

### 4. ResourceSystem (`ResourceSystem.ts`)

**Purpose:** Manages 5 resource types (Credits, Minerals, Fuel, Food, Energy)

**Location:** `src/core/ResourceSystem.ts`

**Resource Types:**

```typescript
export enum ResourceType {
  Credits,    // Currency for purchases
  Minerals,   // Construction material
  Fuel,       // Spacecraft fuel
  Food,       // Population sustenance
  Energy      // Planetary operations
}

export class ResourceCollection {
  public credits: number = 0;
  public minerals: number = 0;
  public fuel: number = 0;
  public food: number = 0;
  public energy: number = 0;
}
```

**Key Methods:**

```typescript
// Add resources to faction
public addResources(
  faction: FactionState,
  delta: ResourceCollection
): void;

// Deduct resources (returns false if insufficient)
public deductResources(
  faction: FactionState,
  cost: ResourceCollection
): boolean;

// Check if faction has sufficient resources
public hasResources(
  faction: FactionState,
  required: ResourceCollection
): boolean;

// Transfer resources between factions
public transferResources(
  from: FactionState,
  to: FactionState,
  amount: ResourceCollection
): boolean;
```

**Usage Example:**

```typescript
const resourceSystem = new ResourceSystem(gameState);

// Check if player can afford building
const cost = { credits: 500, minerals: 300, fuel: 0, food: 0, energy: 0 };
if (resourceSystem.hasResources(gameState.playerFaction, cost)) {
  if (resourceSystem.deductResources(gameState.playerFaction, cost)) {
    // Build the building
    buildingSystem.constructBuilding(planet, BuildingType.MiningStation);
  }
}
```

---

### 5. IncomeSystem (`IncomeSystem.ts`)

**Purpose:** Calculate per-turn resource generation from planets and buildings

**Location:** `src/core/IncomeSystem.ts`

**Income Calculation:**

```typescript
// Calculate total income for a faction
public calculateIncome(faction: FactionState): ResourceDelta;

// Calculate income from a single planet
public calculatePlanetIncome(planet: PlanetEntity): ResourceDelta;

// Apply income to faction resources
public applyIncome(faction: FactionState): void;
```

**Income Sources:**
1. **Base planet income** (based on planet type)
2. **Building modifiers** (Mining Stations +50% minerals, etc.)
3. **Population effects** (more population = more production)
4. **Tax rate effects** (higher taxes = lower morale but higher income)

**Formula:**

```typescript
// Simplified income calculation
const baseIncome = planet.baseResourceGeneration;
const buildingBonus = this.calculateBuildingBonus(planet);
const populationMultiplier = planet.population / 100;
const taxMultiplier = planet.taxRate / 100;

income.credits = (baseIncome.credits * buildingBonus.credits *
                  populationMultiplier * taxMultiplier);
// ... repeat for each resource type
```

---

### 6. PopulationSystem (`PopulationSystem.ts`)

**Purpose:** Manages population growth, morale, and happiness

**Location:** `src/core/PopulationSystem.ts`

**Key Mechanics:**

```typescript
// Calculate population growth
public calculateGrowth(planet: PlanetEntity): number;

// Update morale based on conditions
public updateMorale(planet: PlanetEntity): void;

// Calculate happiness level
public calculateHappiness(planet: PlanetEntity): number;
```

**Growth Factors:**
- Food availability (negative food = starvation, population decline)
- Morale level (happy population grows faster)
- Planet capacity (max population based on planet type)
- Buildings (Habitation Modules increase capacity)

**Morale Factors:**
- Tax rate (higher taxes = lower morale)
- Food shortage (starvation severely reduces morale)
- Military presence (defending forces boost morale)
- Recent combat (attacks reduce morale)

---

### 7. TaxationSystem (`TaxationSystem.ts`)

**Purpose:** Manage tax rates and their economic/social effects

**Location:** `src/core/TaxationSystem.ts`

**Key Methods:**

```typescript
// Set tax rate for a planet (0-100%)
public setTaxRate(planet: PlanetEntity, rate: number): void;

// Calculate tax revenue
public calculateTaxRevenue(planet: PlanetEntity): number;

// Calculate morale impact of tax rate
public calculateMoraleImpact(taxRate: number): number;
```

**Tax Rate Effects:**

| Tax Rate | Credits Bonus | Morale Impact |
|----------|---------------|---------------|
| 0-25%    | Low           | Positive      |
| 26-50%   | Medium        | Neutral       |
| 51-75%   | High          | Negative      |
| 76-100%  | Very High     | Very Negative |

---

## Entity Systems

### 8. EntitySystem (`EntitySystem.ts`)

**Purpose:** Base management for all game entities (planets, craft, platoons)

**Location:** `src/core/EntitySystem.ts`

**Key Responsibilities:**
- Generate unique entity IDs
- Track entity ownership (player, AI, neutral)
- Destroy entities and cleanup references
- Validate entity states

**Base Entity Interface:**

```typescript
export interface BaseEntity {
  id: number;
  ownerType: FactionType;  // Player, AI, Neutral
  name: string;
  isDestroyed: boolean;
}
```

**Key Methods:**

```typescript
// Generate next unique entity ID
public generateEntityId(): number;

// Assign entity to faction
public assignOwner(entity: BaseEntity, owner: FactionType): void;

// Mark entity as destroyed and cleanup
public destroyEntity(entity: BaseEntity): void;

// Validate entity consistency
public validateEntity(entity: BaseEntity): boolean;
```

---

### 9. CraftSystem (`CraftSystem.ts`)

**Purpose:** Manage spacecraft (Scouts, Battle Cruisers, Bombers, Atmosphere Processors)

**Location:** `src/core/CraftSystem.ts`

**Spacecraft Types:**

```typescript
export enum CraftType {
  Scout,               // Reconnaissance, low cost
  BattleCruiser,       // Transport + combat, holds platoons
  Bomber,              // Bombardment specialist
  AtmosphereProcessor  // Terraform planets (Genesis Device)
}

export class CraftEntity implements BaseEntity {
  public id: number;
  public ownerType: FactionType;
  public craftType: CraftType;
  public currentPlanetId: number;
  public destinationPlanetId?: number;
  public turnsToArrival: number = 0;
  public loadedPlatoons: number[] = [];  // Platoon IDs
  public maxPlatoonCapacity: number;
  public isDestroyed: boolean = false;
}
```

**Key Methods:**

```typescript
// Purchase new spacecraft
public purchaseCraft(
  faction: FactionState,
  craftType: CraftType,
  planetId: number
): CraftEntity | null;

// Get craft purchase cost
public getCraftCost(craftType: CraftType): ResourceCollection;

// Load platoon onto Battle Cruiser
public loadPlatoon(
  craft: CraftEntity,
  platoonId: number
): boolean;

// Unload platoon from craft
public unloadPlatoon(
  craft: CraftEntity,
  platoonId: number
): boolean;
```

**Spacecraft Costs & Capabilities:**

| Type | Credits | Minerals | Fuel | Platoon Capacity | Special |
|------|---------|----------|------|------------------|---------|
| Scout | 1000 | 500 | 200 | 0 | Reconnaissance |
| Battle Cruiser | 3000 | 1500 | 500 | 5 | Transport + Combat |
| Bomber | 2500 | 1200 | 400 | 0 | Bombardment |
| Atmosphere Processor | 5000 | 2500 | 300 | 0 | Terraform |

---

### 10. PlatoonSystem (`PlatoonSystem.ts`)

**Purpose:** Manage ground forces with equipment, weapons, and training levels

**Location:** `src/core/PlatoonSystem.ts`

**Platoon Structure:**

```typescript
export class PlatoonEntity implements BaseEntity {
  public id: number;
  public ownerType: FactionType;
  public currentPlanetId: number;
  public troopCount: number;
  public equipmentLevel: UpgradeLevel;  // Basic, Standard, Advanced, Elite
  public weaponLevel: UpgradeLevel;
  public trainingLevel: UpgradeLevel;
  public isDestroyed: boolean = false;
}

export enum UpgradeLevel {
  Basic = 0,
  Standard = 1,
  Advanced = 2,
  Elite = 3
}
```

**Key Methods:**

```typescript
// Commission new platoon
public commissionPlatoon(
  faction: FactionState,
  planetId: number,
  config: PlatoonConfig
): PlatoonEntity | null;

// Calculate platoon commission cost
public calculateCommissionCost(config: PlatoonConfig): ResourceCollection;

// Calculate platoon strength (for combat)
public calculateStrength(platoon: PlatoonEntity): number;

// Upgrade equipment/weapons/training
public upgradePlatoon(
  platoon: PlatoonEntity,
  upgradeType: 'equipment' | 'weapons' | 'training'
): boolean;
```

**Platoon Configuration:**

```typescript
export interface PlatoonConfig {
  troopCount: number;           // 100-500 troops
  equipmentLevel: UpgradeLevel;
  weaponLevel: UpgradeLevel;
  trainingLevel: UpgradeLevel;
}
```

**Strength Calculation:**

```typescript
// Combat strength formula
const baseTroops = platoon.troopCount;
const equipmentMult = 1.0 + (platoon.equipmentLevel * 0.25);
const weaponMult = 1.0 + (platoon.weaponLevel * 0.25);
const trainingMult = 1.0 + (platoon.trainingLevel * 0.25);

const strength = baseTroops * equipmentMult * weaponMult * trainingMult;
```

**Commission Costs:**

| Upgrade Level | Cost Multiplier |
|---------------|-----------------|
| Basic (0)     | 1.0x            |
| Standard (1)  | 1.5x            |
| Advanced (2)  | 2.5x            |
| Elite (3)     | 4.0x            |

**Base Cost:** 500 Credits, 200 Minerals per platoon

---

## Infrastructure Systems

### 11. BuildingSystem (`BuildingSystem.ts`)

**Purpose:** Planetary structures (Mines, Factories, Labs, Defense Structures)

**Location:** `src/core/BuildingSystem.ts`

**Building Types:**

```typescript
export enum BuildingType {
  MiningStation,        // +50% mineral income
  Factory,              // +30% production speed
  ResearchLab,          // Enable tech upgrades
  HabitationModule,     // +25% max population
  PowerPlant,           // +40% energy generation
  DefenseGrid,          // Planetary defense bonus
  Starport              // Reduce craft construction time
}
```

**Building Structure:**

```typescript
export interface BuildingSlot {
  buildingType: BuildingType | null;
  constructionProgress: number;  // 0-100%
  turnsToComplete: number;
  isComplete: boolean;
}

// Planets have limited building slots (3-5 depending on type)
planet.buildingSlots: BuildingSlot[];
```

**Key Methods:**

```typescript
// Start construction
public constructBuilding(
  planet: PlanetEntity,
  buildingType: BuildingType
): boolean;

// Process construction progress (called each turn)
public processConstruction(planet: PlanetEntity): void;

// Get building cost
public getBuildingCost(buildingType: BuildingType): ResourceCollection;

// Get building effects
public getBuildingEffects(buildingType: BuildingType): BuildingEffects;
```

**Building Costs & Effects:**

| Building | Credits | Minerals | Turns | Effect |
|----------|---------|----------|-------|--------|
| Mining Station | 800 | 400 | 3 | +50% mineral income |
| Factory | 1000 | 500 | 4 | +30% production speed |
| Research Lab | 1500 | 800 | 5 | Enable tech upgrades |
| Habitation | 600 | 300 | 2 | +25% max population |
| Power Plant | 1200 | 600 | 4 | +40% energy generation |
| Defense Grid | 2000 | 1000 | 6 | +100% defense strength |
| Starport | 1800 | 900 | 5 | -25% craft build time |

---

### 12. UpgradeSystem (`UpgradeSystem.ts`)

**Purpose:** Tech levels for Equipment, Weapons, Training

**Location:** `src/core/UpgradeSystem.ts`

**Upgrade Types:**

```typescript
export enum UpgradeType {
  Equipment,  // Platoon armor and defensive gear
  Weapons,    // Platoon offensive firepower
  Training    // Platoon combat effectiveness
}
```

**Key Methods:**

```typescript
// Purchase upgrade level for faction
public purchaseUpgrade(
  faction: FactionState,
  upgradeType: UpgradeType,
  targetLevel: UpgradeLevel
): boolean;

// Get upgrade cost
public getUpgradeCost(
  upgradeType: UpgradeType,
  targetLevel: UpgradeLevel
): ResourceCollection;

// Check if faction can afford upgrade
public canAffordUpgrade(
  faction: FactionState,
  upgradeType: UpgradeType,
  targetLevel: UpgradeLevel
): boolean;
```

**Upgrade Progression:**

| Level | Cost (Credits) | Cost (Minerals) | Research Lab Required |
|-------|----------------|-----------------|----------------------|
| Basic → Standard | 2000 | 1000 | No |
| Standard → Advanced | 5000 | 2500 | Yes |
| Advanced → Elite | 10000 | 5000 | Yes |

**Faction Tech Levels:**

```typescript
// Each faction tracks their highest achieved upgrade level
faction.equipmentLevel: UpgradeLevel;
faction.weaponLevel: UpgradeLevel;
faction.trainingLevel: UpgradeLevel;

// New platoons commissioned at current faction tech level
const newPlatoon = platoonSystem.commissionPlatoon(faction, planetId, {
  equipmentLevel: faction.equipmentLevel,
  weaponLevel: faction.weaponLevel,
  trainingLevel: faction.trainingLevel
});
```

---

### 13. DefenseSystem (`DefenseSystem.ts`)

**Purpose:** Planetary defenses (Shields, Missiles, Laser Batteries)

**Location:** `src/core/DefenseSystem.ts`

**Defense Types:**

```typescript
export enum DefenseType {
  Shield,           // Absorbs damage before planet
  MissileBattery,   // Anti-spacecraft defense
  LaserBattery      // Anti-spacecraft + ground support
}

export interface PlanetDefenses {
  shieldStrength: number;      // 0-1000 shield points
  missileBatteries: number;    // 0-10 batteries
  laserBatteries: number;      // 0-10 batteries
}
```

**Key Methods:**

```typescript
// Install defense system
public installDefense(
  planet: PlanetEntity,
  defenseType: DefenseType
): boolean;

// Calculate total defense strength
public calculateDefenseStrength(planet: PlanetEntity): number;

// Process damage to defenses
public applyDamage(
  planet: PlanetEntity,
  incomingDamage: number
): DamageResult;
```

**Defense Costs:**

| Defense Type | Credits | Minerals | Effect |
|--------------|---------|----------|--------|
| Shield (100 points) | 500 | 250 | Absorbs damage first |
| Missile Battery | 800 | 400 | +50 anti-spacecraft |
| Laser Battery | 1200 | 600 | +75 anti-spacecraft + ground |

---

## Combat Systems

### 14. CombatSystem (`CombatSystem.ts`)

**Purpose:** Ground combat between platoons

**Location:** `src/core/CombatSystem.ts`

**Combat Resolution:**

```typescript
// Resolve combat between two platoons
public resolveCombat(
  attacker: PlatoonEntity,
  defender: PlatoonEntity,
  aggressionLevel: number  // 0-100%
): CombatResult;

export interface CombatResult {
  victor: FactionType;
  attackerCasualties: number;
  defenderCasualties: number;
  attackerSurvivors: number;
  defenderSurvivors: number;
  turnsElapsed: number;
}
```

**Combat Flow:**

```mermaid
graph TD
    A[Calculate Strength] --> B[Apply Aggression Modifier]
    B --> C[Roll Damage Dice]
    C --> D[Apply Casualties]
    D --> E{Platoon Destroyed?}
    E -->|Yes| F[Declare Victor]
    E -->|No| G[Next Combat Round]
    G --> C
    F --> H[Return CombatResult]
```

**Strength Calculation:**

```typescript
// Attacker strength
const attackerStrength = this.calculateStrength(attacker);
const attackerBonus = aggressionLevel / 100;  // 0-100% aggression

// Defender strength (defensive terrain bonus)
const defenderStrength = this.calculateStrength(defender);
const defenderBonus = 0.25;  // +25% defensive bonus

// Damage per round
const attackerDamage = attackerStrength * (1 + attackerBonus);
const defenderDamage = defenderStrength * (1 + defenderBonus);
```

**Aggression Impact:**

| Aggression | Attacker Bonus | Attacker Casualties | Combat Duration |
|------------|----------------|---------------------|-----------------|
| 0-25% | -25% to 0% | Very Low | Very Long |
| 26-50% | 0% to +25% | Low | Long |
| 51-75% | +25% to +50% | Medium | Medium |
| 76-100% | +50% to +100% | High | Short |

---

### 15. SpaceCombatSystem (`SpaceCombatSystem.ts`)

**Purpose:** Fleet battles between spacecraft

**Location:** `src/core/SpaceCombatSystem.ts`

**Key Methods:**

```typescript
// Resolve space combat between two fleets
public resolveSpaceCombat(
  attackerFleet: CraftEntity[],
  defenderFleet: CraftEntity[]
): SpaceCombatResult;

// Calculate fleet strength
public calculateFleetStrength(fleet: CraftEntity[]): number;
```

**Spacecraft Combat Values:**

| Craft Type | Attack | Defense | HP |
|------------|--------|---------|-----|
| Scout | 10 | 20 | 50 |
| Battle Cruiser | 50 | 40 | 200 |
| Bomber | 75 | 20 | 100 |
| Atmosphere Processor | 5 | 15 | 80 |

---

### 16. BombardmentSystem (`BombardmentSystem.ts`)

**Purpose:** Orbital bombardment mechanics

**Location:** `src/core/BombardmentSystem.ts`

**Bombardment Flow:**

```typescript
// Execute bombardment
public executeBombardment(
  bomberCraft: CraftEntity,
  targetPlanet: PlanetEntity
): BombardmentResult;

export interface BombardmentResult {
  damageDealt: number;
  buildingsDestroyed: number;
  populationLost: number;
  defensesSuppressed: boolean;
}
```

**Bombardment Effects:**
- Destroys planet defenses (shields, batteries)
- Damages buildings (random selection)
- Reduces population (civilian casualties)
- Lowers morale significantly

---

### 17. InvasionSystem (`InvasionSystem.ts`)

**Purpose:** Planetary invasion mechanics

**Location:** `src/core/InvasionSystem.ts`

**Invasion Requirements:**
1. Attacker must control orbital space (defeat defending spacecraft)
2. Attacker must have Battle Cruisers with loaded platoons
3. Defending planet may have ground forces

**Invasion Flow:**

```mermaid
graph TD
    A[Check Orbital Control] --> B{Has Control?}
    B -->|No| C[Invasion Fails]
    B -->|Yes| D[Unload Platoons]
    D --> E[Ground Combat vs Defenders]
    E --> F{Attackers Win?}
    F -->|Yes| G[Capture Planet]
    F -->|No| H[Repelled]
    G --> I[Transfer Ownership]
    I --> J[Capture Resources]
```

**Key Methods:**

```typescript
// Initiate invasion
public initiateInvasion(
  attackerCraft: CraftEntity[],
  targetPlanet: PlanetEntity,
  aggressionLevel: number
): InvasionResult;

// Check orbital control
public hasOrbitalControl(
  attackerCraft: CraftEntity[],
  defenderCraft: CraftEntity[]
): boolean;

// Calculate invasion success chance
public calculateSuccessChance(
  attackerForces: PlatoonEntity[],
  defenderForces: PlatoonEntity[]
): number;
```

**Invasion Result:**

```typescript
export interface InvasionResult {
  success: boolean;
  combatResults: CombatResult[];
  planetCaptured: boolean;
  resourcesCaptured: ResourceCollection;
  attackerCasualties: number;
  defenderCasualties: number;
}
```

---

### 18. NavigationSystem (`NavigationSystem.ts`)

**Purpose:** Spacecraft movement between planets

**Location:** `src/core/NavigationSystem.ts`

**Key Methods:**

```typescript
// Set spacecraft destination
public navigateTo(
  craft: CraftEntity,
  destinationPlanetId: number
): boolean;

// Calculate travel time
public calculateTravelTime(
  fromPlanetId: number,
  toPlanetId: number,
  craftType: CraftType
): number;

// Process in-transit craft (called each turn)
public processNavigation(): void;
```

**Travel Time Calculation:**

```typescript
// Distance between planets
const distance = this.calculateDistance(
  sourcePlanet.position,
  destPlanet.position
);

// Craft speed modifier
const speedModifier = this.getSpeedModifier(craftType);

// Turns to arrival
const turnsToArrival = Math.ceil(distance / speedModifier);
```

**Spacecraft Speeds:**

| Craft Type | Speed Modifier | Typical Travel Time |
|------------|----------------|---------------------|
| Scout | 2.0x | 1-2 turns |
| Battle Cruiser | 1.0x | 2-4 turns |
| Bomber | 1.5x | 1-3 turns |
| Atmosphere Processor | 0.8x | 3-5 turns |

---

## AI Systems

### AI Decision System (`AIDecisionSystem.ts`)

**Purpose:** AI opponent strategic decision-making with 4 personalities × 3 difficulties

**Location:** `src/core/AIDecisionSystem.ts`

**AI Personalities:**

```typescript
export enum AIPersonality {
  Aggressive,   // Prioritizes military expansion and attacks
  Defensive,    // Focuses on fortifications and economic growth
  Economic,     // Maximizes income and tech upgrades
  Balanced      // Mix of all strategies
}
```

**AI Difficulty Levels:**

```typescript
export enum Difficulty {
  Easy,     // AI makes suboptimal decisions, lower resources
  Normal,   // Standard AI behavior
  Hard      // Optimal decisions, resource bonuses
}
```

**Decision Priority Tree:**

```mermaid
graph TD
    A[AI Turn Start] --> B[Evaluate Threat Level]
    B --> C{Under Attack?}
    C -->|Yes| D[Priority: Defense]
    C -->|No| E[Priority: Economy/Military]
    D --> F[Build Defenses]
    D --> G[Commission Platoons]
    E --> H{Personality Check}
    H -->|Aggressive| I[Build Military]
    H -->|Defensive| J[Build Economy + Defenses]
    H -->|Economic| K[Maximize Income]
    H -->|Balanced| L[Mix Strategies]
    I --> M[Launch Attacks]
    J --> N[Fortify Planets]
    K --> O[Research Upgrades]
    L --> P[Adaptive Strategy]
```

**Key Methods:**

```typescript
// Execute AI turn
public executeTurn(): void;

// Evaluate strategic priorities
private evaluatePriorities(): AIDecision[];

// Make economic decisions
private makeEconomicDecisions(): void;

// Make military decisions
private makeMilitaryDecisions(): void;

// Select attack target
private selectAttackTarget(): PlanetEntity | null;
```

**AI Decision Weights by Personality:**

| Priority | Aggressive | Defensive | Economic | Balanced |
|----------|-----------|-----------|----------|----------|
| Defense | 20% | 50% | 30% | 35% |
| Economy | 20% | 30% | 50% | 35% |
| Military | 40% | 10% | 10% | 20% |
| Attack | 20% | 10% | 10% | 10% |

**Difficulty Modifiers:**

| Aspect | Easy | Normal | Hard |
|--------|------|--------|------|
| Starting Resources | -25% | 100% | +50% |
| Income Bonus | 0% | 0% | +25% |
| Decision Quality | Random | Heuristic | Optimal |
| Upgrade Priority | Low | Medium | High |

---

## Galaxy Systems

### Galaxy Generator (`GalaxyGenerator.ts`)

**Purpose:** Deterministic procedural galaxy generation with seeded RNG

**Location:** `src/core/GalaxyGenerator.ts`

**Key Methods:**

```typescript
// Generate galaxy with seeded RNG
public generateGalaxy(
  seed: number,
  difficulty: Difficulty
): Galaxy;

// Generate planet with procedural attributes
private generatePlanet(
  id: number,
  index: number
): PlanetEntity;

// Deterministic random number generator
private seededRandom(seed: number): number;
```

**Galaxy Structure:**

```typescript
export interface Galaxy {
  planets: PlanetEntity[];
  seed: number;
  difficulty: Difficulty;
  generatedAt: Date;
}
```

**Planet Generation:**

```typescript
// 4-6 planets per galaxy
const planetCount = 4 + (seed % 3);

// Planet types distributed randomly
const planetTypes = [
  PlanetType.Barren,      // Low resources, harsh
  PlanetType.Temperate,   // Balanced resources
  PlanetType.Oceanic,     // High food, low minerals
  PlanetType.Volcanic,    // High minerals, low food
  PlanetType.Metropolis   // Pre-developed, high population
];

// Planet positioning (3D coordinates)
planet.position = new Position3D(
  this.seededRandom(seed + index) * 1000 - 500,  // X: -500 to 500
  this.seededRandom(seed + index + 1) * 1000 - 500,  // Y
  0  // Z: currently 2D plane
);
```

**Deterministic Seeded RNG:**

```typescript
// Linear Congruential Generator (LCG)
// Ensures seed 42 always generates same galaxy
private seededRandom(seed: number): number {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);

  this.seed = (a * this.seed + c) % m;
  return this.seed / m;  // Normalize to 0-1
}
```

**Why Deterministic?**
- **Testing:** Same seed always produces identical galaxy
- **Debugging:** Reproducible game states
- **Multiplayer:** Both players see same galaxy from same seed
- **Scenario Packs:** Galaxy templates can specify exact seeds

---

## System Integration Patterns

### Event-Driven Communication

All core systems fire callbacks that Phaser scenes subscribe to:

```typescript
// Core System (src/core/TurnSystem.ts)
export class TurnSystem {
  public onPhaseChanged?: (phase: TurnPhase) => void;

  private transitionToPhase(newPhase: TurnPhase): void {
    this.gameState.currentPhase = newPhase;

    // Fire event (if subscriber exists)
    if (this.onPhaseChanged) {
      this.onPhaseChanged(newPhase);
    }
  }
}

// Phaser Scene (src/scenes/GalaxyMapScene.ts)
export class GalaxyMapScene extends Phaser.Scene {
  create() {
    // Subscribe to event
    this.turnSystem.onPhaseChanged = (phase) => {
      // Update UI rendering
      this.turnHUD.setPhase(phase);

      if (phase === TurnPhase.Income) {
        this.showIncomeAnimation();
      }
    };
  }
}
```

### Dependency Injection

Systems receive dependencies through constructor injection:

```typescript
// GameState is injected into all systems
export class TurnSystem {
  private readonly gameState: GameState;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null');
    }
    this.gameState = gameState;
  }
}

// Scene creates systems with shared GameState
export class GalaxyMapScene extends Phaser.Scene {
  create() {
    this.gameState = new GameState();

    // All systems share same GameState
    this.turnSystem = new TurnSystem(this.gameState);
    this.combatSystem = new CombatSystem(this.gameState);
    this.aiSystem = new AIDecisionSystem(this.gameState);
  }
}
```

---

## Testing Patterns

### Unit Test Example

```typescript
// tests/unit/TurnSystem.test.ts
import { TurnSystem } from '@core/TurnSystem';
import { GameState } from '@core/GameState';
import { TurnPhase } from '@core/models/Enums';

describe('TurnSystem', () => {
  let gameState: GameState;
  let turnSystem: TurnSystem;

  beforeEach(() => {
    gameState = new GameState();
    turnSystem = new TurnSystem(gameState);
  });

  test('should start at Action phase', () => {
    expect(gameState.currentPhase).toBe(TurnPhase.Action);
  });

  test('should fire onPhaseChanged event', () => {
    let phaseChangedFired = false;
    turnSystem.onPhaseChanged = (phase) => {
      phaseChangedFired = true;
    };

    turnSystem.advancePhase();
    expect(phaseChangedFired).toBe(true);
  });

  test('should advance from Action to Combat phase', () => {
    gameState.currentPhase = TurnPhase.Action;
    turnSystem.advancePhase();
    expect(gameState.currentPhase).toBe(TurnPhase.Combat);
  });
});
```

**Current Test Coverage:**
- 835 tests passing
- 93%+ overall coverage
- 90%+ coverage for critical systems (TurnSystem, CombatSystem, AIDecisionSystem)

---

## Common Workflows

### Starting a New Campaign

```typescript
// 1. Initialize GameState
const gameState = new GameState();

// 2. Generate Galaxy
const generator = new GalaxyGenerator();
const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

// 3. Populate GameState
gameState.planets = galaxy.planets;
gameState.rebuildLookups();

// 4. Initialize Systems
const turnSystem = new TurnSystem(gameState);
const aiSystem = new AIDecisionSystem(gameState);

// 5. Start Game Loop
turnSystem.advancePhase();
```

### Player Commissioning a Platoon

```typescript
// 1. Check resources
const cost = platoonSystem.calculateCommissionCost(config);
if (!resourceSystem.hasResources(gameState.playerFaction, cost)) {
  console.log('Insufficient resources');
  return;
}

// 2. Deduct cost
resourceSystem.deductResources(gameState.playerFaction, cost);

// 3. Create platoon
const platoon = platoonSystem.commissionPlatoon(
  gameState.playerFaction,
  planetId,
  config
);

// 4. Add to GameState
gameState.platoons.push(platoon);
gameState.rebuildLookups();
```

### Executing Planetary Invasion

```typescript
// 1. Check orbital control
const hasControl = invasionSystem.hasOrbitalControl(
  attackerCraft,
  defenderCraft
);

if (!hasControl) {
  console.log('Must defeat defending spacecraft first');
  return;
}

// 2. Initiate invasion
const result = invasionSystem.initiateInvasion(
  attackerCraft,
  targetPlanet,
  aggressionLevel
);

// 3. Handle result
if (result.planetCaptured) {
  targetPlanet.ownerType = FactionType.Player;
  gameState.playerFaction.ownedPlanetIDs.push(targetPlanet.id);

  // Capture resources
  resourceSystem.addResources(
    gameState.playerFaction,
    result.resourcesCaptured
  );
}
```

---

## Next Steps

After understanding the core systems:
1. Review [Phaser Integration](04-phaser-integration.md) for rendering patterns
2. Study [Data Models & State](05-data-models-state.md) for entity details
3. See [Testing Guide](06-testing-guide.md) for TDD workflow
4. Check [UI Components Reference](11-ui-components.md) for existing UI

---

**Chapter Status:** Complete
**Systems Documented:** 18 of 18
**Code Examples:** 45+ working examples
**Test Coverage:** 93%+ documented
