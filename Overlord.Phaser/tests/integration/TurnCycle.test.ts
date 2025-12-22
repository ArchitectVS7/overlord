import { GameState } from '@core/GameState';
import { TurnSystem } from '@core/TurnSystem';
import { PhaseProcessor, EndPhaseResult } from '@core/PhaseProcessor';
import { AIDecisionSystem } from '@core/AIDecisionSystem';
import { EntitySystem } from '@core/EntitySystem';
import { CraftSystem } from '@core/CraftSystem';
import { PlatoonSystem } from '@core/PlatoonSystem';
import { CombatSystem } from '@core/CombatSystem';
import { InvasionSystem } from '@core/InvasionSystem';
import { NavigationSystem } from '@core/NavigationSystem';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { TurnPhase, FactionType, PlanetType, CraftType, VictoryResult, AIDifficulty, AIPersonality, BuildingType, BuildingStatus } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { Structure } from '@core/models/BuildingModels';

describe('Full Turn Cycle Integration', () => {
  let gameState: GameState;
  let turnSystem: TurnSystem;
  let phaseProcessor: PhaseProcessor;
  let aiDecisionSystem: AIDecisionSystem;
  let entitySystem: EntitySystem;
  let craftSystem: CraftSystem;
  let platoonSystem: PlatoonSystem;
  let combatSystem: CombatSystem;
  let invasionSystem: InvasionSystem;
  let navigationSystem: NavigationSystem;

  beforeEach(() => {
    gameState = createFullGameState();
    turnSystem = new TurnSystem(gameState);
    phaseProcessor = new PhaseProcessor(gameState);
    entitySystem = new EntitySystem(gameState);
    craftSystem = new CraftSystem(gameState, entitySystem);
    platoonSystem = new PlatoonSystem(gameState, entitySystem);
    combatSystem = new CombatSystem(gameState, platoonSystem);
    invasionSystem = new InvasionSystem(gameState, combatSystem);
    navigationSystem = new NavigationSystem(gameState, phaseProcessor.getResourceSystem(), combatSystem);

    // Configure AI with deterministic random for reproducible tests
    let randomSeed = 42;
    const deterministicRandom = () => {
      randomSeed = (randomSeed * 1103515245 + 12345) & 0x7fffffff;
      return randomSeed / 0x7fffffff;
    };

    aiDecisionSystem = new AIDecisionSystem(
      gameState,
      phaseProcessor.getIncomeSystem(),
      phaseProcessor.getResourceSystem(),
      phaseProcessor.getBuildingSystem(),
      craftSystem,
      platoonSystem,
      AIPersonality.Balanced,
      AIDifficulty.Normal,
      deterministicRandom,
    );
    aiDecisionSystem.setNavigationSystem(navigationSystem);

    // Configure PhaseProcessor
    phaseProcessor.configureEndPhase({
      aiDecisionSystem,
      victoryChecker: () => turnSystem.checkVictoryConditions(),
    });

    phaseProcessor.configureInvasionSystem({
      invasionSystem,
      combatSystem,
      platoonSystem,
    });
  });

  describe('Player Turn Flow', () => {
    it('should produce state changes across full turn cycle', () => {
      const initialCredits = gameState.playerFaction.resources.credits;
      const initialTurn = gameState.currentTurn;

      // Start game at Income phase
      turnSystem.startNewGame();
      expect(gameState.currentPhase).toBe(TurnPhase.Income);

      // Process Income phase - should generate resources
      phaseProcessor.processPhase(TurnPhase.Income);
      expect(gameState.playerFaction.resources.credits).toBeGreaterThan(initialCredits);

      // Advance to Action phase
      turnSystem.advancePhase();
      expect(gameState.currentPhase).toBe(TurnPhase.Action);

      // Action phase has no auto-processing
      phaseProcessor.processPhase(TurnPhase.Action);

      // Advance to Combat phase
      turnSystem.advancePhase();
      expect(gameState.currentPhase).toBe(TurnPhase.Combat);
      phaseProcessor.processPhase(TurnPhase.Combat);

      // Advance to End phase
      turnSystem.advancePhase();
      expect(gameState.currentPhase).toBe(TurnPhase.End);

      // Process End phase (AI turn)
      const endResult = phaseProcessor.processPhase(TurnPhase.End) as EndPhaseResult;
      expect(endResult.aiTurnProcessed).toBe(true);

      // Advance to next turn
      turnSystem.advancePhase();
      expect(gameState.currentTurn).toBe(initialTurn + 1);
      expect(gameState.currentPhase).toBe(TurnPhase.Income);
    });

    it('should increment turn counter after full cycle', () => {
      turnSystem.startNewGame();
      expect(gameState.currentTurn).toBe(1);

      // Complete full turn
      turnSystem.advancePhase(); // Income -> Action
      turnSystem.advancePhase(); // Action -> Combat
      turnSystem.advancePhase(); // Combat -> End
      turnSystem.advancePhase(); // End -> Income (turn 2)

      expect(gameState.currentTurn).toBe(2);
    });
  });

  describe('AI Turn Guarantees State Change', () => {
    it('should always mutate state during AI turn via fallback', () => {
      // Snapshot AI state before turn
      const beforeCredits = gameState.aiFaction.resources.credits;
      const beforePlanets = gameState.planets.filter(p => p.owner === FactionType.AI);
      const beforeTaxRates = beforePlanets.map(p => p.taxRate);
      const beforeBuildCount = beforePlanets.reduce(
        (sum, p) => sum + p.structures.filter(s => s.status === BuildingStatus.UnderConstruction).length, 0
      );
      const beforePlatoonCount = gameState.platoons.filter(p => p.owner === FactionType.AI).length;

      // Execute AI turn
      aiDecisionSystem.executeAITurn();

      // Snapshot AI state after turn
      const afterCredits = gameState.aiFaction.resources.credits;
      const afterPlanets = gameState.planets.filter(p => p.owner === FactionType.AI);
      const afterTaxRates = afterPlanets.map(p => p.taxRate);
      const afterBuildCount = afterPlanets.reduce(
        (sum, p) => sum + p.structures.filter(s => s.status === BuildingStatus.UnderConstruction).length, 0
      );
      const afterPlatoonCount = gameState.platoons.filter(p => p.owner === FactionType.AI).length;

      // Verify at least one change occurred
      const stateChanged =
        afterCredits !== beforeCredits ||
        JSON.stringify(afterTaxRates) !== JSON.stringify(beforeTaxRates) ||
        afterBuildCount !== beforeBuildCount ||
        afterPlatoonCount !== beforePlatoonCount;

      expect(stateChanged).toBe(true);
    });

    it('should fire onAIDefeated when AI owns no planets', () => {
      let defeatedFired = false;
      aiDecisionSystem.onAIDefeated = () => {
        defeatedFired = true;
      };

      // Remove all AI planets
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.AI);
      gameState.rebuildLookups();

      // Execute AI turn - should trigger defeat event
      aiDecisionSystem.executeAITurn();

      expect(defeatedFired).toBe(true);
    });
  });

  describe('Combat Resolution', () => {
    it('should resolve space combat when opposing fleets meet', () => {
      // Setup: Place unequal opposing fleets at player planet
      // Give player 2 cruisers vs AI 1 cruiser to ensure damage occurs
      // (equal strength battles result in 0 damage)
      setupOpposingFleetsAtPlanet(gameState, 0, 2, 1);

      const initialCraftCount = gameState.craft.length;

      // Process combat phase
      const result = phaseProcessor.processCombatPhase();

      expect(result.success).toBe(true);
      expect(result.battlesResolved).toBeGreaterThan(0);
      // Combat should damage or destroy some craft (loser takes damage)
      const someCraftDamaged = gameState.craft.some(c => c.health < 100);
      const someCraftDestroyed = gameState.craft.length < initialCraftCount;
      expect(someCraftDamaged || someCraftDestroyed).toBe(true);
    });
  });

  describe('Victory Conditions', () => {
    it('should detect player victory when AI has no planets', () => {
      // Remove all AI planets
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.AI);
      gameState.rebuildLookups();

      const result = turnSystem.checkVictoryConditions();
      expect(result).toBe(VictoryResult.PlayerVictory);
    });

    it('should detect AI victory when player has no planets', () => {
      // Remove all player planets
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.Player);
      gameState.rebuildLookups();

      const result = turnSystem.checkVictoryConditions();
      expect(result).toBe(VictoryResult.AIVictory);
    });

    it('should return None when both factions have planets', () => {
      const result = turnSystem.checkVictoryConditions();
      expect(result).toBe(VictoryResult.None);
    });
  });

  describe('Configuration Validation', () => {
    it('should report fully configured when all systems are set up', () => {
      const config = phaseProcessor.validateConfiguration();

      expect(config.valid).toBe(true);
      expect(config.warnings).toHaveLength(0);
    });

    it('should report isAIConfigured as true after configuration', () => {
      expect(phaseProcessor.isAIConfigured()).toBe(true);
    });

    it('should report isInvasionConfigured as true after configuration', () => {
      expect(phaseProcessor.isInvasionConfigured()).toBe(true);
    });
  });
});

/**
 * Creates a complete game state with planets, buildings, resources, and initial setup
 * for both player and AI factions.
 */
function createFullGameState(): GameState {
  const gameState = new GameState();

  // Player planet 1 (home planet - Metropolis)
  const playerPlanet1 = new PlanetEntity();
  playerPlanet1.id = 0;
  playerPlanet1.name = 'Starbase';
  playerPlanet1.type = PlanetType.Metropolis;
  playerPlanet1.owner = FactionType.Player;
  playerPlanet1.position = new Position3D(0, 0, 0);
  playerPlanet1.colonized = true;
  playerPlanet1.population = 500;
  playerPlanet1.maxPopulation = 1000;
  playerPlanet1.morale = 80;
  playerPlanet1.taxRate = 50;
  playerPlanet1.resources.credits = 50000;
  playerPlanet1.resources.minerals = 1000;
  playerPlanet1.resources.fuel = 500;
  playerPlanet1.resources.food = 1000;
  playerPlanet1.resources.energy = 500;

  // Add active mining station
  const playerMining = new Structure();
  playerMining.id = 1;
  playerMining.type = BuildingType.MiningStation;
  playerMining.status = BuildingStatus.Active;
  playerMining.turnsRemaining = 0;
  playerPlanet1.structures.push(playerMining);

  // Add active docking bay
  const playerDocking = new Structure();
  playerDocking.id = 2;
  playerDocking.type = BuildingType.DockingBay;
  playerDocking.status = BuildingStatus.Active;
  playerDocking.turnsRemaining = 0;
  playerPlanet1.structures.push(playerDocking);

  // Player planet 2 (Tropical)
  const playerPlanet2 = new PlanetEntity();
  playerPlanet2.id = 1;
  playerPlanet2.name = 'Colony Alpha';
  playerPlanet2.type = PlanetType.Tropical;
  playerPlanet2.owner = FactionType.Player;
  playerPlanet2.position = new Position3D(100, 0, 0);
  playerPlanet2.colonized = true;
  playerPlanet2.population = 200;
  playerPlanet2.maxPopulation = 800;
  playerPlanet2.morale = 70;
  playerPlanet2.taxRate = 50;
  playerPlanet2.resources.credits = 10000;
  playerPlanet2.resources.food = 500;

  // AI planet 1 (Metropolis - home planet)
  const aiPlanet1 = new PlanetEntity();
  aiPlanet1.id = 2;
  aiPlanet1.name = 'Hitotsu';
  aiPlanet1.type = PlanetType.Metropolis;
  aiPlanet1.owner = FactionType.AI;
  aiPlanet1.position = new Position3D(-150, 0, 0);
  aiPlanet1.colonized = true;
  aiPlanet1.population = 400;
  aiPlanet1.maxPopulation = 1000;
  aiPlanet1.morale = 75;
  aiPlanet1.taxRate = 50;
  aiPlanet1.resources.credits = 50000;
  aiPlanet1.resources.minerals = 1000;
  aiPlanet1.resources.fuel = 500;
  aiPlanet1.resources.food = 1000;
  aiPlanet1.resources.energy = 500;

  // Add AI mining station
  const aiMining = new Structure();
  aiMining.id = 3;
  aiMining.type = BuildingType.MiningStation;
  aiMining.status = BuildingStatus.Active;
  aiMining.turnsRemaining = 0;
  aiPlanet1.structures.push(aiMining);

  // Add AI docking bay
  const aiDocking = new Structure();
  aiDocking.id = 4;
  aiDocking.type = BuildingType.DockingBay;
  aiDocking.status = BuildingStatus.Active;
  aiDocking.turnsRemaining = 0;
  aiPlanet1.structures.push(aiDocking);

  // AI planet 2 (Desert)
  const aiPlanet2 = new PlanetEntity();
  aiPlanet2.id = 3;
  aiPlanet2.name = 'Futatsu';
  aiPlanet2.type = PlanetType.Desert;
  aiPlanet2.owner = FactionType.AI;
  aiPlanet2.position = new Position3D(-200, 0, 50);
  aiPlanet2.colonized = true;
  aiPlanet2.population = 150;
  aiPlanet2.maxPopulation = 600;
  aiPlanet2.morale = 70;
  aiPlanet2.taxRate = 50;
  aiPlanet2.resources.credits = 20000;
  aiPlanet2.resources.fuel = 300;

  // Neutral planet
  const neutralPlanet = new PlanetEntity();
  neutralPlanet.id = 4;
  neutralPlanet.name = 'Uncharted';
  neutralPlanet.type = PlanetType.Volcanic;
  neutralPlanet.owner = FactionType.Neutral;
  neutralPlanet.position = new Position3D(0, 0, 150);
  neutralPlanet.colonized = false;
  neutralPlanet.population = 0;

  gameState.planets.push(playerPlanet1);
  gameState.planets.push(playerPlanet2);
  gameState.planets.push(aiPlanet1);
  gameState.planets.push(aiPlanet2);
  gameState.planets.push(neutralPlanet);

  // Initialize faction resources
  gameState.playerFaction.resources.credits = 100000;
  gameState.playerFaction.resources.minerals = 5000;
  gameState.playerFaction.resources.fuel = 2000;
  gameState.playerFaction.resources.food = 3000;
  gameState.playerFaction.resources.energy = 2000;

  gameState.aiFaction.resources.credits = 100000;
  gameState.aiFaction.resources.minerals = 5000;
  gameState.aiFaction.resources.fuel = 2000;
  gameState.aiFaction.resources.food = 3000;
  gameState.aiFaction.resources.energy = 2000;

  gameState.rebuildLookups();

  return gameState;
}

/**
 * Sets up opposing Battle Cruisers at a planet for combat testing.
 * @param playerCruisers Number of player cruisers to create (default 1)
 * @param aiCruisers Number of AI cruisers to create (default 1)
 */
function setupOpposingFleetsAtPlanet(
  gameState: GameState,
  planetId: number,
  playerCruisers: number = 1,
  aiCruisers: number = 1,
): void {
  const planet = gameState.planetLookup.get(planetId);
  if (!planet) return;

  let craftId = 100;

  // Create player Battle Cruisers
  for (let i = 0; i < playerCruisers; i++) {
    const playerCruiser = new CraftEntity();
    playerCruiser.id = craftId++;
    playerCruiser.type = CraftType.BattleCruiser;
    playerCruiser.owner = FactionType.Player;
    playerCruiser.planetID = planetId;
    playerCruiser.health = 100;
    playerCruiser.inTransit = false;
    gameState.craft.push(playerCruiser);
    planet.dockedCraftIDs.push(playerCruiser.id);
  }

  // Create AI Battle Cruisers
  for (let i = 0; i < aiCruisers; i++) {
    const aiCruiser = new CraftEntity();
    aiCruiser.id = craftId++;
    aiCruiser.type = CraftType.BattleCruiser;
    aiCruiser.owner = FactionType.AI;
    aiCruiser.planetID = planetId;
    aiCruiser.health = 100;
    aiCruiser.inTransit = false;
    gameState.craft.push(aiCruiser);
    planet.dockedCraftIDs.push(aiCruiser.id);
  }

  gameState.rebuildLookups();
}
