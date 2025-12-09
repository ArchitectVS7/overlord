import { FactionType, EquipmentLevel, WeaponLevel } from './Enums';

/**
 * Represents a platoon (ground unit) entity in the game.
 */
export class PlatoonEntity {
  public id: number = 0;
  public name: string = '';
  public planetID: number = -1; // -1 if carried by craft
  public owner: FactionType = FactionType.Player;

  // Platoon composition
  public troopCount: number = 100; // 1-200 troops
  public equipment: EquipmentLevel = EquipmentLevel.Basic;
  public weapon: WeaponLevel = WeaponLevel.Rifle;

  // Training state
  public trainingLevel: number = 0; // 0-100%
  public trainingTurnsRemaining: number = 10; // Turns until fully trained

  // Combat stats
  public strength: number = 100; // Calculated military strength

  /**
   * Gets whether this platoon is fully trained (100%).
   */
  public get isFullyTrained(): boolean {
    return this.trainingLevel >= 100;
  }

  /**
   * Gets whether this platoon is currently under training.
   */
  public get isTraining(): boolean {
    return this.trainingTurnsRemaining > 0 && this.trainingLevel < 100;
  }
}
