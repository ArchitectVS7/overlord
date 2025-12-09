import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { Position3D } from '@core/models/Position3D';
import { FactionType, PlanetType } from '@core/models/Enums';

describe('GameState', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const state = new GameState();
      expect(state.currentTurn).toBe(1);
      expect(state.planets).toEqual([]);
    });
  });

  describe('validate', () => {
    it('should return true for valid state', () => {
      const state = new GameState();
      state.planets = [
        {
          id: 0,
          name: 'Test',
          type: PlanetType.Metropolis,
          owner: FactionType.Player,
          position: new Position3D(),
          visualSeed: 1,
          rotationSpeed: 0.3,
          scaleMultiplier: 1.0,
          colonized: true
        }
      ];
      expect(state.validate()).toBe(true);
    });

    it('should return true for empty planet list', () => {
      const state = new GameState();
      expect(state.validate()).toBe(true);
    });

    it('should return false if too many planets', () => {
      const state = new GameState();
      for (let i = 0; i < 7; i++) {
        state.planets.push({
          id: i,
          name: `Planet ${i}`,
          type: PlanetType.Volcanic,
          owner: FactionType.Neutral,
          position: new Position3D(),
          visualSeed: i,
          rotationSpeed: 0.3,
          scaleMultiplier: 1.0,
          colonized: false
        });
      }
      expect(state.validate()).toBe(false);
    });

    it('should return false for duplicate planet IDs', () => {
      const state = new GameState();
      state.planets = [
        {
          id: 1,
          name: 'Planet A',
          type: PlanetType.Volcanic,
          owner: FactionType.Neutral,
          position: new Position3D(),
          visualSeed: 1,
          rotationSpeed: 0.3,
          scaleMultiplier: 1.0,
          colonized: false
        },
        {
          id: 1,
          name: 'Planet B',
          type: PlanetType.Desert,
          owner: FactionType.Neutral,
          position: new Position3D(),
          visualSeed: 2,
          rotationSpeed: 0.3,
          scaleMultiplier: 1.0,
          colonized: false
        }
      ];
      expect(state.validate()).toBe(false);
    });

    it('should return false for invalid turn number', () => {
      const state = new GameState();
      state.currentTurn = 0;
      expect(state.validate()).toBe(false);
    });

    it('should return false for negative turn number', () => {
      const state = new GameState();
      state.currentTurn = -1;
      expect(state.validate()).toBe(false);
    });

    it('should return true for exactly 6 planets', () => {
      const state = new GameState();
      for (let i = 0; i < 6; i++) {
        state.planets.push({
          id: i,
          name: `Planet ${i}`,
          type: PlanetType.Volcanic,
          owner: FactionType.Neutral,
          position: new Position3D(),
          visualSeed: i,
          rotationSpeed: 0.3,
          scaleMultiplier: 1.0,
          colonized: false
        });
      }
      expect(state.validate()).toBe(true);
    });
  });
});
