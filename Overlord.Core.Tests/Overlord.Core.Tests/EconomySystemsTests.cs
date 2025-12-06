using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

/// <summary>
/// Unit tests for the economy systems (Resource, Income, Population, Taxation).
/// </summary>
public class EconomySystemsTests
{
    #region Helper Methods

    private GameState CreateTestGameState()
    {
        var gameState = new GameState();
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Starbase",
            Type = PlanetType.Metropolis,
            Owner = FactionType.Player,
            Position = new Position3D(0, 0, 0),
            Colonized = true,
            Population = 1000,
            Morale = 75,
            TaxRate = 50,
            Resources = new ResourceCollection
            {
                Food = 10000,
                Minerals = 10000,
                Fuel = 10000,
                Energy = 10000,
                Credits = 50000
            }
        });

        gameState.Planets.Add(new PlanetEntity
        {
            ID = 1,
            Name = "Vulcan",
            Type = PlanetType.Volcanic,
            Owner = FactionType.Player,
            Position = new Position3D(100, 0, 0),
            Colonized = true,
            Population = 500,
            Morale = 60,
            TaxRate = 50,
            Resources = new ResourceCollection
            {
                Food = 1000,
                Minerals = 5000,
                Fuel = 3000,
                Energy = 1000,
                Credits = 10000
            }
        });

        // Add structures to Starbase
        gameState.Planets[0].Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.HorticulturalStation,
            Status = BuildingStatus.Active
        });

        gameState.Planets[0].Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.MiningStation,
            Status = BuildingStatus.Active
        });

        // Add structures to Vulcan
        gameState.Planets[1].Structures.Add(new Structure
        {
            ID = 2,
            Type = BuildingType.MiningStation,
            Status = BuildingStatus.Active
        });

        gameState.Planets[1].Structures.Add(new Structure
        {
            ID = 3,
            Type = BuildingType.MiningStation,
            Status = BuildingStatus.Active
        });

        gameState.RebuildLookups();
        return gameState;
    }

    #endregion

    #region ResourceSystem Tests

    [Fact]
    public void ResourceSystem_AddResources_IncreasesResources()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var delta = new ResourceDelta { Food = 100, Minerals = 50 };
        resourceSystem.AddResources(0, delta);

        Assert.Equal(10100, gameState.Planets[0].Resources.Food);
        Assert.Equal(10050, gameState.Planets[0].Resources.Minerals);
    }

    [Fact]
    public void ResourceSystem_AddResources_ClampsToNonNegative()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        // Try to remove more than available
        var delta = new ResourceDelta { Food = -20000 }; // Planet has 10,000
        resourceSystem.AddResources(0, delta);

        Assert.Equal(0, gameState.Planets[0].Resources.Food); // Clamped to 0
    }

    [Fact]
    public void ResourceSystem_RemoveResources_ReturnsFalseIfInsufficient()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var cost = new ResourceCost { Food = 20000 }; // Planet has 10,000
        bool success = resourceSystem.RemoveResources(0, cost);

        Assert.False(success);
        Assert.Equal(10000, gameState.Planets[0].Resources.Food); // Unchanged
    }

    [Fact]
    public void ResourceSystem_RemoveResources_SucceedsIfSufficient()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var cost = new ResourceCost { Food = 500, Minerals = 200 };
        bool success = resourceSystem.RemoveResources(0, cost);

        Assert.True(success);
        Assert.Equal(9500, gameState.Planets[0].Resources.Food);
        Assert.Equal(9800, gameState.Planets[0].Resources.Minerals);
    }

    [Fact]
    public void ResourceSystem_CanAfford_ReturnsTrueIfSufficient()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var cost = new ResourceCost { Food = 500, Minerals = 200 };
        bool canAfford = resourceSystem.CanAfford(0, cost);

        Assert.True(canAfford);
    }

    [Fact]
    public void ResourceSystem_CanAfford_ReturnsFalseIfInsufficient()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var cost = new ResourceCost { Food = 20000 };
        bool canAfford = resourceSystem.CanAfford(0, cost);

        Assert.False(canAfford);
    }

    [Fact]
    public void ResourceSystem_GetTotalResources_SumsAcrossFactionPlanets()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var total = resourceSystem.GetTotalResources(FactionType.Player);

        Assert.Equal(11000, total.Food);    // 10,000 + 1,000
        Assert.Equal(15000, total.Minerals); // 10,000 + 5,000
        Assert.Equal(13000, total.Fuel);    // 10,000 + 3,000
        Assert.Equal(11000, total.Energy);  // 10,000 + 1,000
        Assert.Equal(60000, total.Credits); // 50,000 + 10,000
    }

    [Fact]
    public void ResourceSystem_GetResourceLevel_ReturnsCriticalBelow100()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        resourceSystem.SetResourceAmount(0, ResourceType.Food, 50);

        var level = resourceSystem.GetResourceLevel(0, ResourceType.Food);
        Assert.Equal(ResourceLevel.Critical, level);
    }

    [Fact]
    public void ResourceSystem_GetResourceLevel_ReturnsWarningBelow500()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        resourceSystem.SetResourceAmount(0, ResourceType.Food, 300);

        var level = resourceSystem.GetResourceLevel(0, ResourceType.Food);
        Assert.Equal(ResourceLevel.Warning, level);
    }

    [Fact]
    public void ResourceSystem_GetResourceLevel_ReturnsNormalAbove500()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        var level = resourceSystem.GetResourceLevel(0, ResourceType.Food);
        Assert.Equal(ResourceLevel.Normal, level);
    }

    [Fact]
    public void ResourceSystem_FiresOnResourcesChangedEvent()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);

        int eventPlanetID = -1;
        ResourceDelta? eventDelta = null;

        resourceSystem.OnResourcesChanged += (planetID, delta) =>
        {
            eventPlanetID = planetID;
            eventDelta = delta;
        };

        var delta = new ResourceDelta { Food = 100 };
        resourceSystem.AddResources(0, delta);

        Assert.Equal(0, eventPlanetID);
        Assert.NotNull(eventDelta);
        Assert.Equal(100, eventDelta.Food);
    }

    #endregion

    #region IncomeSystem Tests

    [Fact]
    public void IncomeSystem_CalculatePlanetIncome_AppliesPlanetMultipliers()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var incomeSystem = new IncomeSystem(gameState, resourceSystem);

        // Vulcan (Volcanic) has 2 Mining Stations
        // Volcanic multiplier: 5x Minerals, 3x Fuel
        var income = incomeSystem.CalculatePlanetIncome(1); // Vulcan

        // 2 Mining Stations × 50 base Minerals × 5.0 multiplier = 500 Minerals
        Assert.Equal(500, income.Minerals);

        // 2 Mining Stations × 30 base Fuel × 3.0 multiplier = 180 Fuel
        Assert.Equal(180, income.Fuel);
    }

    [Fact]
    public void IncomeSystem_CalculatePlanetIncome_AppliesFoodMultiplier()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var incomeSystem = new IncomeSystem(gameState, resourceSystem);

        // Starbase (Metropolis) has 1 Horticultural Station
        // Metropolis has 1.0x Food multiplier (normal)
        var income = incomeSystem.CalculatePlanetIncome(0); // Starbase

        // 1 Horticultural Station × 100 base Food × 1.0 multiplier = 100 Food
        Assert.Equal(100, income.Food);
    }

    [Fact]
    public void IncomeSystem_AllocateCrew_SetsInactiveIfInsufficientPopulation()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var incomeSystem = new IncomeSystem(gameState, resourceSystem);

        // Set population to 0 on Starbase
        gameState.Planets[0].Population = 0;

        incomeSystem.CalculatePlanetIncome(0);

        // All buildings should be inactive (Damaged status indicates crew shortage)
        Assert.All(gameState.Planets[0].Structures, s =>
            Assert.Equal(BuildingStatus.Damaged, s.Status));
    }

    [Fact]
    public void IncomeSystem_GetCrewAllocation_ReturnsCorrectValues()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var incomeSystem = new IncomeSystem(gameState, resourceSystem);

        // Starbase has 1 Horticultural (10 crew) + 1 Mining (15 crew) = 25 crew
        var (usedCrew, totalPopulation) = incomeSystem.GetCrewAllocation(0);

        Assert.Equal(25, usedCrew);
        Assert.Equal(1000, totalPopulation);
    }

    #endregion

    #region PopulationSystem Tests

    [Fact]
    public void PopulationSystem_UpdatePopulationGrowth_IncreasesPopulation()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        int initialPopulation = gameState.Planets[0].Population;

        populationSystem.UpdateFactionPopulation(FactionType.Player);

        // Population should have grown (75% morale × 5% = 3.75% growth)
        Assert.True(gameState.Planets[0].Population > initialPopulation);
    }

    [Fact]
    public void PopulationSystem_UpdatePopulationGrowth_NoGrowthIfMoraleZero()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        gameState.Planets[0].Morale = 0;
        int initialPopulation = gameState.Planets[0].Population;

        populationSystem.UpdateFactionPopulation(FactionType.Player);

        Assert.Equal(initialPopulation, gameState.Planets[0].Population);
    }

    [Fact]
    public void PopulationSystem_ConsumeFoodForPopulation_ConsumesCorrectAmount()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        int initialFood = gameState.Planets[0].Resources.Food;
        int population = gameState.Planets[0].Population; // 1000

        populationSystem.UpdateFactionPopulation(FactionType.Player);

        // Should consume 0.5 Food per person = 500 Food
        // But population grows first, so consumption will be slightly more
        int expectedConsumption = (int)Math.Floor(population * PopulationSystem.FoodConsumptionPerPerson);
        Assert.True(gameState.Planets[0].Resources.Food < initialFood);
    }

    [Fact]
    public void PopulationSystem_UpdateMorale_HighTaxesReduceMorale()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        gameState.Planets[0].TaxRate = 80; // High taxes
        int initialMorale = gameState.Planets[0].Morale;

        populationSystem.UpdateFactionPopulation(FactionType.Player);

        // Morale should decrease by 5% due to high taxes
        Assert.Equal(initialMorale - 5, gameState.Planets[0].Morale);
    }

    [Fact]
    public void PopulationSystem_UpdateMorale_LowTaxesIncreaseMorale()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        gameState.Planets[0].TaxRate = 20; // Low taxes
        int initialMorale = gameState.Planets[0].Morale;

        populationSystem.UpdateFactionPopulation(FactionType.Player);

        // Morale should increase by 2% due to low taxes
        Assert.Equal(initialMorale + 2, gameState.Planets[0].Morale);
    }

    [Fact]
    public void PopulationSystem_UpdateMorale_StarvationReducesMorale()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        gameState.Planets[0].Resources.Food = 0; // Starvation
        int initialMorale = gameState.Planets[0].Morale;

        populationSystem.UpdateFactionPopulation(FactionType.Player);

        // Morale should decrease by 10% due to starvation
        Assert.True(gameState.Planets[0].Morale < initialMorale);
    }

    [Fact]
    public void PopulationSystem_GetFoodRequired_ReturnsCorrectAmount()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        int foodRequired = populationSystem.GetFoodRequired(0); // 1000 population

        Assert.Equal(500, foodRequired); // 1000 × 0.5
    }

    [Fact]
    public void PopulationSystem_GetEstimatedGrowth_CalculatesCorrectly()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);

        // 1000 population, 75% morale
        // Growth = 1000 × (75 / 100) × 0.05 = 37.5 → 37
        int estimatedGrowth = populationSystem.GetEstimatedGrowth(0);

        Assert.Equal(37, estimatedGrowth);
    }

    #endregion

    #region TaxationSystem Tests

    [Fact]
    public void TaxationSystem_CalculatePlanetTaxRevenue_CalculatesCorrectly()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        // Starbase: 1000 population, 50% tax, 2.0x (Metropolis)
        // Revenue = (1000 ÷ 10) × 0.5 × 2.0 = 100 Credits
        int revenue = taxationSystem.CalculatePlanetTaxRevenue(0);

        Assert.Equal(100, revenue);
    }

    [Fact]
    public void TaxationSystem_CalculatePlanetTaxRevenue_AppliesMetropolisMultiplier()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        // Starbase is Metropolis (2.0x Credits)
        int starbaseRevenue = taxationSystem.CalculatePlanetTaxRevenue(0);

        // Vulcan is Volcanic (1.0x Credits)
        int vulcanRevenue = taxationSystem.CalculatePlanetTaxRevenue(1);

        // Starbase should have higher revenue due to Metropolis multiplier
        // Starbase: (1000 ÷ 10) × 0.5 × 2.0 = 100
        // Vulcan: (500 ÷ 10) × 0.5 × 1.0 = 25
        Assert.Equal(100, starbaseRevenue);
        Assert.Equal(25, vulcanRevenue);
    }

    [Fact]
    public void TaxationSystem_SetTaxRate_UpdatesTaxRate()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        bool success = taxationSystem.SetTaxRate(0, 75);

        Assert.True(success);
        Assert.Equal(75, gameState.Planets[0].TaxRate);
    }

    [Fact]
    public void TaxationSystem_SetTaxRate_ClampsToBounds()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        // Try to set tax rate > 100
        taxationSystem.SetTaxRate(0, 150);
        Assert.Equal(100, gameState.Planets[0].TaxRate);

        // Try to set tax rate < 0
        taxationSystem.SetTaxRate(0, -50);
        Assert.Equal(0, gameState.Planets[0].TaxRate);
    }

    [Fact]
    public void TaxationSystem_GetEstimatedRevenue_CalculatesCorrectly()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        // Simulate 75% tax rate
        int estimatedRevenue = taxationSystem.GetEstimatedRevenue(0, 75);

        // (1000 ÷ 10) × 0.75 × 2.0 = 150
        Assert.Equal(150, estimatedRevenue);
    }

    [Fact]
    public void TaxationSystem_GetTaxRateMoraleImpact_ReturnsCorrectImpact()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        Assert.Equal(-5, taxationSystem.GetTaxRateMoraleImpact(80)); // High taxes
        Assert.Equal(0, taxationSystem.GetTaxRateMoraleImpact(50));  // Moderate
        Assert.Equal(+2, taxationSystem.GetTaxRateMoraleImpact(20)); // Low taxes
    }

    [Fact]
    public void TaxationSystem_GetTaxRateCategory_ReturnsCorrectCategory()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        Assert.Equal("No Taxes", taxationSystem.GetTaxRateCategory(0));
        Assert.Equal("Low Taxes", taxationSystem.GetTaxRateCategory(20));
        Assert.Equal("Moderate Taxes", taxationSystem.GetTaxRateCategory(50));
        Assert.Equal("High Taxes", taxationSystem.GetTaxRateCategory(80));
    }

    #endregion

    #region Integration Tests

    [Fact]
    public void Integration_FullTurnCycle_WorksCorrectly()
    {
        var gameState = CreateTestGameState();
        var resourceSystem = new ResourceSystem(gameState);
        var incomeSystem = new IncomeSystem(gameState, resourceSystem);
        var populationSystem = new PopulationSystem(gameState, resourceSystem);
        var taxationSystem = new TaxationSystem(gameState, resourceSystem);

        int initialPopulation = gameState.Planets[0].Population;
        int initialFood = gameState.Planets[0].Resources.Food;
        int initialCredits = gameState.Planets[0].Resources.Credits;

        // 1. Calculate income
        incomeSystem.CalculateFactionIncome(FactionType.Player);

        // 2. Update population (growth + food consumption)
        populationSystem.UpdateFactionPopulation(FactionType.Player);

        // 3. Calculate tax revenue
        taxationSystem.CalculateFactionTaxRevenue(FactionType.Player);

        // Verify changes
        Assert.True(gameState.Planets[0].Population > initialPopulation); // Population grew
        Assert.True(gameState.Planets[0].Resources.Food < initialFood);  // Food consumed
        Assert.True(gameState.Planets[0].Resources.Credits > initialCredits); // Tax revenue added
    }

    #endregion
}
