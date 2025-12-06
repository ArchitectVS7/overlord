using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic craft management system.
/// Handles craft purchasing, scrapping, cargo loading, platoon transport, and deployment.
/// </summary>
public class CraftSystem
{
    private readonly GameState _gameState;
    private readonly EntitySystem _entitySystem;
    private readonly ResourceSystem _resourceSystem;

    /// <summary>
    /// Event fired when a craft is purchased.
    /// Parameters: (craftID)
    /// </summary>
    public event Action<int>? OnCraftPurchased;

    /// <summary>
    /// Event fired when a craft is scrapped (destroyed by player).
    /// Parameters: (craftID)
    /// </summary>
    public event Action<int>? OnCraftScrapped;

    /// <summary>
    /// Event fired when platoons are embarked onto a Battle Cruiser.
    /// Parameters: (craftID, platoonIDs)
    /// </summary>
    public event Action<int, List<int>>? OnPlatoonsEmbarked;

    /// <summary>
    /// Event fired when platoons are disembarked from a Battle Cruiser.
    /// Parameters: (craftID, platoonIDs)
    /// </summary>
    public event Action<int, List<int>>? OnPlatoonsDisembarked;

    /// <summary>
    /// Event fired when cargo is loaded onto a Cargo Cruiser.
    /// Parameters: (craftID, cargoLoaded)
    /// </summary>
    public event Action<int, ResourceDelta>? OnCargoLoaded;

    /// <summary>
    /// Event fired when cargo is unloaded from a Cargo Cruiser.
    /// Parameters: (craftID, cargoUnloaded)
    /// </summary>
    public event Action<int, ResourceDelta>? OnCargoUnloaded;

    /// <summary>
    /// Event fired when an Atmosphere Processor is deployed.
    /// Parameters: (planetID, craftID)
    /// </summary>
    public event Action<int, int>? OnAtmosphereProcessorDeployed;

    public CraftSystem(GameState gameState, EntitySystem entitySystem, ResourceSystem resourceSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _entitySystem = entitySystem ?? throw new ArgumentNullException(nameof(entitySystem));
        _resourceSystem = resourceSystem ?? throw new ArgumentNullException(nameof(resourceSystem));
    }

    /// <summary>
    /// Purchases a new craft at a planet.
    /// </summary>
    /// <param name="type">Craft type</param>
    /// <param name="planetID">Planet ID where craft is purchased</param>
    /// <param name="owner">Faction owner</param>
    /// <returns>Craft ID if successful, -1 if failed</returns>
    public int PurchaseCraft(CraftType type, int planetID, FactionType owner)
    {
        // Validate planet exists
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return -1;

        // Validate fleet limit
        if (!_entitySystem.CanCreateCraft())
            return -1; // Fleet limit reached (32/32)

        // Get cost and crew requirements
        var cost = CraftCosts.GetCost(type);
        int crewRequired = CraftCrewRequirements.GetCrewRequired(type);

        // Validate resources (check planet resources)
        if (!planet.Resources.CanAfford(cost))
            return -1; // Insufficient resources

        // Validate crew (check planet population)
        if (planet.Population < crewRequired)
            return -1; // Insufficient crew

        // Deduct cost from planet resources
        planet.Resources.Subtract(cost);

        // Deduct crew from population
        planet.Population -= crewRequired;

        // Create craft entity
        int craftID = _entitySystem.CreateCraft(type, planetID, owner);

        OnCraftPurchased?.Invoke(craftID);
        return craftID;
    }

    /// <summary>
    /// Scraps a craft (destroys it, refunds 50% cost, returns crew to planet).
    /// </summary>
    /// <param name="craftID">Craft ID to scrap</param>
    /// <returns>True if scrapped, false if failed</returns>
    public bool ScrapCraft(int craftID)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Cannot scrap craft in transit
        if (craft.InTransit)
            return false;

        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var planet))
            return false;

        // Refund 50% of cost
        var cost = CraftCosts.GetCost(craft.Type);
        var refund = new ResourceDelta
        {
            Credits = cost.Credits / 2,
            Minerals = cost.Minerals / 2,
            Fuel = cost.Fuel / 2,
            Food = 0,
            Energy = 0
        };

        planet.Resources.Add(refund);

        // Return crew to population
        int crew = CraftCrewRequirements.GetCrewRequired(craft.Type);
        planet.Population += crew;

        // Destroy craft
        _entitySystem.DestroyCraft(craftID);

        OnCraftScrapped?.Invoke(craftID);
        return true;
    }

    /// <summary>
    /// Embarks platoons onto a Battle Cruiser.
    /// </summary>
    /// <param name="craftID">Battle Cruiser ID</param>
    /// <param name="platoonIDs">Platoon IDs to embark</param>
    /// <returns>True if successful, false if failed</returns>
    public bool EmbarkPlatoons(int craftID, List<int> platoonIDs)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Must be a Battle Cruiser
        if (craft.Type != CraftType.BattleCruiser)
            return false;

        // Check capacity (max 4 platoons)
        if (craft.CarriedPlatoonIDs.Count + platoonIDs.Count > craft.Specs.PlatoonCapacity)
            return false;

        // Validate all platoons
        foreach (var platoonID in platoonIDs)
        {
            if (!_gameState.PlatoonLookup.TryGetValue(platoonID, out var platoon))
                return false;

            // Platoon must be at same planet as craft
            if (platoon.PlanetID != craft.PlanetID)
                return false;
        }

        // Embark platoons
        foreach (var platoonID in platoonIDs)
        {
            var platoon = _gameState.PlatoonLookup[platoonID];
            craft.CarriedPlatoonIDs.Add(platoonID);
            platoon.PlanetID = -1; // No longer at planet (carried by craft)
        }

        OnPlatoonsEmbarked?.Invoke(craftID, platoonIDs);
        return true;
    }

    /// <summary>
    /// Disembarks platoons from a Battle Cruiser.
    /// </summary>
    /// <param name="craftID">Battle Cruiser ID</param>
    /// <param name="platoonIDs">Platoon IDs to disembark</param>
    /// <returns>True if successful, false if failed</returns>
    public bool DisembarkPlatoons(int craftID, List<int> platoonIDs)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Must be a Battle Cruiser
        if (craft.Type != CraftType.BattleCruiser)
            return false;

        // Cannot disembark in space (must be docked at planet)
        if (craft.InTransit || craft.PlanetID < 0)
            return false;

        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var planet))
            return false;

        // Validate all platoons are carried by this craft
        foreach (var platoonID in platoonIDs)
        {
            if (!_gameState.PlatoonLookup.TryGetValue(platoonID, out var platoon))
                return false;

            if (!craft.CarriedPlatoonIDs.Contains(platoonID))
                return false;
        }

        // Disembark platoons
        foreach (var platoonID in platoonIDs)
        {
            var platoon = _gameState.PlatoonLookup[platoonID];
            craft.CarriedPlatoonIDs.Remove(platoonID);
            platoon.PlanetID = craft.PlanetID; // Now at planet
        }

        OnPlatoonsDisembarked?.Invoke(craftID, platoonIDs);
        return true;
    }

    /// <summary>
    /// Loads cargo onto a Cargo Cruiser from a planet.
    /// </summary>
    /// <param name="craftID">Cargo Cruiser ID</param>
    /// <param name="cargo">Resources to load</param>
    /// <returns>True if successful, false if failed</returns>
    public bool LoadCargo(int craftID, ResourceDelta cargo)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Must be a Cargo Cruiser
        if (craft.Type != CraftType.CargoCruiser)
            return false;

        // Cannot load in transit
        if (craft.InTransit || craft.PlanetID < 0)
            return false;

        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var planet))
            return false;

        // Initialize cargo hold if null
        if (craft.CargoHold == null)
            craft.CargoHold = new ResourceDelta();

        // Check cargo capacity (1000 per resource type)
        int maxCapacity = craft.Specs.CargoCapacity;
        if (craft.CargoHold.Credits + cargo.Credits > maxCapacity ||
            craft.CargoHold.Minerals + cargo.Minerals > maxCapacity ||
            craft.CargoHold.Fuel + cargo.Fuel > maxCapacity ||
            craft.CargoHold.Food + cargo.Food > maxCapacity ||
            craft.CargoHold.Energy + cargo.Energy > maxCapacity)
        {
            return false; // Cargo capacity exceeded
        }

        // Validate planet has resources (convert ResourceDelta to ResourceCost for checking)
        var cost = new ResourceCost
        {
            Credits = cargo.Credits,
            Minerals = cargo.Minerals,
            Fuel = cargo.Fuel,
            Food = cargo.Food,
            Energy = cargo.Energy
        };

        if (!planet.Resources.CanAfford(cost))
            return false; // Insufficient resources on planet

        // Remove resources from planet
        planet.Resources.Subtract(cost);

        // Add to cargo hold
        craft.CargoHold.Credits += cargo.Credits;
        craft.CargoHold.Minerals += cargo.Minerals;
        craft.CargoHold.Fuel += cargo.Fuel;
        craft.CargoHold.Food += cargo.Food;
        craft.CargoHold.Energy += cargo.Energy;

        OnCargoLoaded?.Invoke(craftID, cargo);
        return true;
    }

    /// <summary>
    /// Unloads cargo from a Cargo Cruiser to a planet.
    /// </summary>
    /// <param name="craftID">Cargo Cruiser ID</param>
    /// <param name="cargo">Resources to unload</param>
    /// <returns>True if successful, false if failed</returns>
    public bool UnloadCargo(int craftID, ResourceDelta cargo)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Must be a Cargo Cruiser
        if (craft.Type != CraftType.CargoCruiser)
            return false;

        // Cannot unload in transit
        if (craft.InTransit || craft.PlanetID < 0)
            return false;

        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var planet))
            return false;

        // Check cargo hold has resources
        if (craft.CargoHold == null)
            return false;

        if (craft.CargoHold.Credits < cargo.Credits ||
            craft.CargoHold.Minerals < cargo.Minerals ||
            craft.CargoHold.Fuel < cargo.Fuel ||
            craft.CargoHold.Food < cargo.Food ||
            craft.CargoHold.Energy < cargo.Energy)
        {
            return false; // Insufficient cargo
        }

        // Remove from cargo hold
        craft.CargoHold.Credits -= cargo.Credits;
        craft.CargoHold.Minerals -= cargo.Minerals;
        craft.CargoHold.Fuel -= cargo.Fuel;
        craft.CargoHold.Food -= cargo.Food;
        craft.CargoHold.Energy -= cargo.Energy;

        // Add to planet
        planet.Resources.Add(cargo);

        OnCargoUnloaded?.Invoke(craftID, cargo);
        return true;
    }

    /// <summary>
    /// Deploys a Solar Satellite at a planet.
    /// Solar Satellites generate 80 Energy/turn when active.
    /// </summary>
    /// <param name="craftID">Solar Satellite ID</param>
    /// <returns>True if deployed, false if failed</returns>
    public bool DeploySolarSatellite(int craftID)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Must be a Solar Satellite
        if (craft.Type != CraftType.SolarSatellite)
            return false;

        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var planet))
            return false;

        // Mark as deployed
        craft.DeployedAtPlanetID = craft.PlanetID;

        // Activate if planet has 5+ crew
        // Note: Solar Satellite crew (5) was already deducted on purchase
        // This just checks if satellite should be active based on planet crew availability
        craft.Active = planet.Population >= 5;

        return true;
    }

    /// <summary>
    /// Deploys an Atmosphere Processor to start terraforming.
    /// This is a one-time use - the craft is destroyed after deployment.
    /// </summary>
    /// <param name="craftID">Atmosphere Processor ID</param>
    /// <returns>True if deployed, false if failed</returns>
    public bool DeployAtmosphereProcessor(int craftID)
    {
        // Get craft
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        // Must be an Atmosphere Processor
        if (craft.Type != CraftType.AtmosphereProcessor)
            return false;

        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var planet))
            return false;

        // Planet must not already be colonized
        if (planet.Colonized)
            return false;

        // Start terraforming (10 turns)
        planet.TerraformingProgress = 10;

        // Mark craft as deployed before destroying
        craft.DeployedAtPlanetID = craft.PlanetID;
        craft.TerraformingTurnsRemaining = 10;

        // Destroy Atmosphere Processor (one-time use)
        _entitySystem.DestroyCraft(craftID);

        OnAtmosphereProcessorDeployed?.Invoke(craft.PlanetID, craftID);
        return true;
    }

    /// <summary>
    /// Gets all craft owned by a faction.
    /// </summary>
    public List<CraftEntity> GetCraft(FactionType owner)
    {
        return _entitySystem.GetCraft(owner);
    }

    /// <summary>
    /// Gets all craft at a specific planet.
    /// </summary>
    public List<CraftEntity> GetCraftAtPlanet(int planetID)
    {
        return _entitySystem.GetCraftAtPlanet(planetID);
    }

    /// <summary>
    /// Gets all craft currently in transit.
    /// </summary>
    public List<CraftEntity> GetCraftInTransit()
    {
        return _entitySystem.GetCraftInTransit();
    }

    /// <summary>
    /// Checks if a craft can be purchased (validates limit only).
    /// </summary>
    public bool CanPurchaseCraft()
    {
        return _entitySystem.CanCreateCraft();
    }

    /// <summary>
    /// Gets the current fleet count.
    /// </summary>
    public int GetFleetCount()
    {
        return _entitySystem.GetCraftCount();
    }

    /// <summary>
    /// Gets the fleet count for a specific faction.
    /// </summary>
    public int GetFleetCount(FactionType owner)
    {
        return _entitySystem.GetCraftCount(owner);
    }
}
