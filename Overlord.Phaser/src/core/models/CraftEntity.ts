import { CraftType, FactionType } from './Enums';
import { Position3D } from './Position3D';
import { ResourceDelta } from './ResourceModels';
import { CraftCrewRequirements, CraftSpecs } from './CraftModels';

/**
 * Represents a craft (ship) entity in the game.
 */
export class CraftEntity {
  // Core properties
  public id: number = 0;
  public name: string = '';
  public type: CraftType = CraftType.BattleCruiser;
  public owner: FactionType = FactionType.Player;

  // Location
  public planetID: number = -1; // Current planet ID (-1 if in transit)
  public position: Position3D = new Position3D();
  public inTransit: boolean = false;

  // Combat stats
  public health: number = 100;
  public attack: number = 10;
  public defense: number = 10;

  // Type-specific properties
  public carriedPlatoonIDs: number[] = []; // Battle Cruiser only
  public cargoHold: ResourceDelta | null = null; // Cargo Cruiser only
  public active: boolean = false; // Solar Satellite only
  public deployedAtPlanetID: number = -1; // Atmosphere Processor/Solar Satellite
  public terraformingTurnsRemaining: number = 0; // Atmosphere Processor only

  /**
   * Gets whether this craft is deployed (Solar Satellite or Atmosphere Processor).
   */
  public get isDeployed(): boolean {
    return this.deployedAtPlanetID >= 0;
  }

  /**
   * Gets the crew requirement for this craft.
   */
  public get crewRequired(): number {
    return CraftCrewRequirements.getCrewRequired(this.type);
  }

  /**
   * Gets the specifications for this craft.
   */
  public get specs(): CraftSpecs {
    return CraftSpecs.getSpecs(this.type);
  }
}
