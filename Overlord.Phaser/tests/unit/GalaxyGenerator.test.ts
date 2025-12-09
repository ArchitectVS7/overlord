import { GalaxyGenerator } from '@core/GalaxyGenerator';
import { Difficulty, FactionType, PlanetType } from '@core/models/Enums';

describe('GalaxyGenerator', () => {
  describe('deterministic generation', () => {
    it('should generate identical galaxies with same seed', () => {
      const generator = new GalaxyGenerator();
      const seed = 12345;

      const galaxy1 = generator.generateGalaxy(seed, Difficulty.Normal);
      const galaxy2 = generator.generateGalaxy(seed, Difficulty.Normal);

      expect(galaxy1.seed).toBe(galaxy2.seed);
      expect(galaxy1.name).toBe(galaxy2.name);
      expect(galaxy1.planets.length).toBe(galaxy2.planets.length);

      // Verify positions are identical (critical for determinism)
      for (let i = 0; i < galaxy1.planets.length; i++) {
        const p1 = galaxy1.planets[i];
        const p2 = galaxy2.planets[i];
        expect(p1.name).toBe(p2.name);
        expect(p1.type).toBe(p2.type);
        expect(p1.owner).toBe(p2.owner);
        expect(p1.position.x).toBeCloseTo(p2.position.x, 5);
        expect(p1.position.y).toBeCloseTo(p2.position.y, 5);
        expect(p1.position.z).toBeCloseTo(p2.position.z, 5);
        expect(p1.visualSeed).toBe(p2.visualSeed);
        expect(p1.rotationSpeed).toBeCloseTo(p2.rotationSpeed, 5);
        expect(p1.scaleMultiplier).toBeCloseTo(p2.scaleMultiplier, 5);
      }
    });

    it('should generate different galaxies with different seeds', () => {
      const generator = new GalaxyGenerator();

      const galaxy1 = generator.generateGalaxy(111, Difficulty.Normal);
      const galaxy2 = generator.generateGalaxy(222, Difficulty.Normal);

      expect(galaxy1.seed).not.toBe(galaxy2.seed);
      expect(galaxy1.name).not.toBe(galaxy2.name);

      // At least one planet should have different position
      let hasDifferentPosition = false;
      for (let i = 0; i < Math.min(galaxy1.planets.length, galaxy2.planets.length); i++) {
        const p1 = galaxy1.planets[i].position;
        const p2 = galaxy2.planets[i].position;
        if (Math.abs(p1.x - p2.x) > 0.001 || Math.abs(p1.z - p2.z) > 0.001) {
          hasDifferentPosition = true;
          break;
        }
      }
      expect(hasDifferentPosition).toBe(true);
    });
  });

  describe('difficulty levels', () => {
    it('should generate 6 planets for Easy', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Easy);
      expect(galaxy.planets.length).toBe(6);
      expect(galaxy.difficulty).toBe(Difficulty.Easy);
    });

    it('should generate 5 planets for Normal', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Normal);
      expect(galaxy.planets.length).toBe(5);
      expect(galaxy.difficulty).toBe(Difficulty.Normal);
    });

    it('should generate 4 planets for Hard', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Hard);
      expect(galaxy.planets.length).toBe(4);
      expect(galaxy.difficulty).toBe(Difficulty.Hard);
    });
  });

  describe('starting planets', () => {
    it('should always generate Starbase and Hitotsu', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

      const starbase = galaxy.planets.find(p => p.name === 'Starbase');
      const hitotsu = galaxy.planets.find(p => p.name === 'Hitotsu');

      expect(starbase).toBeDefined();
      expect(hitotsu).toBeDefined();
      expect(starbase!.owner).toBe(FactionType.Player);
      expect(hitotsu!.owner).toBe(FactionType.AI);
      expect(starbase!.type).toBe(PlanetType.Metropolis);
      expect(hitotsu!.type).toBe(PlanetType.Metropolis);
      expect(starbase!.colonized).toBe(true);
      expect(hitotsu!.colonized).toBe(true);
    });

    it('should place Starbase and Hitotsu opposite each other', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

      const starbase = galaxy.planets.find(p => p.name === 'Starbase')!;
      const hitotsu = galaxy.planets.find(p => p.name === 'Hitotsu')!;

      const starbaseAngle = starbase.position.getAngleXZ();
      const hitotsuAngle = hitotsu.position.getAngleXZ();
      let angleDiff = Math.abs(starbaseAngle - hitotsuAngle);

      // Normalize to [0, 2π]
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
      }

      // Should be close to π (±0.5 radians = ±28.6°)
      expect(angleDiff).toBeGreaterThan(Math.PI - 0.5);
      expect(angleDiff).toBeLessThan(Math.PI + 0.5);
    });

    it('should assign sequential IDs starting from 0', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

      expect(galaxy.planets[0].id).toBe(0); // Starbase
      expect(galaxy.planets[1].id).toBe(1); // Hitotsu
      expect(galaxy.planets[2].id).toBe(2); // Planet A
      expect(galaxy.planets[3].id).toBe(3); // Planet B
      expect(galaxy.planets[4].id).toBe(4); // Planet C
    });
  });

  describe('neutral planets', () => {
    it('should generate neutral planets with valid types', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

      const neutralPlanets = galaxy.planets.filter(p => p.owner === FactionType.Neutral);
      expect(neutralPlanets.length).toBe(3); // Normal = 5 total - 2 starting

      neutralPlanets.forEach(planet => {
        expect([PlanetType.Volcanic, PlanetType.Desert, PlanetType.Tropical])
          .toContain(planet.type);
        expect(planet.colonized).toBe(false);
      });
    });

    it('should name neutral planets sequentially (Planet A, B, C...)', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Easy); // 6 planets = 4 neutral

      const neutralPlanets = galaxy.planets.filter(p => p.owner === FactionType.Neutral);
      const names = neutralPlanets.map(p => p.name).sort();

      expect(names).toContain('Planet A');
      expect(names).toContain('Planet B');
      expect(names).toContain('Planet C');
      expect(names).toContain('Planet D');
    });

    it('should avoid planet collisions (min 50 units apart)', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Easy); // 6 planets

      const minDistance = 50;
      for (let i = 0; i < galaxy.planets.length; i++) {
        for (let j = i + 1; j < galaxy.planets.length; j++) {
          const distance = galaxy.planets[i].position.distanceTo(galaxy.planets[j].position);
          expect(distance).toBeGreaterThanOrEqual(minDistance);
        }
      }
    });
  });

  describe('planet properties', () => {
    it('should assign unique visual seeds to each planet', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Normal);

      const seeds = galaxy.planets.map(p => p.visualSeed);
      const uniqueSeeds = new Set(seeds);
      expect(uniqueSeeds.size).toBe(galaxy.planets.length);
    });

    it('should assign rotation speeds between 0.1 and 0.5', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Easy);

      galaxy.planets.forEach(planet => {
        expect(planet.rotationSpeed).toBeGreaterThanOrEqual(0.1);
        expect(planet.rotationSpeed).toBeLessThanOrEqual(0.5);
      });
    });

    it('should assign scale multipliers between 1.0 and 1.5', () => {
      const generator = new GalaxyGenerator();
      const galaxy = generator.generateGalaxy(42, Difficulty.Easy);

      galaxy.planets.forEach(planet => {
        expect(planet.scaleMultiplier).toBeGreaterThanOrEqual(1.0);
        expect(planet.scaleMultiplier).toBeLessThanOrEqual(1.5);
      });
    });
  });

  describe('galaxy metadata', () => {
    it('should generate galaxy name from seed', () => {
      const generator = new GalaxyGenerator();

      const galaxy1 = generator.generateGalaxy(1234, Difficulty.Normal);
      expect(galaxy1.name).toBe('System Alpha-1234');

      const galaxy2 = generator.generateGalaxy(5678, Difficulty.Normal);
      expect(galaxy2.name).toBe('System Alpha-5678');

      const galaxy3 = generator.generateGalaxy(12345, Difficulty.Normal);
      expect(galaxy3.name).toBe('System Alpha-2345'); // 12345 % 10000 = 2345
    });

    it('should store seed in galaxy object', () => {
      const generator = new GalaxyGenerator();
      const seed = 99999;
      const galaxy = generator.generateGalaxy(seed, Difficulty.Normal);

      expect(galaxy.seed).toBe(seed);
    });

    it('should store difficulty in galaxy object', () => {
      const generator = new GalaxyGenerator();

      const easyGalaxy = generator.generateGalaxy(42, Difficulty.Easy);
      expect(easyGalaxy.difficulty).toBe(Difficulty.Easy);

      const normalGalaxy = generator.generateGalaxy(42, Difficulty.Normal);
      expect(normalGalaxy.difficulty).toBe(Difficulty.Normal);

      const hardGalaxy = generator.generateGalaxy(42, Difficulty.Hard);
      expect(hardGalaxy.difficulty).toBe(Difficulty.Hard);
    });
  });
});
