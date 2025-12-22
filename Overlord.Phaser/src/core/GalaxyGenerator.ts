import { Position3D } from './models/Position3D';
import { PlanetEntity } from './models/PlanetEntity';
import { FactionType, PlanetType, Difficulty } from './models/Enums';
import { ResourceCollection } from './models/ResourceModels';

/**
 * Seeded random number generator matching C# Random behavior.
 * Uses Linear Congruential Generator (LCG) algorithm.
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Returns a random number between 0.0 (inclusive) and 1.0 (exclusive).
   * Matches C# Random.NextDouble() behavior.
   */
  public nextDouble(): number {
    // C# uses: seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 2147483647.0; // 0x7FFFFFFF = 2147483647
  }

  /**
   * Returns a random integer between 0 (inclusive) and maxValue (exclusive).
   * Matches C# Random.Next(maxValue) behavior.
   */
  public next(maxValue: number): number {
    return Math.floor(this.nextDouble() * maxValue);
  }

  /**
   * Returns a random number in the specified range.
   */
  public nextInRange(min: number, max: number): number {
    return min + this.nextDouble() * (max - min);
  }
}

/**
 * Represents a generated galaxy with planets.
 */
export interface Galaxy {
  seed: number;
  name: string;
  difficulty: Difficulty;
  planets: PlanetEntity[];
}

/**
 * Procedural galaxy generator that creates 4-6 planet systems.
 * Platform-agnostic implementation using deterministic seeding.
 */
export class GalaxyGenerator {
  private random: SeededRandom;

  constructor() {
    this.random = new SeededRandom(Date.now() & 0x7FFFFFFF);
  }

  /**
   * Generates a new galaxy with procedurally generated planets.
   * @param seed Optional seed for reproducibility. If null, uses current time.
   * @param difficulty Difficulty level affecting planet count (Easy=6, Normal=5, Hard=4)
   * @returns Generated galaxy with planets
   */
  public generateGalaxy(seed?: number, difficulty: Difficulty = Difficulty.Normal): Galaxy {
    // Use provided seed or generate from time
    const actualSeed = seed ?? (Date.now() & 0x7FFFFFFF);
    this.random = new SeededRandom(actualSeed);

    const galaxy: Galaxy = {
      seed: actualSeed,
      name: this.generateGalaxyName(actualSeed),
      difficulty,
      planets: [],
    };

    // Determine planet count based on difficulty
    const planetCount = difficulty === Difficulty.Easy ? 6 :
                        difficulty === Difficulty.Normal ? 9 : 18;

    // 1. Generate Starbase (Player starting planet) - first in list
    const starbase = this.generateStartingPlanet(
      0, 'Starbase', PlanetType.Metropolis, FactionType.Player, actualSeed,
    );
    galaxy.planets.push(starbase);

    // 2. Generate neutral planets in the middle
    const neutralCount = planetCount - 2;
    const availableTypes = [
      PlanetType.Volcanic,
      PlanetType.Desert,
      PlanetType.Tropical,
      PlanetType.Volcanic,
      PlanetType.Desert,
      PlanetType.Tropical,
      PlanetType.Volcanic,
      PlanetType.Desert,
      PlanetType.Tropical,
      PlanetType.Volcanic,
      PlanetType.Desert,
      PlanetType.Tropical,
      PlanetType.Volcanic,
      PlanetType.Desert,
      PlanetType.Tropical,
      PlanetType.Volcanic,
    ];

    // Shuffle available types for variety
    this.shuffleArray(availableTypes);

    for (let i = 0; i < neutralCount; i++) {
      const type = availableTypes[i % availableTypes.length];
      const planet = this.generateNeutralPlanet(
        i + 1,
        `Planet ${String.fromCharCode(65 + i)}`, // 'A', 'B', 'C', etc.
        type,
        galaxy.planets,
        actualSeed + i + 1,
      );
      galaxy.planets.push(planet);
    }

    // 3. Generate Hitotsu (AI starting planet) - last in list, opposite end of galaxy
    const hitotsu = this.generateStartingPlanet(
      planetCount - 1, 'Hitotsu', PlanetType.Metropolis, FactionType.AI, actualSeed + planetCount, starbase.position,
    );
    galaxy.planets.push(hitotsu);

    return galaxy;
  }

  /**
   * Generates a starting planet (Starbase or Hitotsu) with initial resources.
   */
  private generateStartingPlanet(
    id: number,
    name: string,
    type: PlanetType,
    owner: FactionType,
    seed: number,
    oppositeOf?: Position3D,
  ): PlanetEntity {
    const localRandom = new SeededRandom(seed);

    // Position logic
    let position: Position3D;
    if (oppositeOf) {
      // Place opposite to Starbase with ±0.5 radians variation (~±30°)
      const starbaseAngle = oppositeOf.getAngleXZ();
      const angleVariation = (localRandom.nextDouble() - 0.5) * 1.0; // ±0.5 radians
      const angle = starbaseAngle + Math.PI + angleVariation;
      const radius = localRandom.nextInRange(100, 250); // 100-250 units

      position = Position3D.fromPolar(
        angle,
        radius,
        localRandom.nextInRange(-20, 20), // -20 to +20
      );
    } else {
      // Random position for Starbase
      const angle = localRandom.nextDouble() * Math.PI * 2;
      const radius = localRandom.nextInRange(50, 150); // 50-150 units

      position = Position3D.fromPolar(
        angle,
        radius,
        localRandom.nextInRange(-20, 20),
      );
    }

    // Initialize resources based on owner
    const resources = new ResourceCollection();
    if (owner === FactionType.Player) {
      // Player starts with generous resources
      resources.food = 10000;
      resources.minerals = 10000;
      resources.fuel = 10000;
      resources.energy = 10000;
      resources.credits = 50000;
    } else {
      // AI starts with slightly less resources (balanced)
      resources.food = 8000;
      resources.minerals = 8000;
      resources.fuel = 8000;
      resources.energy = 8000;
      resources.credits = 40000;
    }

    const planet = new PlanetEntity();
    planet.id = id;
    planet.name = name;
    planet.type = type;
    planet.owner = owner;
    planet.position = position;
    planet.visualSeed = seed;
    planet.rotationSpeed = localRandom.nextInRange(0.1, 0.5); // 0.1-0.5
    planet.scaleMultiplier = localRandom.nextInRange(1.0, 1.5); // 1.0-1.5
    planet.colonized = true; // Metropolis planets start colonized
    planet.resources = resources;
    planet.population = 1000; // Starting population
    planet.morale = 75;       // 75% morale (good starting conditions)
    planet.taxRate = 50;      // 50% tax rate (moderate)
    planet.growthRate = 0;    // Will be calculated by PopulationSystem

    return planet;
  }

  /**
   * Generates a neutral planet with random type and position.
   */
  private generateNeutralPlanet(
    id: number,
    name: string,
    type: PlanetType,
    existingPlanets: PlanetEntity[],
    seed: number,
  ): PlanetEntity {
    const localRandom = new SeededRandom(seed);

    // Find valid position (avoiding collisions)
    let position: Position3D = new Position3D();
    let validPosition = false;
    let attempts = 0;
    const maxAttempts = 10;
    const minDistance = 50;

    while (!validPosition && attempts < maxAttempts) {
      const angle = localRandom.nextDouble() * Math.PI * 2;
      const radius = localRandom.nextInRange(50, 300); // 50-300 units

      position = Position3D.fromPolar(
        angle,
        radius,
        localRandom.nextInRange(-20, 20),
      );

      // Check distance from existing planets
      validPosition = true;
      for (const existing of existingPlanets) {
        if (position.distanceTo(existing.position) < minDistance) {
          validPosition = false;
          break;
        }
      }

      attempts++;
    }

    // Neutral planets have zero resources (not colonized)
    const resources = new ResourceCollection();
    resources.food = 0;
    resources.minerals = 0;
    resources.fuel = 0;
    resources.energy = 0;
    resources.credits = 0;

    const planet = new PlanetEntity();
    planet.id = id;
    planet.name = name;
    planet.type = type;
    planet.owner = FactionType.Neutral;
    planet.position = position;
    planet.visualSeed = seed;
    planet.rotationSpeed = localRandom.nextInRange(0.1, 0.5);
    planet.scaleMultiplier = localRandom.nextInRange(1.0, 1.5);
    planet.colonized = false; // Neutral planets not colonized
    planet.resources = resources;
    planet.population = 0;  // No population
    planet.morale = 50;     // Neutral morale
    planet.taxRate = 0;     // No taxes
    planet.growthRate = 0;  // No growth

    return planet;
  }

  /**
   * Generates a galaxy name from the seed.
   */
  private generateGalaxyName(seed: number): string {
    return `System Alpha-${(seed % 10000).toString().padStart(4, '0')}`;
  }

  /**
   * Fisher-Yates shuffle for randomizing planet types.
   */
  private shuffleArray<T>(array: T[]): void {
    const n = array.length;
    for (let i = n - 1; i > 0; i--) {
      const j = this.random.next(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
