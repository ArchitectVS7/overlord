import { Position3D } from './Position3D';
import { FactionType, PlanetType, BuildingType } from './Enums';
import { ResourceCollection, ResourceMultipliers } from './ResourceModels';
import { Structure } from './BuildingModels';

/**
 * Represents a planet in the galaxy.
 * Phase 2: Added economy properties (resources, population, morale, taxRate, growthRate)
 */
export class PlanetEntity {
  // Core attributes
  public id: number = 0;
  public name: string = '';
  public type: PlanetType = PlanetType.Desert;
  public owner: FactionType = FactionType.Neutral;
  public position: Position3D = new Position3D();
  public visualSeed: number = 0;

  // Visual properties
  public rotationSpeed: number = 0.3;
  public scaleMultiplier: number = 1.0;

  // Colonization state
  public colonized: boolean = false;
  public terraformingProgress: number = 0; // 0-10 turns (for uncolonized planets)

  // Economy properties
  public resources: ResourceCollection = new ResourceCollection();
  public population: number = 0;
  public morale: number = 50;      // 0-100
  public taxRate: number = 50;     // 0-100 percentage
  public growthRate: number = 0;   // Calculated each turn

  // Infrastructure
  public structures: Structure[] = []; // Buildings on the planet
  public dockedCraftIDs: number[] = []; // Ships currently docked at this planet

  /**
   * Checks if planet is habitable (colonized or Metropolis).
   */
  public get isHabitable(): boolean {
    return this.colonized || this.type === PlanetType.Metropolis;
  }

  /**
   * Checks if planet can build another Docking Bay (max 3).
   */
  public canBuildDockingBay(): boolean {
    const dockingBays = this.structures.filter(s => s.type === BuildingType.DockingBay).length;
    return dockingBays < 3;
  }

  /**
   * Checks if planet can build another surface structure (MiningStation, HorticulturalStation).
   * Max 5 surface structures total.
   */
  public canBuildSurfaceStructure(): boolean {
    const surfaceStructures = this.structures.filter(
      s => s.type === BuildingType.MiningStation || s.type === BuildingType.HorticulturalStation
    ).length;
    return surfaceStructures < 5;
  }

  /**
   * Gets resource production multipliers based on planet type.
   */
  public get resourceMultipliers(): ResourceMultipliers {
    const multipliers = new ResourceMultipliers();

    switch (this.type) {
      case PlanetType.Volcanic:
        multipliers.minerals = 5.0;
        multipliers.fuel = 3.0;
        multipliers.food = 0.5;
        break;

      case PlanetType.Desert:
        multipliers.energy = 2.0;
        multipliers.food = 0.25;
        break;

      case PlanetType.Tropical:
        multipliers.food = 2.0;
        multipliers.energy = 0.75;
        break;

      case PlanetType.Metropolis:
        multipliers.credits = 2.0;
        break;
    }

    return multipliers;
  }
}

/**
 * Get color for rendering based on planet owner
 */
export function getPlanetColor(owner: FactionType): number {
  switch (owner) {
    case FactionType.Player:
      return 0x3498db; // Blue
    case FactionType.AI:
      return 0xe74c3c; // Red
    case FactionType.Neutral:
      return 0x95a5a6; // Gray
  }
}
