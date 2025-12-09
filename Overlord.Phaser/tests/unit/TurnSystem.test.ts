import { TurnSystem } from '@core/TurnSystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType, TurnPhase, VictoryResult } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';

describe('TurnSystem', () => {
  let gameState: GameState;
  let turnSystem: TurnSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    turnSystem = new TurnSystem(gameState);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new TurnSystem(null as any)).toThrow(
        'gameState cannot be null or undefined'
      );
    });
  });

  describe('startNewGame', () => {
    it('should set turn to 1', () => {
      turnSystem.startNewGame();

      expect(gameState.currentTurn).toBe(1);
    });

    it('should transition to Action phase (Income auto-advances)', () => {
      turnSystem.startNewGame();

      // Income phase auto-advances to Action
      expect(gameState.currentPhase).toBe(TurnPhase.Action);
    });

    it('should fire onTurnStarted event', () => {
      let startedTurn = -1;

      turnSystem.onTurnStarted = (turn) => {
        startedTurn = turn;
      };

      turnSystem.startNewGame();

      expect(startedTurn).toBe(1);
    });

    it('should fire onPhaseChanged events (Income → Action)', () => {
      const phases: TurnPhase[] = [];

      turnSystem.onPhaseChanged = (phase) => {
        phases.push(phase);
      };

      turnSystem.startNewGame();

      expect(phases).toEqual([TurnPhase.Income, TurnPhase.Action]);
    });

    it('should fire onIncomeCalculated event', () => {
      let incomeFired = false;

      turnSystem.onIncomeCalculated = () => {
        incomeFired = true;
      };

      turnSystem.startNewGame();

      expect(incomeFired).toBe(true);
    });
  });

  describe('advancePhase', () => {
    beforeEach(() => {
      turnSystem.startNewGame(); // Starts at Action phase
    });

    it('should advance from Action to Combat', () => {
      turnSystem.advancePhase();

      expect(gameState.currentPhase).toBe(TurnPhase.Combat);
    });

    it('should advance from Combat to End', () => {
      turnSystem.advancePhase(); // Action → Combat
      turnSystem.advancePhase(); // Combat → End

      expect(gameState.currentPhase).toBe(TurnPhase.End);
    });

    it('should advance from End to Income (new turn)', () => {
      turnSystem.advancePhase(); // Action → Combat
      turnSystem.advancePhase(); // Combat → End
      turnSystem.advancePhase(); // End → Income (turn 2)

      expect(gameState.currentTurn).toBe(2);
      expect(gameState.currentPhase).toBe(TurnPhase.Action); // Income auto-advances
    });

    it('should fire onPhaseChanged event', () => {
      let changedPhase: TurnPhase | undefined;

      turnSystem.onPhaseChanged = (phase) => {
        changedPhase = phase;
      };

      turnSystem.advancePhase();

      expect(changedPhase).toBe(TurnPhase.Combat);
    });
  });

  describe('completeTurn', () => {
    beforeEach(() => {
      turnSystem.startNewGame();
    });

    it('should increment turn counter', () => {
      // Complete full turn cycle: Action → Combat → End → Income (turn 2)
      turnSystem.advancePhase();
      turnSystem.advancePhase();
      turnSystem.advancePhase();

      expect(gameState.currentTurn).toBe(2);
    });

    it('should fire onTurnEnded and onTurnStarted events', () => {
      let endedTurn = -1;
      let startedTurn = -1;

      turnSystem.onTurnEnded = (turn) => {
        endedTurn = turn;
      };

      turnSystem.onTurnStarted = (turn) => {
        if (turn > 1) { // Ignore initial turn start
          startedTurn = turn;
        }
      };

      // Complete turn cycle
      turnSystem.advancePhase();
      turnSystem.advancePhase();
      turnSystem.advancePhase();

      expect(endedTurn).toBe(1);
      expect(startedTurn).toBe(2);
    });

    it('should check victory conditions before advancing turn', () => {
      let victoryResult: VictoryResult | undefined;

      turnSystem.onVictoryAchieved = (result) => {
        victoryResult = result;
      };

      // Remove all AI planets
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.AI);
      gameState.rebuildLookups();

      // Complete turn cycle
      turnSystem.advancePhase();
      turnSystem.advancePhase();
      turnSystem.advancePhase();

      expect(victoryResult).toBe(VictoryResult.PlayerVictory);
      expect(gameState.currentTurn).toBe(1); // Turn doesn't increment on victory
    });
  });

  describe('checkVictoryConditions', () => {
    it('should return None when both players have planets', () => {
      const result = turnSystem.checkVictoryConditions();

      expect(result).toBe(VictoryResult.None);
    });

    it('should return PlayerVictory when AI has no planets', () => {
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.AI);
      gameState.rebuildLookups();

      const result = turnSystem.checkVictoryConditions();

      expect(result).toBe(VictoryResult.PlayerVictory);
    });

    it('should return AIVictory when Player has no planets', () => {
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.Player);
      gameState.rebuildLookups();

      const result = turnSystem.checkVictoryConditions();

      expect(result).toBe(VictoryResult.AIVictory);
    });
  });

  describe('processIncomePhase', () => {
    it('should throw error if not in Income phase', () => {
      gameState.currentPhase = TurnPhase.Action;

      expect(() => turnSystem.processIncomePhase()).toThrow(
        'Cannot process income during Action phase'
      );
    });

    it('should return income delta during Income phase', () => {
      gameState.currentPhase = TurnPhase.Income;

      const income = turnSystem.processIncomePhase();

      expect(income.credits).toBeGreaterThan(0);
      expect(income.minerals).toBeGreaterThan(0);
      expect(income.fuel).toBeGreaterThan(0);
      expect(income.food).toBeGreaterThan(0);
      expect(income.energy).toBeGreaterThan(0);
    });

    it('should fire onIncomeCalculated event', () => {
      let incomeFired = false;

      turnSystem.onIncomeCalculated = () => {
        incomeFired = true;
      };

      gameState.currentPhase = TurnPhase.Income;
      turnSystem.processIncomePhase();

      expect(incomeFired).toBe(true);
    });
  });

  describe('Getters', () => {
    it('should return current turn', () => {
      gameState.currentTurn = 5;

      expect(turnSystem.currentTurn).toBe(5);
    });

    it('should return current phase', () => {
      gameState.currentPhase = TurnPhase.Combat;

      expect(turnSystem.currentPhase).toBe(TurnPhase.Combat);
    });
  });

  describe('Full turn cycle', () => {
    it('should execute complete turn cycle correctly', () => {
      const events: string[] = [];

      turnSystem.onPhaseChanged = (phase) => {
        events.push(`Phase: ${phase}`);
      };

      turnSystem.onTurnEnded = (turn) => {
        events.push(`Turn ${turn} Ended`);
      };

      turnSystem.onTurnStarted = (turn) => {
        if (turn > 1) {
          events.push(`Turn ${turn} Started`);
        }
      };

      turnSystem.startNewGame();

      // Full cycle: Action → Combat → End → Income (turn 2) → Action
      turnSystem.advancePhase();
      turnSystem.advancePhase();
      turnSystem.advancePhase();

      expect(events).toEqual([
        'Phase: Income',
        'Phase: Action',
        'Phase: Combat',
        'Phase: End',
        'Turn 1 Ended',
        'Turn 2 Started',
        'Phase: Income',
        'Phase: Action'
      ]);
    });
  });
});

/**
 * Helper function to create a test game state with 2 player planets and 1 AI planet.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Player planet 1
  const playerPlanet1 = new PlanetEntity();
  playerPlanet1.id = 0;
  playerPlanet1.name = 'Starbase';
  playerPlanet1.type = PlanetType.Metropolis;
  playerPlanet1.owner = FactionType.Player;
  playerPlanet1.position = new Position3D(0, 0, 0);
  playerPlanet1.colonized = true;

  // Player planet 2
  const playerPlanet2 = new PlanetEntity();
  playerPlanet2.id = 1;
  playerPlanet2.name = 'Colony Alpha';
  playerPlanet2.type = PlanetType.Tropical;
  playerPlanet2.owner = FactionType.Player;
  playerPlanet2.position = new Position3D(50, 0, 0);
  playerPlanet2.colonized = true;

  // AI planet
  const aiPlanet = new PlanetEntity();
  aiPlanet.id = 2;
  aiPlanet.name = 'Hitotsu';
  aiPlanet.type = PlanetType.Metropolis;
  aiPlanet.owner = FactionType.AI;
  aiPlanet.position = new Position3D(-100, 0, 0);
  aiPlanet.colonized = true;

  gameState.planets.push(playerPlanet1);
  gameState.planets.push(playerPlanet2);
  gameState.planets.push(aiPlanet);
  gameState.rebuildLookups();

  return gameState;
}
