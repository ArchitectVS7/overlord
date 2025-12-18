import { GameState } from './GameState';
import { BuildingType, BuildingStatus } from './models/Enums';

/**
 * Platform-agnostic planetary defense system.
 * Calculates defensive bonuses from Orbital Defense Platforms for space combat.
 */
export class DefenseSystem {
  private readonly gameState: GameState;

  // Defense constants
  public static readonly MaxOrbitalDefensePlatforms: number = 2;
  public static readonly DefenseBonusPerPlatform: number = 0.20; // 20% bonus per platform
  public static readonly OrbitalDefenseCrewRequirement: number = 20;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }

    this.gameState = gameState;
  }

  /**
   * Gets the defensive bonus multiplier for a planet based on active Orbital Defense Platforms.
   * Formula: 1.0 + (0.2 × ActivePlatforms)
   * Example: 1 platform = 1.2x, 2 platforms = 1.4x
   * @param planetID Planet ID
   * @returns Defense multiplier (1.0 to 1.4)
   */
  public getDefenseMultiplier(planetID: number): number {
    const activePlatforms = this.getActiveDefensePlatformCount(planetID);
    return 1.0 + DefenseSystem.DefenseBonusPerPlatform * activePlatforms;
  }

  /**
   * Gets the count of active Orbital Defense Platforms at a planet.
   * @param planetID Planet ID
   * @returns Count of active platforms (0-2)
   */
  public getActiveDefensePlatformCount(planetID: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    // Count active Orbital Defense platforms
    // Note: Platforms require 20 crew to be active (handled by IncomeSystem crew allocation)
    return planet.structures.filter(
      s => s.type === BuildingType.OrbitalDefense && s.status === BuildingStatus.Active,
    ).length;
  }

  /**
   * Gets the total defense platforms (active and under construction) at a planet.
   * @param planetID Planet ID
   * @returns Total platform count
   */
  public getTotalDefensePlatformCount(planetID: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    return planet.structures.filter(s => s.type === BuildingType.OrbitalDefense).length;
  }

  /**
   * Checks if a planet can build another Orbital Defense Platform.
   * @param planetID Planet ID
   * @returns True if can build, false if at max (2)
   */
  public canBuildDefensePlatform(planetID: number): boolean {
    return this.getTotalDefensePlatformCount(planetID) < DefenseSystem.MaxOrbitalDefensePlatforms;
  }

  /**
   * Calculates the defensive strength for a planet's defending fleet.
   * Applies the defense bonus from Orbital Defense Platforms.
   * @param planetID Planet ID
   * @param baseStrength Base fleet strength
   * @returns Modified defensive strength
   */
  public calculateDefensiveStrength(planetID: number, baseStrength: number): number {
    const multiplier = this.getDefenseMultiplier(planetID);
    return Math.floor(baseStrength * multiplier);
  }

  /**
   * Gets a defense report for a planet (for UI display).
   * @param planetID Planet ID
   * @returns Defense report string
   */
  public getDefenseReport(planetID: number): string {
    const activePlatforms = this.getActiveDefensePlatformCount(planetID);
    const totalPlatforms = this.getTotalDefensePlatformCount(planetID);

    if (totalPlatforms === 0) {
      return 'No orbital defenses';
    }

    const inactivePlatforms = totalPlatforms - activePlatforms;
    const bonus = DefenseSystem.DefenseBonusPerPlatform * activePlatforms;
    const bonusPercent = Math.floor(bonus * 100);

    let report = `Orbital Defense: +${bonusPercent}% defense (${activePlatforms}/${DefenseSystem.MaxOrbitalDefensePlatforms} active)`;

    if (inactivePlatforms > 0) {
      report += ` [${inactivePlatforms} inactive - insufficient crew]`;
    }

    return report;
  }
}
