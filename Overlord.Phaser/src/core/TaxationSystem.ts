import { GameState } from './GameState';
import { ResourceSystem } from './ResourceSystem';
import { ResourceDelta } from './models/ResourceModels';
import { FactionType } from './models/Enums';

/**
 * Platform-agnostic taxation system.
 * Calculates Credit income from population based on tax rates.
 */
export class TaxationSystem {
  private readonly gameState: GameState;
  private readonly resourceSystem: ResourceSystem;

  /**
   * Event fired when tax revenue is calculated for a planet.
   * Parameters: (planetID, revenue)
   */
  public onTaxRevenueCalculated?: (planetID: number, revenue: number) => void;

  /**
   * Event fired when tax rate is changed.
   * Parameters: (planetID, newTaxRate)
   */
  public onTaxRateChanged?: (planetID: number, newTaxRate: number) => void;

  // Constants
  public static readonly MIN_TAX_RATE = 0;
  public static readonly MAX_TAX_RATE = 100;
  public static readonly DEFAULT_TAX_RATE = 50;

  constructor(gameState: GameState, resourceSystem: ResourceSystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!resourceSystem) {
      throw new Error('resourceSystem cannot be null or undefined');
    }
    this.gameState = gameState;
    this.resourceSystem = resourceSystem;
  }

  /**
   * Calculates tax revenue for all planets owned by a faction.
   * @param faction Faction to calculate taxes for
   * @returns Total tax revenue across all faction planets
   */
  public calculateFactionTaxRevenue(faction: FactionType): number {
    let totalRevenue = 0;

    for (const planet of this.gameState.planets.filter(p => p.owner === faction)) {
      const planetRevenue = this.calculatePlanetTaxRevenue(planet.id);
      totalRevenue += planetRevenue;

      // Add Credits to planet resources
      if (planetRevenue > 0) {
        const creditDelta = new ResourceDelta();
        creditDelta.credits = planetRevenue;
        this.resourceSystem.addResources(planet.id, creditDelta);

        this.onTaxRevenueCalculated?.(planet.id, planetRevenue);
      }
    }

    return totalRevenue;
  }

  /**
   * Calculates tax revenue for a single planet.
   * Formula: (Population ÷ 10) × (TaxRate ÷ 100) × PlanetMultiplier
   * @param planetID Planet ID
   * @returns Tax revenue in Credits
   */
  public calculatePlanetTaxRevenue(planetID: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    // Uninhabited planets produce no tax revenue
    if (!planet.isHabitable || planet.population === 0) {
      return 0;
    }

    // Base calculation: (Population ÷ 10) × (TaxRate ÷ 100)
    const baseRevenue = (planet.population / 10.0) * (planet.taxRate / 100.0);

    // Apply planet multiplier (Metropolis = 2.0x, others = 1.0x)
    const planetMultiplier = planet.resourceMultipliers.credits;
    const totalRevenue = baseRevenue * planetMultiplier;

    return Math.floor(totalRevenue);
  }

  /**
   * Sets the tax rate for a planet.
   * @param planetID Planet ID
   * @param taxRate Tax rate (0-100)
   * @returns True if successful, false if planet not found or invalid rate
   */
  public setTaxRate(planetID: number, taxRate: number): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    // Clamp to valid range
    taxRate = Math.max(TaxationSystem.MIN_TAX_RATE, Math.min(TaxationSystem.MAX_TAX_RATE, taxRate));

    const oldTaxRate = planet.taxRate;
    planet.taxRate = taxRate;

    if (planet.taxRate !== oldTaxRate) {
      this.onTaxRateChanged?.(planetID, taxRate);
    }

    return true;
  }

  /**
   * Gets the current tax rate for a planet.
   * @param planetID Planet ID
   * @returns Tax rate (0-100), or -1 if planet not found
   */
  public getTaxRate(planetID: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return -1;
    }

    return planet.taxRate;
  }

  /**
   * Gets the estimated tax revenue for a given tax rate (for UI preview).
   * @param planetID Planet ID
   * @param taxRate Tax rate to simulate (0-100)
   * @returns Estimated revenue in Credits
   */
  public getEstimatedRevenue(planetID: number, taxRate: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    // Clamp to valid range
    taxRate = Math.max(TaxationSystem.MIN_TAX_RATE, Math.min(TaxationSystem.MAX_TAX_RATE, taxRate));

    // Calculate with simulated tax rate
    const baseRevenue = (planet.population / 10.0) * (taxRate / 100.0);
    const planetMultiplier = planet.resourceMultipliers.credits;
    const totalRevenue = baseRevenue * planetMultiplier;

    return Math.floor(totalRevenue);
  }

  /**
   * Gets the morale impact of a tax rate.
   * @param taxRate Tax rate (0-100)
   * @returns Morale change per turn
   */
  public getTaxRateMoraleImpact(taxRate: number): number {
    if (taxRate > 75) {
      return -5;  // High taxes penalty
    } else if (taxRate < 25) {
      return +2;  // Low taxes bonus
    } else {
      return 0;   // Moderate taxes (no change)
    }
  }

  /**
   * Gets a tax rate category description.
   * @param taxRate Tax rate (0-100)
   * @returns Category description
   */
  public getTaxRateCategory(taxRate: number): string {
    if (taxRate === 0) {
      return 'No Taxes';
    } else if (taxRate < 25) {
      return 'Low Taxes';
    } else if (taxRate <= 75) {
      return 'Moderate Taxes';
    } else {
      return 'High Taxes';
    }
  }
}
