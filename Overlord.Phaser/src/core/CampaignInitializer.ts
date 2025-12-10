import { GameState } from './GameState';
import { GalaxyGenerator, Galaxy } from './GalaxyGenerator';
import { TurnSystem } from './TurnSystem';
import { CampaignConfig, createCampaignConfig } from './models/CampaignConfig';
import { TurnPhase, Difficulty } from './models/Enums';

/**
 * Result of campaign initialization
 */
export interface CampaignInitializationResult {
  gameState: GameState;
  galaxy: Galaxy;
  turnSystem: TurnSystem;
  success: boolean;
  initializationTimeMs: number;
  error?: string;
}

/**
 * Campaign Initializer
 * Handles the creation and initialization of a new campaign with all required systems.
 * AC-4: Must complete within 3 seconds
 * AC-5: Galaxy with 4-6 planets, Turn 1 Income phase
 */
export class CampaignInitializer {
  /**
   * Initializes a new campaign with the given configuration
   * @param config Partial campaign configuration (uses defaults if not provided)
   * @returns Initialization result with gameState, galaxy, and turnSystem
   */
  public initializeCampaign(config?: Partial<CampaignConfig>): CampaignInitializationResult {
    const startTime = performance.now();
    // Create empty state for error handling (MAJOR-4: use same instance)
    const emptyState = new GameState();

    try {
      // Create complete configuration with defaults (AC-6)
      const campaignConfig = createCampaignConfig(config);

      // Validate configuration before use (MAJOR-2)
      if (!this.validateConfig(campaignConfig)) {
        throw new Error('Invalid campaign configuration: check difficulty, aiPersonality, galaxySeed, and startingTurn');
      }

      // Initialize game state with campaign configuration
      const gameState = new GameState();
      gameState.campaignConfig = campaignConfig;
      gameState.currentTurn = campaignConfig.startingTurn;
      gameState.currentPhase = TurnPhase.Income; // AC-5: Start in Income phase

      // Generate galaxy using seeded RNG (AC-5: 4-6 planets)
      const galaxyGenerator = new GalaxyGenerator();
      const galaxy = galaxyGenerator.generateGalaxy(campaignConfig.galaxySeed, campaignConfig.difficulty);

      // Add planets to game state
      for (const planet of galaxy.planets) {
        gameState.planets.push(planet);
      }
      gameState.rebuildLookups();

      // Initialize turn system
      const turnSystem = new TurnSystem(gameState);

      const endTime = performance.now();
      const initTimeMs = endTime - startTime;

      // Log warning if initialization exceeded target time (AC-4: soft requirement)
      if (initTimeMs > 3000) {
        console.warn(`Campaign initialization took ${initTimeMs}ms (target: <3000ms)`);
      }

      return {
        gameState,
        galaxy,
        turnSystem,
        success: true,
        initializationTimeMs: initTimeMs,
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        gameState: emptyState,
        galaxy: { seed: 0, name: '', difficulty: Difficulty.Normal, planets: [] },
        turnSystem: new TurnSystem(emptyState), // Use same emptyState instance
        success: false,
        initializationTimeMs: endTime - startTime,
        error: error instanceof Error ? error.message : 'Unknown error during initialization',
      };
    }
  }

  /**
   * Validates campaign configuration
   * @param config Configuration to validate
   * @returns True if valid, false otherwise
   */
  public validateConfig(config: CampaignConfig): boolean {
    return (
      config.difficulty !== undefined &&
      config.aiPersonality !== undefined &&
      config.galaxySeed > 0 &&
      config.startingTurn > 0
    );
  }

  /**
   * Gets estimated initialization time in milliseconds
   * Used for performance monitoring
   * @returns Estimated time in ms (target: <3000ms per AC-4)
   */
  public getEstimatedInitTime(): number {
    return 500; // Typical initialization is very fast
  }
}
