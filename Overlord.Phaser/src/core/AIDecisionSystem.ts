import { GameState } from './GameState';
import { IncomeSystem } from './IncomeSystem';
import { ResourceSystem } from './ResourceSystem';
import { BuildingSystem } from './BuildingSystem';
import { CraftSystem } from './CraftSystem';
import { PlatoonSystem } from './PlatoonSystem';
import {
  FactionType,
  AIPersonality,
  AIDifficulty,
  PlanetType,
  BuildingType,
  BuildingStatus,
  CraftType,
  EquipmentLevel,
  WeaponLevel
} from './models/Enums';
import { AIPersonalityConfig, AIAssessment } from './models/AIModels';
import { PlatoonCosts } from './models/PlatoonModels';
import { ResourceCost } from './models/ResourceModels';

/**
 * Platform-agnostic AI decision-making system.
 * Executes AI turn, evaluates game state, and makes strategic decisions.
 */
export class AIDecisionSystem {
  private readonly gameState: GameState;
  private readonly random: () => number;

  // System dependencies
  private readonly incomeSystem: IncomeSystem;
  private readonly resourceSystem: ResourceSystem;
  private readonly buildingSystem: BuildingSystem;
  private readonly craftSystem: CraftSystem;
  private readonly platoonSystem: PlatoonSystem;

  // AI configuration
  private personality: AIPersonality;
  private personalityConfig: AIPersonalityConfig;
  private difficulty: AIDifficulty;

  /**
   * Event fired when AI turn starts.
   */
  public onAITurnStarted?: () => void;

  /**
   * Event fired when AI turn completes.
   */
  public onAITurnCompleted?: () => void;

  /**
   * Event fired when AI initiates an attack.
   * Parameters: (targetPlanetID)
   */
  public onAIAttacking?: (targetPlanetID: number) => void;

  /**
   * Event fired when AI builds a structure.
   * Parameters: (planetID, buildingType)
   */
  public onAIBuilding?: (planetID: number, buildingType: BuildingType) => void;

  constructor(
    gameState: GameState,
    incomeSystem: IncomeSystem,
    resourceSystem: ResourceSystem,
    buildingSystem: BuildingSystem,
    craftSystem: CraftSystem,
    platoonSystem: PlatoonSystem,
    personality: AIPersonality = AIPersonality.Balanced,
    difficulty: AIDifficulty = AIDifficulty.Normal,
    randomFunc?: () => number
  ) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!incomeSystem) {
      throw new Error('incomeSystem cannot be null or undefined');
    }
    if (!resourceSystem) {
      throw new Error('resourceSystem cannot be null or undefined');
    }
    if (!buildingSystem) {
      throw new Error('buildingSystem cannot be null or undefined');
    }
    if (!craftSystem) {
      throw new Error('craftSystem cannot be null or undefined');
    }
    if (!platoonSystem) {
      throw new Error('platoonSystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.incomeSystem = incomeSystem;
    this.resourceSystem = resourceSystem;
    this.buildingSystem = buildingSystem;
    this.craftSystem = craftSystem;
    this.platoonSystem = platoonSystem;

    this.personality = personality;
    this.personalityConfig = AIPersonalityConfig.getConfig(personality);
    this.difficulty = difficulty;
    this.random = randomFunc || Math.random;
  }

  /**
   * Gets current AI personality.
   */
  public getPersonality(): AIPersonality {
    return this.personality;
  }

  /**
   * Gets AI personality name (e.g., "Commander Kratos").
   */
  public getPersonalityName(): string {
    return this.personalityConfig.name;
  }

  /**
   * Gets AI personality quote.
   */
  public getPersonalityQuote(): string {
    return this.personalityConfig.quote;
  }

  /**
   * Gets current difficulty level.
   */
  public getDifficulty(): AIDifficulty {
    return this.difficulty;
  }

  /**
   * Sets AI difficulty level.
   */
  public setDifficulty(difficulty: AIDifficulty): void {
    this.difficulty = difficulty;
  }

  /**
   * Executes full AI turn.
   */
  public executeAITurn(): void {
    this.onAITurnStarted?.();

    // Assess game state
    const assessment = this.assessGameState();

    // Execute decision tree
    this.executeDecisions(assessment);

    this.onAITurnCompleted?.();
  }

  /**
   * Assesses current game state (threat level, economy, territory).
   */
  public assessGameState(): AIAssessment {
    const assessment = new AIAssessment();

    // Calculate military strengths
    let playerMilitary = this.calculateMilitaryStrength(FactionType.Player);
    let aiMilitary = this.calculateMilitaryStrength(FactionType.AI);

    // Apply difficulty modifiers to AI strength
    aiMilitary = this.applyDifficultyModifier(aiMilitary);

    // Threat level = Player ÷ AI (higher = player stronger)
    assessment.threatLevel = aiMilitary > 0 ? playerMilitary / aiMilitary : 10.0;

    // Economic strength
    const playerRes = this.gameState.playerFaction.resources;
    const aiRes = this.gameState.aiFaction.resources;
    const playerTotal = playerRes.credits + playerRes.minerals + playerRes.fuel + playerRes.food;
    const aiTotal = aiRes.credits + aiRes.minerals + aiRes.fuel + aiRes.food;
    assessment.economicStrength = playerTotal > 0 ? aiTotal / playerTotal : 0.0;

    // Territory
    assessment.aiPlanets = this.gameState.planets.filter(p => p.owner === FactionType.AI).length;
    assessment.playerPlanets = this.gameState.planets.filter(p => p.owner === FactionType.Player).length;

    // Under attack check
    assessment.underAttack = this.isUnderAttack();

    // Can attack check
    assessment.canAttack = this.canAttack(assessment.threatLevel);

    return assessment;
  }

  /**
   * Executes AI decision tree based on assessment.
   */
  private executeDecisions(assessment: AIAssessment): void {
    // Priority 1: Defend if under attack
    if (assessment.underAttack) {
      this.reinforceDefenses();
    }

    // Priority 2: Build military if threatened
    if (assessment.threatLevel > 0.8) {
      this.trainMilitary();
    }

    // Priority 3: Build economy (early-mid game or economic personality)
    if (this.gameState.currentTurn < 20 || this.personality === AIPersonality.Economic) {
      const economicPriority = 1.0 + this.personalityConfig.economicModifier;
      if (economicPriority > 0.5) {
        this.buildEconomy();
      }
    }

    // Priority 4: Attack if advantage
    if (assessment.canAttack && !assessment.underAttack) {
      this.launchAttack();
    }

    // Priority 5: Expand to neutral planets (if safe)
    if (assessment.aiPlanets < 3 && assessment.economicStrength > 0.5 && assessment.threatLevel < 1.0) {
      this.expandToNeutral();
    }
  }

  /**
   * Calculates total military strength for a faction.
   */
  private calculateMilitaryStrength(faction: FactionType): number {
    let totalStrength = 0;

    const platoons = this.gameState.platoons.filter(p => p.owner === faction);

    for (const platoon of platoons) {
      // Base strength from troop count
      let strength = platoon.troopCount;

      // Equipment multipliers
      switch (platoon.equipment) {
        case EquipmentLevel.Civilian:
          strength += 0;
          break;
        case EquipmentLevel.Standard:
          strength += Math.floor(platoon.troopCount / 2);
          break;
        case EquipmentLevel.Elite:
          strength += platoon.troopCount;
          break;
      }

      // Weapon multipliers
      switch (platoon.weapon) {
        case WeaponLevel.Pistol:
          strength += 0;
          break;
        case WeaponLevel.Rifle:
          strength += Math.floor(platoon.troopCount / 2);
          break;
        case WeaponLevel.Plasma:
          strength += platoon.troopCount;
          break;
      }

      totalStrength += strength;
    }

    return totalStrength;
  }

  /**
   * Applies difficulty modifier to AI military strength.
   */
  private applyDifficultyModifier(strength: number): number {
    switch (this.difficulty) {
      case AIDifficulty.Easy:
        return Math.floor(strength * 0.8); // -20%
      case AIDifficulty.Hard:
        return Math.floor(strength * 1.2); // +20%
      default:
        return strength; // Normal
    }
  }

  /**
   * Checks if AI is under attack.
   */
  private isUnderAttack(): boolean {
    const aiPlanets = this.gameState.planets.filter(p => p.owner === FactionType.AI);

    for (const planet of aiPlanets) {
      // Check for player craft in orbit
      const playerCraft = this.gameState.craft.filter(
        c => c.planetID === planet.id && c.owner === FactionType.Player
      );

      if (playerCraft.some(c => c.type === CraftType.BattleCruiser)) {
        return true; // Player Battle Cruiser at AI planet
      }
    }

    return false;
  }

  /**
   * Determines if AI can attack based on threat level and personality.
   */
  private canAttack(threatLevel: number): boolean {
    // Base attack thresholds by difficulty
    let baseThreshold: number;
    switch (this.difficulty) {
      case AIDifficulty.Easy:
        baseThreshold = 0.5; // AI needs 2× player strength
        break;
      case AIDifficulty.Hard:
        baseThreshold = 0.83; // AI needs 1.2× player strength
        break;
      default:
        baseThreshold = 0.67; // AI needs 1.5× player strength (Normal)
    }

    // Apply personality aggression modifier
    const adjustedThreshold = baseThreshold + this.personalityConfig.aggressionModifier;

    // AI can attack if threat level is below threshold (AI is stronger)
    return threatLevel < adjustedThreshold;
  }

  /**
   * Reinforces defenses at threatened planets.
   */
  private reinforceDefenses(): void {
    const hitotsu = this.gameState.planets.find(p => p.owner === FactionType.AI && p.name === 'Hitotsu');
    if (!hitotsu) {
      return;
    }

    // Check if we can afford a platoon
    const totalCost = PlatoonCosts.getTotalCost(EquipmentLevel.Standard, WeaponLevel.Rifle);
    const cost = new ResourceCost();
    cost.credits = totalCost;
    if (!hitotsu.resources.canAfford(cost)) {
      return;
    }

    // Train defensive platoon
    this.platoonSystem.commissionPlatoon(hitotsu.id, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
  }

  /**
   * Trains military units based on difficulty and game state.
   */
  private trainMilitary(): void {
    const hitotsu = this.gameState.planets.find(p => p.owner === FactionType.AI && p.name === 'Hitotsu');
    if (!hitotsu) {
      return;
    }

    // Determine equipment/weapons by difficulty
    let equipment: EquipmentLevel;
    let weapon: WeaponLevel;

    switch (this.difficulty) {
      case AIDifficulty.Easy:
        equipment = EquipmentLevel.Standard;
        weapon = WeaponLevel.Pistol;
        break;
      case AIDifficulty.Hard:
        equipment = EquipmentLevel.Elite;
        weapon = WeaponLevel.Plasma;
        break;
      default:
        equipment = EquipmentLevel.Standard;
        weapon = WeaponLevel.Rifle; // Normal
    }

    // Check if we can afford
    const totalCost = PlatoonCosts.getTotalCost(equipment, weapon);
    const cost = new ResourceCost();
    cost.credits = totalCost;
    if (!hitotsu.resources.canAfford(cost)) {
      return;
    }

    // Train platoon
    const troops = Math.floor(this.random() * 51) + 100; // 100-150
    this.platoonSystem.commissionPlatoon(hitotsu.id, FactionType.AI, troops, equipment, weapon);
  }

  /**
   * Builds economic infrastructure based on personality.
   */
  private buildEconomy(): void {
    const aiPlanets = this.gameState.planets.filter(p => p.owner === FactionType.AI);

    for (const planet of aiPlanets) {
      // Economic personality builds more aggressively
      const buildChance = this.personality === AIPersonality.Economic ? 0.8 : 0.4;
      if (this.random() > buildChance) {
        continue;
      }

      // Build Mining Stations on Volcanic planets
      if (planet.type === PlanetType.Volcanic) {
        this.buildingSystem.startConstruction(planet.id, BuildingType.MiningStation);
        this.onAIBuilding?.(planet.id, BuildingType.MiningStation);
      }

      // Build Horticultural Stations on Tropical planets
      if (planet.type === PlanetType.Tropical) {
        this.buildingSystem.startConstruction(planet.id, BuildingType.HorticulturalStation);
        this.onAIBuilding?.(planet.id, BuildingType.HorticulturalStation);
      }
    }
  }

  /**
   * Launches attack on player planet.
   */
  private launchAttack(): void {
    // Aggressive personality attacks more often
    if (this.personality === AIPersonality.Defensive) {
      // Defensive personality rarely attacks
      if (this.random() > 0.2) {
        return;
      }
    }

    // Find target (weakest player planet)
    const playerPlanets = this.gameState.planets.filter(p => p.owner === FactionType.Player);
    if (playerPlanets.length === 0) {
      return;
    }

    // Avoid Starbase initially
    let target = playerPlanets
      .filter(p => p.name !== 'Starbase')
      .sort((a, b) => this.getPlanetDefenseStrength(a.id) - this.getPlanetDefenseStrength(b.id))[0];

    if (!target) {
      target = playerPlanets[0]; // Attack Starbase if only option
    }

    // Get AI Battle Cruisers with platoons
    const battleCruisers = this.gameState.craft.filter(
      c => c.owner === FactionType.AI && c.type === CraftType.BattleCruiser && c.carriedPlatoonIDs.length > 0
    );

    if (battleCruisers.length < 2) {
      return; // Need at least 2 cruisers
    }

    // NOTE: Actual movement would require a NavigationSystem
    // For now, just fire the event
    this.onAIAttacking?.(target.id);
  }

  /**
   * Expands to neutral planets.
   */
  private expandToNeutral(): void {
    const neutralPlanets = this.gameState.planets.filter(p => p.owner === FactionType.Neutral);
    if (neutralPlanets.length === 0) {
      return;
    }

    const hitotsu = this.gameState.planets.find(p => p.owner === FactionType.AI && p.name === 'Hitotsu');
    if (!hitotsu) {
      return;
    }

    // Try to purchase Atmosphere Processor
    this.craftSystem.purchaseCraft(CraftType.AtmosphereProcessor, hitotsu.id, FactionType.AI);

    // NOTE: Would normally send to neutral planet via NavigationSystem
    // For now, just creating the craft is progress
  }

  /**
   * Gets defense strength of a planet (garrison + defenses).
   */
  private getPlanetDefenseStrength(planetID: number): number {
    let strength = 0;

    // Garrison strength
    const garrison = this.gameState.platoons.filter(p => p.planetID === planetID);
    for (const platoon of garrison) {
      strength += platoon.troopCount;
    }

    // Orbital Defense bonus
    const planet = this.gameState.planetLookup.get(planetID);
    if (planet) {
      const hasOrbitalDefense = planet.structures.some(
        s => s.type === BuildingType.OrbitalDefense && s.status === BuildingStatus.Active
      );
      if (hasOrbitalDefense) {
        strength = Math.floor(strength * 1.2); // +20% defense bonus
      }
    }

    return strength;
  }
}
