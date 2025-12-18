/**
 * ScenarioInitializer - Initialize GameState from Scenario configuration
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Accepts a Scenario config and creates an initialized GameState ready for gameplay.
 */

import { GameState } from './GameState';
import { PlanetEntity } from './models/PlanetEntity';
import { Scenario, VictoryCondition, DefeatCondition } from './models/ScenarioModels';
import { FactionType, TurnPhase, PlanetType } from './models/Enums';
import { Position3D } from './models/Position3D';
import { ResourceCollection } from './models/ResourceModels';

/**
 * Result of scenario initialization
 */
export interface InitializationResult {
  success: boolean;
  gameState?: ScenarioGameState;
  error?: string;
}

/**
 * Extended GameState with scenario tracking properties
 */
export interface ScenarioGameState extends GameState {
  scenarioVictoryConditions?: VictoryCondition[];
  scenarioDefeatConditions?: DefeatCondition[];
  scenarioId?: string;
  scenarioStartTurn?: number;
}

/**
 * Initializes GameState from scenario configuration
 */
export class ScenarioInitializer {
  private nextPlanetId: number = 1;

  /**
   * Initialize a new GameState from scenario configuration
   * @param scenario The scenario to initialize
   * @returns InitializationResult with success status and GameState or error
   */
  public initialize(scenario: Scenario): InitializationResult {
    // Validate input
    const validationError = this.validateScenario(scenario);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    try {
      // Create new GameState and cast to ScenarioGameState
      const gameState = new GameState() as ScenarioGameState;

      // Store scenario reference
      gameState.scenarioId = scenario.id;
      gameState.scenarioVictoryConditions = [...scenario.victoryConditions];
      gameState.scenarioDefeatConditions = scenario.defeatConditions
        ? [...scenario.defeatConditions]
        : [];
      gameState.scenarioStartTurn = 1;

      // Initialize game settings
      gameState.currentTurn = 1;
      gameState.currentPhase = TurnPhase.Action;
      gameState.lastActionTime = new Date();

      // Initialize player planets
      this.initializePlayerPlanets(gameState, scenario);

      // Initialize player resources
      this.initializePlayerResources(gameState, scenario);

      // Initialize AI if enabled
      if (scenario.initialState.aiEnabled) {
        this.initializeAIPlanets(gameState, scenario);
      }

      // Rebuild lookups for O(1) access
      gameState.rebuildLookups();

      // Validate final state
      if (!gameState.validate()) {
        return {
          success: false,
          error: 'GameState validation failed after initialization',
        };
      }

      return {
        success: true,
        gameState,
      };
    } catch (error) {
      return {
        success: false,
        error: `Initialization failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Validate scenario configuration
   */
  private validateScenario(scenario: Scenario): string | null {
    if (!scenario) {
      return 'Scenario cannot be null or undefined';
    }

    if (!scenario.initialState) {
      return 'Scenario must have initialState defined';
    }

    if (!scenario.initialState.playerPlanets || scenario.initialState.playerPlanets.length === 0) {
      return 'Scenario must have at least one playerPlanets defined';
    }

    if (!scenario.victoryConditions || scenario.victoryConditions.length === 0) {
      return 'Scenario must have at least one victory condition';
    }

    return null;
  }

  /**
   * Initialize player-owned planets
   */
  private initializePlayerPlanets(gameState: GameState, scenario: Scenario): void {
    const planetIds: number[] = [];

    for (let i = 0; i < scenario.initialState.playerPlanets.length; i++) {
      const planetName = scenario.initialState.playerPlanets[i];
      const planetId = this.nextPlanetId++;

      const planet = this.createPlanet(planetId, planetName, FactionType.Player, i);
      gameState.planets.push(planet);
      planetIds.push(planetId);
    }

    gameState.playerFaction.ownedPlanetIDs = planetIds;
  }

  /**
   * Initialize AI-owned planets
   */
  private initializeAIPlanets(gameState: GameState, scenario: Scenario): void {
    const planetIds: number[] = [];

    for (let i = 0; i < scenario.initialState.aiPlanets.length; i++) {
      const planetName = scenario.initialState.aiPlanets[i];
      const planetId = this.nextPlanetId++;

      // Position AI planets further from player
      const planet = this.createPlanet(
        planetId,
        planetName,
        FactionType.AI,
        scenario.initialState.playerPlanets.length + i,
      );
      gameState.planets.push(planet);
      planetIds.push(planetId);
    }

    gameState.aiFaction.ownedPlanetIDs = planetIds;
  }

  /**
   * Create a planet entity
   */
  private createPlanet(
    id: number,
    name: string,
    owner: FactionType,
    index: number,
  ): PlanetEntity {
    const planet = new PlanetEntity();
    planet.id = id;
    planet.name = name;
    planet.owner = owner;
    planet.type = PlanetType.Tropical;

    // Generate simple positions in a grid pattern
    const angle = (index / 6) * Math.PI * 2;
    const radius = 100 + (index * 30);
    planet.position = new Position3D(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0,
    );

    // Initialize with basic resources
    planet.population = owner === FactionType.Player ? 10000 : 8000;
    planet.morale = 80;
    planet.colonized = true;

    return planet;
  }

  /**
   * Initialize player faction resources
   */
  private initializePlayerResources(gameState: GameState, scenario: Scenario): void {
    const resources = scenario.initialState.playerResources;

    gameState.playerFaction.resources = new ResourceCollection();
    gameState.playerFaction.resources.credits = resources.credits ?? 0;
    gameState.playerFaction.resources.minerals = resources.minerals ?? 0;
    gameState.playerFaction.resources.fuel = resources.fuel ?? 0;
    gameState.playerFaction.resources.food = resources.food ?? 0;
    gameState.playerFaction.resources.energy = resources.energy ?? 0;
  }
}
