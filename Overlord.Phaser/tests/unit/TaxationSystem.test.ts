import { TaxationSystem } from '@core/TaxationSystem';
import { ResourceSystem } from '@core/ResourceSystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { ResourceCollection } from '@core/models/ResourceModels';

describe('TaxationSystem', () => {
  let gameState: GameState;
  let resourceSystem: ResourceSystem;
  let taxationSystem: TaxationSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    resourceSystem = new ResourceSystem(gameState);
    taxationSystem = new TaxationSystem(gameState, resourceSystem);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new TaxationSystem(null as any, resourceSystem)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should throw error if resourceSystem is null', () => {
      expect(() => new TaxationSystem(gameState, null as any)).toThrow(
        'resourceSystem cannot be null or undefined'
      );
    });
  });

  describe('calculatePlanetTaxRevenue', () => {
    it('should calculate correct tax revenue for normal planet', () => {
      // Planet 0: Population=1000, TaxRate=50%, Multiplier=2.0 (Metropolis)
      // Formula: (1000 ÷ 10) × (50 ÷ 100) × 2.0 = 100
      const revenue = taxationSystem.calculatePlanetTaxRevenue(0);

      expect(revenue).toBe(100);
    });

    it('should calculate correct tax revenue for Volcanic planet', () => {
      // Planet 1: Population=500, TaxRate=50%, Multiplier=1.0 (Volcanic has no credit multiplier)
      // Formula: (500 ÷ 10) × (50 ÷ 100) × 1.0 = 25
      const revenue = taxationSystem.calculatePlanetTaxRevenue(1);

      expect(revenue).toBe(25);
    });

    it('should return 0 for uninhabited planet', () => {
      gameState.planets[0].colonized = false;
      gameState.planets[0].type = PlanetType.Volcanic; // Not Metropolis

      const revenue = taxationSystem.calculatePlanetTaxRevenue(0);

      expect(revenue).toBe(0);
    });

    it('should return 0 for planet with zero population', () => {
      gameState.planets[0].population = 0;

      const revenue = taxationSystem.calculatePlanetTaxRevenue(0);

      expect(revenue).toBe(0);
    });

    it('should return 0 for planet not found', () => {
      const revenue = taxationSystem.calculatePlanetTaxRevenue(999);

      expect(revenue).toBe(0);
    });

    it('should return 0 when tax rate is 0', () => {
      gameState.planets[0].taxRate = 0;

      const revenue = taxationSystem.calculatePlanetTaxRevenue(0);

      expect(revenue).toBe(0);
    });

    it('should calculate maximum revenue at 100% tax rate', () => {
      // Planet 0: Population=1000, TaxRate=100%, Multiplier=2.0
      // Formula: (1000 ÷ 10) × (100 ÷ 100) × 2.0 = 200
      gameState.planets[0].taxRate = 100;

      const revenue = taxationSystem.calculatePlanetTaxRevenue(0);

      expect(revenue).toBe(200);
    });
  });

  describe('calculateFactionTaxRevenue', () => {
    it('should calculate total revenue for all faction planets', () => {
      // Planet 0: (1000 ÷ 10) × (50 ÷ 100) × 2.0 = 100
      // Planet 1: (500 ÷ 10) × (50 ÷ 100) × 1.0 = 25
      // Total: 125
      const totalRevenue = taxationSystem.calculateFactionTaxRevenue(FactionType.Player);

      expect(totalRevenue).toBe(125);
    });

    it('should add credits to planet resources', () => {
      const initialCredits0 = gameState.planets[0].resources.credits;
      const initialCredits1 = gameState.planets[1].resources.credits;

      taxationSystem.calculateFactionTaxRevenue(FactionType.Player);

      expect(gameState.planets[0].resources.credits).toBe(initialCredits0 + 100);
      expect(gameState.planets[1].resources.credits).toBe(initialCredits1 + 25);
    });

    it('should fire onTaxRevenueCalculated event', () => {
      const events: Array<{ planetID: number; revenue: number }> = [];

      taxationSystem.onTaxRevenueCalculated = (planetID, revenue) => {
        events.push({ planetID, revenue });
      };

      taxationSystem.calculateFactionTaxRevenue(FactionType.Player);

      expect(events.length).toBe(2);
      expect(events[0]).toEqual({ planetID: 0, revenue: 100 });
      expect(events[1]).toEqual({ planetID: 1, revenue: 25 });
    });

    it('should not fire event when revenue is 0', () => {
      let eventFired = false;

      taxationSystem.onTaxRevenueCalculated = () => {
        eventFired = true;
      };

      gameState.planets[0].population = 0;
      gameState.planets[1].population = 0;

      taxationSystem.calculateFactionTaxRevenue(FactionType.Player);

      expect(eventFired).toBe(false);
    });
  });

  describe('setTaxRate', () => {
    it('should set tax rate successfully', () => {
      const result = taxationSystem.setTaxRate(0, 75);

      expect(result).toBe(true);
      expect(gameState.planets[0].taxRate).toBe(75);
    });

    it('should clamp tax rate to minimum (0)', () => {
      taxationSystem.setTaxRate(0, -50);

      expect(gameState.planets[0].taxRate).toBe(0);
    });

    it('should clamp tax rate to maximum (100)', () => {
      taxationSystem.setTaxRate(0, 150);

      expect(gameState.planets[0].taxRate).toBe(100);
    });

    it('should return false if planet not found', () => {
      const result = taxationSystem.setTaxRate(999, 50);

      expect(result).toBe(false);
    });

    it('should fire onTaxRateChanged event when rate changes', () => {
      let changedPlanetID = -1;
      let newRate = -1;

      taxationSystem.onTaxRateChanged = (planetID, taxRate) => {
        changedPlanetID = planetID;
        newRate = taxRate;
      };

      taxationSystem.setTaxRate(0, 75);

      expect(changedPlanetID).toBe(0);
      expect(newRate).toBe(75);
    });

    it('should not fire event when rate does not change', () => {
      let eventFired = false;

      taxationSystem.onTaxRateChanged = () => {
        eventFired = true;
      };

      taxationSystem.setTaxRate(0, 50); // Already 50

      expect(eventFired).toBe(false);
    });
  });

  describe('getTaxRate', () => {
    it('should return current tax rate', () => {
      const taxRate = taxationSystem.getTaxRate(0);

      expect(taxRate).toBe(50);
    });

    it('should return -1 if planet not found', () => {
      const taxRate = taxationSystem.getTaxRate(999);

      expect(taxRate).toBe(-1);
    });
  });

  describe('getEstimatedRevenue', () => {
    it('should estimate revenue for given tax rate', () => {
      // Planet 0: Population=1000, Multiplier=2.0
      // 80% tax: (1000 ÷ 10) × (80 ÷ 100) × 2.0 = 160
      const estimate = taxationSystem.getEstimatedRevenue(0, 80);

      expect(estimate).toBe(160);
    });

    it('should clamp tax rate to valid range', () => {
      const estimateLow = taxationSystem.getEstimatedRevenue(0, -50);
      const estimateHigh = taxationSystem.getEstimatedRevenue(0, 150);

      expect(estimateLow).toBe(0); // 0% tax
      expect(estimateHigh).toBe(200); // 100% tax
    });

    it('should return 0 if planet not found', () => {
      const estimate = taxationSystem.getEstimatedRevenue(999, 50);

      expect(estimate).toBe(0);
    });
  });

  describe('getTaxRateMoraleImpact', () => {
    it('should return -5 for high taxes (>75%)', () => {
      expect(taxationSystem.getTaxRateMoraleImpact(80)).toBe(-5);
      expect(taxationSystem.getTaxRateMoraleImpact(100)).toBe(-5);
    });

    it('should return +2 for low taxes (<25%)', () => {
      expect(taxationSystem.getTaxRateMoraleImpact(20)).toBe(+2);
      expect(taxationSystem.getTaxRateMoraleImpact(0)).toBe(+2);
    });

    it('should return 0 for moderate taxes (25-75%)', () => {
      expect(taxationSystem.getTaxRateMoraleImpact(25)).toBe(0);
      expect(taxationSystem.getTaxRateMoraleImpact(50)).toBe(0);
      expect(taxationSystem.getTaxRateMoraleImpact(75)).toBe(0);
    });
  });

  describe('getTaxRateCategory', () => {
    it('should return "No Taxes" for 0%', () => {
      expect(taxationSystem.getTaxRateCategory(0)).toBe('No Taxes');
    });

    it('should return "Low Taxes" for <25%', () => {
      expect(taxationSystem.getTaxRateCategory(1)).toBe('Low Taxes');
      expect(taxationSystem.getTaxRateCategory(24)).toBe('Low Taxes');
    });

    it('should return "Moderate Taxes" for 25-75%', () => {
      expect(taxationSystem.getTaxRateCategory(25)).toBe('Moderate Taxes');
      expect(taxationSystem.getTaxRateCategory(50)).toBe('Moderate Taxes');
      expect(taxationSystem.getTaxRateCategory(75)).toBe('Moderate Taxes');
    });

    it('should return "High Taxes" for >75%', () => {
      expect(taxationSystem.getTaxRateCategory(76)).toBe('High Taxes');
      expect(taxationSystem.getTaxRateCategory(100)).toBe('High Taxes');
    });
  });

  describe('Constants', () => {
    it('should have correct constant values', () => {
      expect(TaxationSystem.MIN_TAX_RATE).toBe(0);
      expect(TaxationSystem.MAX_TAX_RATE).toBe(100);
      expect(TaxationSystem.DEFAULT_TAX_RATE).toBe(50);
    });
  });
});

/**
 * Helper function to create a test game state with 2 player planets.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Starbase (Player, Metropolis)
  const starbase = new PlanetEntity();
  starbase.id = 0;
  starbase.name = 'Starbase';
  starbase.type = PlanetType.Metropolis;
  starbase.owner = FactionType.Player;
  starbase.position = new Position3D(0, 0, 0);
  starbase.visualSeed = 123;
  starbase.rotationSpeed = 1.0;
  starbase.scaleMultiplier = 1.0;
  starbase.colonized = true;
  starbase.resources.food = 10000;
  starbase.resources.minerals = 10000;
  starbase.resources.fuel = 10000;
  starbase.resources.energy = 10000;
  starbase.resources.credits = 50000;
  starbase.population = 1000;
  starbase.morale = 75;
  starbase.taxRate = 50;

  // Vulcan (Player, Volcanic)
  const vulcan = new PlanetEntity();
  vulcan.id = 1;
  vulcan.name = 'Vulcan';
  vulcan.type = PlanetType.Volcanic;
  vulcan.owner = FactionType.Player;
  vulcan.position = new Position3D(100, 0, 0);
  vulcan.visualSeed = 456;
  vulcan.rotationSpeed = 1.5;
  vulcan.scaleMultiplier = 0.8;
  vulcan.colonized = true;
  vulcan.resources.food = 1000;
  vulcan.resources.minerals = 5000;
  vulcan.resources.fuel = 3000;
  vulcan.resources.energy = 1000;
  vulcan.resources.credits = 10000;
  vulcan.population = 500;
  vulcan.morale = 60;
  vulcan.taxRate = 50;

  gameState.planets.push(starbase);
  gameState.planets.push(vulcan);
  gameState.rebuildLookups();

  return gameState;
}
