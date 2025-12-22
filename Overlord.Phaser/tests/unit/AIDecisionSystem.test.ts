import { GameState } from '@core/GameState';
import { AIDecisionSystem } from '@core/AIDecisionSystem';
import { IncomeSystem } from '@core/IncomeSystem';
import { ResourceSystem } from '@core/ResourceSystem';
import { BuildingSystem } from '@core/BuildingSystem';
import { CraftSystem } from '@core/CraftSystem';
import { PlatoonSystem } from '@core/PlatoonSystem';
import { EntitySystem } from '@core/EntitySystem';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { Position3D } from '@core/models/Position3D';
import { FactionType, PlanetType, AIPersonality, AIDifficulty } from '@core/models/Enums';

describe('AIDecisionSystem', () => {
  test('guarantees a state change when no other actions are possible', () => {
    const gameState = new GameState();

    const playerPlanet = new PlanetEntity();
    playerPlanet.id = 0;
    playerPlanet.name = 'Starbase';
    playerPlanet.type = PlanetType.Terran;
    playerPlanet.owner = FactionType.Player;
    playerPlanet.position = new Position3D(0, 0, 0);
    playerPlanet.colonized = true;

    const aiPlanet = new PlanetEntity();
    aiPlanet.id = 1;
    aiPlanet.name = 'Hitotsu';
    aiPlanet.type = PlanetType.Metropolis;
    aiPlanet.owner = FactionType.AI;
    aiPlanet.position = new Position3D(100, 0, 0);
    aiPlanet.colonized = true;
    aiPlanet.taxRate = 50;
    aiPlanet.resources.credits = 0;
    aiPlanet.resources.minerals = 0;
    aiPlanet.resources.fuel = 0;
    aiPlanet.resources.food = 0;
    aiPlanet.resources.energy = 0;

    gameState.planets.push(playerPlanet, aiPlanet);
    gameState.rebuildLookups();

    gameState.aiFaction.resources.credits = 0;
    gameState.aiFaction.resources.minerals = 0;
    gameState.aiFaction.resources.fuel = 0;
    gameState.aiFaction.resources.food = 0;
    gameState.aiFaction.resources.energy = 0;

    const resourceSystem = new ResourceSystem(gameState);
    const incomeSystem = new IncomeSystem(gameState, resourceSystem);
    const buildingSystem = new BuildingSystem(gameState);
    const entitySystem = new EntitySystem(gameState);
    const craftSystem = new CraftSystem(gameState, entitySystem);
    const platoonSystem = new PlatoonSystem(gameState, entitySystem);

    const aiSystem = new AIDecisionSystem(
      gameState,
      incomeSystem,
      resourceSystem,
      buildingSystem,
      craftSystem,
      platoonSystem,
      AIPersonality.Balanced,
      AIDifficulty.Normal,
      () => 1,
    );

    const startingTaxRate = aiPlanet.taxRate;
    aiSystem.executeAITurn();

    expect(aiPlanet.taxRate).not.toBe(startingTaxRate);
  });
});
