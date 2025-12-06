using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic population management system.
/// Handles population growth, food consumption, and morale.
/// </summary>
public class PopulationSystem
{
    private readonly GameState _gameState;
    private readonly ResourceSystem _resourceSystem;

    /// <summary>
    /// Event fired when population changes on a planet.
    /// Parameters: (planetID, newPopulation)
    /// </summary>
    public event Action<int, int>? OnPopulationChanged;

    /// <summary>
    /// Event fired when morale changes on a planet.
    /// Parameters: (planetID, newMorale)
    /// </summary>
    public event Action<int, int>? OnMoraleChanged;

    /// <summary>
    /// Event fired when a planet is starving (Food = 0).
    /// Parameters: (planetID)
    /// </summary>
    public event Action<int>? OnStarvation;

    /// <summary>
    /// Event fired when a planet has insufficient food (rationing).
    /// Parameters: (planetID)
    /// </summary>
    public event Action<int>? OnFoodShortage;

    // Constants
    public const int MaxPopulation = 99999;
    public const float FoodConsumptionPerPerson = 0.5f;
    public const float BaseGrowthRate = 0.05f; // 5% at 100% morale

    public PopulationSystem(GameState gameState, ResourceSystem resourceSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _resourceSystem = resourceSystem ?? throw new ArgumentNullException(nameof(resourceSystem));
    }

    /// <summary>
    /// Updates population for all planets owned by a faction.
    /// Executes: Growth → Food Consumption → Morale Update
    /// </summary>
    /// <param name="faction">Faction to update</param>
    public void UpdateFactionPopulation(FactionType faction)
    {
        foreach (var planet in _gameState.Planets.Where(p => p.Owner == faction))
        {
            if (!planet.IsHabitable || planet.Population == 0)
                continue;

            // 1. Calculate and apply population growth
            UpdatePopulationGrowth(planet);

            // 2. Consume food for population
            ConsumeFoodForPopulation(planet);

            // 3. Update morale based on tax rate and food availability
            UpdateMorale(planet);
        }
    }

    /// <summary>
    /// Calculates and applies population growth for a planet.
    /// </summary>
    /// <param name="planet">Planet to update</param>
    private void UpdatePopulationGrowth(PlanetEntity planet)
    {
        // No growth if morale is 0 or planet is starving
        if (planet.Morale <= 0 || planet.Resources.Food == 0)
        {
            planet.GrowthRate = 0;
            return;
        }

        // Growth formula: Population × (Morale ÷ 100) × 0.05
        float growthRate = (planet.Morale / 100f) * BaseGrowthRate;
        int growthAmount = (int)Math.Floor(planet.Population * growthRate);

        int oldPopulation = planet.Population;
        planet.Population = Math.Min(planet.Population + growthAmount, MaxPopulation);
        planet.GrowthRate = growthRate;

        if (planet.Population != oldPopulation)
        {
            OnPopulationChanged?.Invoke(planet.ID, planet.Population);
        }
    }

    /// <summary>
    /// Consumes food for population.
    /// </summary>
    /// <param name="planet">Planet to consume food on</param>
    private void ConsumeFoodForPopulation(PlanetEntity planet)
    {
        int foodRequired = (int)Math.Floor(planet.Population * FoodConsumptionPerPerson);

        if (planet.Resources.Food >= foodRequired)
        {
            // Sufficient food - consume normally
            var foodCost = new ResourceCost { Food = foodRequired };
            _resourceSystem.RemoveResources(planet.ID, foodCost);
        }
        else
        {
            // Food shortage or starvation
            int availableFood = planet.Resources.Food;

            // Consume all available food
            if (availableFood > 0)
            {
                var foodCost = new ResourceCost { Food = availableFood };
                _resourceSystem.RemoveResources(planet.ID, foodCost);

                // Rationing (partial food)
                OnFoodShortage?.Invoke(planet.ID);
            }
            else
            {
                // Starvation (no food at all)
                OnStarvation?.Invoke(planet.ID);
            }
        }
    }

    /// <summary>
    /// Updates morale based on tax rate and food availability.
    /// </summary>
    /// <param name="planet">Planet to update morale on</param>
    private void UpdateMorale(PlanetEntity planet)
    {
        int oldMorale = planet.Morale;

        // Tax rate impact
        if (planet.TaxRate > 75)
        {
            planet.Morale = Math.Max(0, planet.Morale - 5); // High taxes penalty
        }
        else if (planet.TaxRate < 25)
        {
            planet.Morale = Math.Min(100, planet.Morale + 2); // Low taxes bonus
        }

        // Food availability impact
        int foodRequired = (int)Math.Floor(planet.Population * FoodConsumptionPerPerson);

        if (planet.Resources.Food == 0 && planet.Population > 0)
        {
            // Starvation penalty
            planet.Morale = Math.Max(0, planet.Morale - 10);
        }
        else if (planet.Resources.Food < foodRequired)
        {
            // Rationing penalty
            planet.Morale = Math.Max(0, planet.Morale - 3);
        }

        // Clamp morale to 0-100
        planet.Morale = Math.Clamp(planet.Morale, 0, 100);

        if (planet.Morale != oldMorale)
        {
            OnMoraleChanged?.Invoke(planet.ID, planet.Morale);
        }
    }

    /// <summary>
    /// Gets the food required for a planet's population.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Food required per turn</returns>
    public int GetFoodRequired(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        return (int)Math.Floor(planet.Population * FoodConsumptionPerPerson);
    }

    /// <summary>
    /// Gets the estimated population growth for a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Estimated growth amount per turn</returns>
    public int GetEstimatedGrowth(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        if (planet.Morale <= 0)
            return 0;

        float growthRate = (planet.Morale / 100f) * BaseGrowthRate;
        return (int)Math.Floor(planet.Population * growthRate);
    }

    /// <summary>
    /// Gets the morale impact of a tax rate change.
    /// </summary>
    /// <param name="taxRate">Tax rate (0-100)</param>
    /// <returns>Morale change per turn</returns>
    public int GetTaxRateMoraleImpact(int taxRate)
    {
        if (taxRate > 75)
            return -5;  // High taxes penalty
        else if (taxRate < 25)
            return +2;  // Low taxes bonus
        else
            return 0;   // Moderate taxes (no change)
    }
}
