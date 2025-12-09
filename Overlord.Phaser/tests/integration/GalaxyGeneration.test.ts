import { GalaxyGenerator } from '@core/GalaxyGenerator';
import { GameState } from '@core/GameState';
import { Difficulty } from '@core/models/Enums';

describe('Galaxy Generation Integration', () => {
  it('should generate valid galaxy and initialize game state', () => {
    // Generate galaxy
    const generator = new GalaxyGenerator();
    const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

    // Initialize game state
    const gameState = new GameState();
    gameState.planets = galaxy.planets;

    // Validate
    expect(gameState.validate()).toBe(true);
    expect(gameState.planets.length).toBe(5);
    expect(gameState.currentTurn).toBe(1);
  });

  it('should produce same galaxy across multiple runs with same seed', () => {
    const generator = new GalaxyGenerator();
    const seed = 99999;

    const run1 = generator.generateGalaxy(seed, Difficulty.Hard);
    const run2 = generator.generateGalaxy(seed, Difficulty.Hard);

    expect(run1.planets.length).toBe(run2.planets.length);
    expect(run1.name).toBe(run2.name);

    // Check planet positions match
    for (let i = 0; i < run1.planets.length; i++) {
      expect(run1.planets[i].name).toBe(run2.planets[i].name);
      expect(run1.planets[i].position.x).toBeCloseTo(run2.planets[i].position.x, 5);
      expect(run1.planets[i].position.y).toBeCloseTo(run2.planets[i].position.y, 5);
      expect(run1.planets[i].position.z).toBeCloseTo(run2.planets[i].position.z, 5);
    }
  });

  it('should work with all difficulty levels', () => {
    const generator = new GalaxyGenerator();
    const seed = 12345;

    const easyGame = new GameState();
    easyGame.planets = generator.generateGalaxy(seed, Difficulty.Easy).planets;
    expect(easyGame.validate()).toBe(true);
    expect(easyGame.planets.length).toBe(6);

    const normalGame = new GameState();
    normalGame.planets = generator.generateGalaxy(seed, Difficulty.Normal).planets;
    expect(normalGame.validate()).toBe(true);
    expect(normalGame.planets.length).toBe(5);

    const hardGame = new GameState();
    hardGame.planets = generator.generateGalaxy(seed, Difficulty.Hard).planets;
    expect(hardGame.validate()).toBe(true);
    expect(hardGame.planets.length).toBe(4);
  });
});
