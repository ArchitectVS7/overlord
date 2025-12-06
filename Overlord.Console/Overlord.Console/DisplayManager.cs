using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Console;

/// <summary>
/// Handles all text-based display rendering for the console app.
/// </summary>
public class DisplayManager
{
    public void ShowGameStatus(GameState gameState, int selectedPlanetID)
    {
        System.Console.WriteLine("\n╔══════════════════════════════════════════════════════════════╗");
        System.Console.WriteLine($"║  OVERLORD v1.0 - Turn {gameState.TurnCount,-5}                                  ║");
        System.Console.WriteLine("╚══════════════════════════════════════════════════════════════╝");

        // Player Resources
        var playerRes = gameState.PlayerFaction.Resources;
        System.Console.WriteLine($"\n💰 RESOURCES:");
        System.Console.WriteLine($"   Credits:  {playerRes.Credits,10} | Minerals: {playerRes.Minerals,10}");
        System.Console.WriteLine($"   Fuel:     {playerRes.Fuel,10} | Food:     {playerRes.Food,10}");
        System.Console.WriteLine($"   Energy:   {playerRes.Energy,10}");

        // Entity Counts
        var playerCraft = gameState.Craft.Count(c => c.Owner == FactionType.Player);
        var playerPlatoons = gameState.Platoons.Count(p => p.Owner == FactionType.Player);
        var playerPlanets = gameState.Planets.Count(p => p.Owner == FactionType.Player);

        System.Console.WriteLine($"\n🚀 FORCES:");
        System.Console.WriteLine($"   Planets:  {playerPlanets}/? | Craft: {playerCraft}/32 | Platoons: {playerPlatoons}/24");

        // Selected Planet
        if (gameState.PlanetLookup.TryGetValue(selectedPlanetID, out var selectedPlanet))
        {
            System.Console.WriteLine($"\n🌍 SELECTED PLANET: {selectedPlanet.Name} (ID: {selectedPlanetID})");
            System.Console.WriteLine($"   Owner: {selectedPlanet.Owner} | Type: {selectedPlanet.Type}");
            System.Console.WriteLine($"   Population: {selectedPlanet.Population} | Morale: {selectedPlanet.Morale}%");

            var structures = selectedPlanet.Structures.Count(s => s.Status == BuildingStatus.Active);
            var construction = selectedPlanet.Structures.Count(s => s.Status == BuildingStatus.UnderConstruction);
            System.Console.WriteLine($"   Structures: {structures} active, {construction} under construction");

            var craftInOrbit = gameState.Craft.Count(c => c.PlanetID == selectedPlanetID);
            System.Console.WriteLine($"   Craft in orbit: {craftInOrbit}");

            var garrison = gameState.Platoons.Count(p => p.PlanetID == selectedPlanetID);
            System.Console.WriteLine($"   Garrison: {garrison} platoons");
        }

        System.Console.WriteLine("\nType 'help' for commands, 'end' to end turn.");
    }

    public void ShowGalaxy(GameState gameState)
    {
        System.Console.WriteLine("\n╔══════════════════════════════════════════════════════════════╗");
        System.Console.WriteLine("║                        GALAXY MAP                            ║");
        System.Console.WriteLine("╚══════════════════════════════════════════════════════════════╝\n");

        System.Console.WriteLine($"{"ID",-4} {"Name",-20} {"Owner",-10} {"Type",-15} {"Pop",-6} {"Morale",-7} {"Craft",-6}");
        System.Console.WriteLine(new string('─', 72));

        foreach (var planet in gameState.Planets.OrderBy(p => p.ID))
        {
            var craftCount = gameState.Craft.Count(c => c.PlanetID == planet.ID);
            var ownerDisplay = planet.Owner.ToString();

            // Color code by owner
            if (planet.Owner == FactionType.Player)
                System.Console.ForegroundColor = ConsoleColor.Green;
            else if (planet.Owner == FactionType.AI)
                System.Console.ForegroundColor = ConsoleColor.Red;
            else
                System.Console.ForegroundColor = ConsoleColor.Gray;

            System.Console.WriteLine($"{planet.ID,-4} {planet.Name,-20} {ownerDisplay,-10} {planet.Type,-15} {planet.Population,-6} {planet.Morale + "%",-7} {craftCount,-6}");

            System.Console.ResetColor();
        }

        System.Console.WriteLine();
    }

    public void ShowPlanetDetails(GameState gameState, int planetID)
    {
        if (!gameState.PlanetLookup.TryGetValue(planetID, out var planet))
        {
            System.Console.WriteLine($"Planet ID {planetID} not found.");
            return;
        }

        System.Console.WriteLine("\n╔══════════════════════════════════════════════════════════════╗");
        System.Console.WriteLine($"║  PLANET: {planet.Name,-50} ║");
        System.Console.WriteLine("╚══════════════════════════════════════════════════════════════╝");

        System.Console.WriteLine($"\n📋 BASIC INFO:");
        System.Console.WriteLine($"   ID: {planet.ID}");
        System.Console.WriteLine($"   Name: {planet.Name}");
        System.Console.WriteLine($"   Type: {planet.Type}");
        System.Console.WriteLine($"   Owner: {planet.Owner}");
        System.Console.WriteLine($"   Colonized: {planet.Colonized}");

        System.Console.WriteLine($"\n👥 DEMOGRAPHICS:");
        System.Console.WriteLine($"   Population: {planet.Population}");
        System.Console.WriteLine($"   Morale: {planet.Morale}%");
        System.Console.WriteLine($"   Tax Rate: {planet.TaxRate}%");

        System.Console.WriteLine($"\n💰 RESOURCES:");
        System.Console.WriteLine($"   Credits:  {planet.Resources.Credits,10}");
        System.Console.WriteLine($"   Minerals: {planet.Resources.Minerals,10}");
        System.Console.WriteLine($"   Fuel:     {planet.Resources.Fuel,10}");
        System.Console.WriteLine($"   Food:     {planet.Resources.Food,10}");

        // Structures
        var activeStructures = planet.Structures.Where(s => s.Status == BuildingStatus.Active).ToList();
        var constructing = planet.Structures.Where(s => s.Status == BuildingStatus.UnderConstruction).ToList();

        System.Console.WriteLine($"\n🏗️  STRUCTURES:");
        if (activeStructures.Any())
        {
            System.Console.WriteLine("   Active:");
            foreach (var structure in activeStructures)
            {
                System.Console.WriteLine($"   - [{structure.ID}] {structure.Type}");
            }
        }
        else
        {
            System.Console.WriteLine("   No active structures.");
        }

        if (constructing.Any())
        {
            System.Console.WriteLine("   Under Construction:");
            foreach (var structure in constructing)
            {
                System.Console.WriteLine($"   - [{structure.ID}] {structure.Type} ({structure.TurnsRemaining} turns left)");
            }
        }

        // Craft in orbit
        var craftInOrbit = gameState.Craft.Where(c => c.PlanetID == planetID).ToList();
        System.Console.WriteLine($"\n🚀 CRAFT IN ORBIT:");
        if (craftInOrbit.Any())
        {
            foreach (var craft in craftInOrbit)
            {
                var ownerSymbol = craft.Owner == FactionType.Player ? "👤" : "🤖";
                var deployed = craft.IsDeployed ? " [DEPLOYED]" : "";
                var cargo = craft.CargoResources.Credits > 0 || craft.CargoResources.Minerals > 0
                    ? $" (Cargo: {craft.CargoResources.Credits} Credits, {craft.CargoResources.Minerals} Minerals)"
                    : "";
                var platoons = craft.CarriedPlatoonIDs.Count > 0
                    ? $" ({craft.CarriedPlatoonIDs.Count} platoons aboard)"
                    : "";

                System.Console.WriteLine($"   {ownerSymbol} [{craft.ID}] {craft.Type}{deployed}{cargo}{platoons}");
            }
        }
        else
        {
            System.Console.WriteLine("   No craft in orbit.");
        }

        // Garrison
        var garrison = gameState.Platoons.Where(p => p.PlanetID == planetID).ToList();
        System.Console.WriteLine($"\n🪖  GARRISON:");
        if (garrison.Any())
        {
            foreach (var platoon in garrison)
            {
                var ownerSymbol = platoon.Owner == FactionType.Player ? "👤" : "🤖";
                System.Console.WriteLine($"   {ownerSymbol} [{platoon.ID}] {platoon.Equipment}/{platoon.Weapon} - {platoon.TroopCount} troops (Exp: {platoon.Experience})");
            }
        }
        else
        {
            System.Console.WriteLine("   No garrison.");
        }

        System.Console.WriteLine();
    }
}
