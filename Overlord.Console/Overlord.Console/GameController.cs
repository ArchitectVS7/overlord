using Overlord.Core;
using Overlord.Core.Models;
using System.Text.Json;

namespace Overlord.Console;

/// <summary>
/// Main game controller for console playtest.
/// Manages game state, systems, and the main game loop.
/// </summary>
public class GameController
{
    private GameState _gameState = null!;
    private readonly DisplayManager _display;
    private readonly CommandParser _commandParser;

    // Core Systems
    private TurnSystem _turnSystem = null!;
    private SaveSystem _saveSystem = null!;
    private GalaxyGenerator _galaxyGenerator = null!;
    private ResourceSystem _resourceSystem = null!;
    private IncomeSystem _incomeSystem = null!;
    private PopulationSystem _populationSystem = null!;
    private TaxationSystem _taxationSystem = null!;
    private EntitySystem _entitySystem = null!;
    private CraftSystem _craftSystem = null!;
    private PlatoonSystem _platoonSystem = null!;
    private BuildingSystem _buildingSystem = null!;
    private UpgradeSystem _upgradeSystem = null!;
    private DefenseSystem _defenseSystem = null!;
    private CombatSystem _combatSystem = null!;
    private SpaceCombatSystem _spaceCombatSystem = null!;
    private BombardmentSystem _bombardmentSystem = null!;
    private InvasionSystem _invasionSystem = null!;

    private int _selectedPlanetID = 0;
    private bool _isRunning = true;

    public GameController()
    {
        _display = new DisplayManager();
        _commandParser = new CommandParser();
    }

    private void InitializeSystems()
    {
        _turnSystem = new TurnSystem(_gameState);
        _saveSystem = new SaveSystem(_gameState);
        _galaxyGenerator = new GalaxyGenerator(new Random());
        _resourceSystem = new ResourceSystem(_gameState);
        _incomeSystem = new IncomeSystem(_gameState, _resourceSystem);
        _populationSystem = new PopulationSystem(_gameState);
        _taxationSystem = new TaxationSystem(_gameState);
        _entitySystem = new EntitySystem(_gameState);
        _craftSystem = new CraftSystem(_gameState, _entitySystem, _resourceSystem);
        _platoonSystem = new PlatoonSystem(_gameState, _entitySystem, _resourceSystem);
        _buildingSystem = new BuildingSystem(_gameState);
        _upgradeSystem = new UpgradeSystem(_gameState, _resourceSystem);
        _defenseSystem = new DefenseSystem(_gameState);
        _combatSystem = new CombatSystem(_gameState, new Random());
        _spaceCombatSystem = new SpaceCombatSystem(_gameState, new Random());
        _bombardmentSystem = new BombardmentSystem(_gameState, new Random());
        _invasionSystem = new InvasionSystem(_gameState, _combatSystem);

        // Subscribe to events for notifications
        SubscribeToEvents();
    }

    private void SubscribeToEvents()
    {
        // Turn events
        _turnSystem.OnTurnStarted += (turn) =>
        {
            System.Console.WriteLine($"\n>>> TURN {turn} STARTED <<<\n");
        };

        // Combat events
        _combatSystem.OnBattleStarted += (planetID) =>
        {
            var planet = _gameState.PlanetLookup[planetID];
            System.Console.WriteLine($"\n⚔️  GROUND BATTLE at {planet.Name}!");
        };

        _spaceCombatSystem.OnSpaceBattleStarted += (planetID) =>
        {
            var planet = _gameState.PlanetLookup[planetID];
            System.Console.WriteLine($"\n🚀 SPACE BATTLE in orbit of {planet.Name}!");
        };

        // Bombardment events
        _bombardmentSystem.OnBombardmentStarted += (planetID, strength) =>
        {
            var planet = _gameState.PlanetLookup[planetID];
            System.Console.WriteLine($"\n💥 BOMBARDMENT of {planet.Name} (Strength: {strength})");
        };

        _bombardmentSystem.OnStructureDestroyed += (structureID, planetID) =>
        {
            System.Console.WriteLine($"   - Structure destroyed!");
        };

        _bombardmentSystem.OnCivilianCasualties += (planetID, casualties) =>
        {
            System.Console.WriteLine($"   - Civilian casualties: {casualties}");
        };

        // Invasion events
        _invasionSystem.OnInvasionStarted += (planetID, faction) =>
        {
            var planet = _gameState.PlanetLookup[planetID];
            System.Console.WriteLine($"\n🪖  INVASION of {planet.Name} by {faction}!");
        };

        _invasionSystem.OnPlatoonsLanded += (planetID, platoonCount, totalTroops) =>
        {
            System.Console.WriteLine($"   - {platoonCount} platoons landed ({totalTroops} troops)");
        };

        _invasionSystem.OnPlanetCaptured += (planetID, newOwner, resources) =>
        {
            var planet = _gameState.PlanetLookup[planetID];
            System.Console.WriteLine($"\n🏴 PLANET CAPTURED! {planet.Name} now controlled by {newOwner}");
            System.Console.WriteLine($"   Resources seized: {resources.Credits} Credits, {resources.Minerals} Minerals");
        };
    }

    public void Run()
    {
        ShowMainMenu();

        while (_isRunning)
        {
            System.Console.Write("\n> ");
            var input = System.Console.ReadLine()?.Trim() ?? "";

            if (string.IsNullOrEmpty(input))
                continue;

            ProcessCommand(input);
        }
    }

    private void ShowMainMenu()
    {
        System.Console.WriteLine("=== MAIN MENU ===");
        System.Console.WriteLine("1. New Game");
        System.Console.WriteLine("2. Load Game");
        System.Console.WriteLine("3. Quit");
        System.Console.Write("\nChoice: ");

        var choice = System.Console.ReadLine()?.Trim();

        switch (choice)
        {
            case "1":
                StartNewGame();
                break;
            case "2":
                LoadGame();
                break;
            case "3":
                _isRunning = false;
                break;
            default:
                System.Console.WriteLine("Invalid choice. Starting new game...");
                StartNewGame();
                break;
        }
    }

    private void StartNewGame()
    {
        System.Console.WriteLine("\n=== NEW GAME ===");
        System.Console.Write("Enter your name (default: Commander): ");
        var playerName = System.Console.ReadLine()?.Trim();
        if (string.IsNullOrEmpty(playerName))
            playerName = "Commander";

        // Initialize game state
        _gameState = new GameState();

        // Initialize systems
        InitializeSystems();

        // Generate galaxy
        System.Console.WriteLine("\nGenerating galaxy...");
        _galaxyGenerator.GenerateGalaxy(_gameState);

        // Set player name
        _gameState.PlayerFaction.Name = playerName;

        // Initialize starting resources (generous for testing)
        _gameState.PlayerFaction.Resources.Credits = 100000;
        _gameState.PlayerFaction.Resources.Minerals = 50000;
        _gameState.PlayerFaction.Resources.Fuel = 25000;
        _gameState.PlayerFaction.Resources.Food = 10000;

        // Find home planets
        var playerHome = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.Player);
        var aiHome = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI);

        if (playerHome != null)
        {
            _selectedPlanetID = playerHome.ID;
            System.Console.WriteLine($"\nYour home planet: {playerHome.Name} ({playerHome.Type})");
        }

        if (aiHome != null)
        {
            System.Console.WriteLine($"AI home planet: {aiHome.Name} ({aiHome.Type})");
        }

        System.Console.WriteLine($"\nGalaxy generated with {_gameState.Planets.Count} planets.");
        System.Console.WriteLine("\nType 'help' for available commands.");

        ShowGameStatus();
    }

    private void LoadGame()
    {
        System.Console.Write("Enter save file name (default: savegame.sav): ");
        var fileName = System.Console.ReadLine()?.Trim();
        if (string.IsNullOrEmpty(fileName))
            fileName = "savegame.sav";

        try
        {
            var loaded = _saveSystem.Load(fileName);
            if (loaded != null && loaded.GameState != null)
            {
                _gameState = loaded.GameState;
                InitializeSystems();

                System.Console.WriteLine($"✓ Game loaded from {fileName}");
                System.Console.WriteLine($"  Turn: {loaded.TurnNumber}");
                System.Console.WriteLine($"  Saved: {loaded.SavedAt}");

                // Find player's first planet as selected
                var playerPlanet = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.Player);
                if (playerPlanet != null)
                    _selectedPlanetID = playerPlanet.ID;

                ShowGameStatus();
            }
            else
            {
                System.Console.WriteLine($"✗ Failed to load {fileName}. Starting new game...");
                StartNewGame();
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"✗ Error loading {fileName}: {ex.Message}");
            StartNewGame();
        }
    }

    private void ProcessCommand(string input)
    {
        var command = _commandParser.Parse(input);

        switch (command.Action)
        {
            case "help":
                ShowHelp();
                break;
            case "status":
                ShowGameStatus();
                break;
            case "galaxy":
                ShowGalaxy();
                break;
            case "planet":
                ShowPlanet(command.Args);
                break;
            case "select":
                SelectPlanet(command.Args);
                break;
            case "build":
                BuildStructure(command.Args);
                break;
            case "buy":
                BuyCraft(command.Args);
                break;
            case "commission":
                CommissionPlatoon(command.Args);
                break;
            case "upgrade":
                UpgradeTech(command.Args);
                break;
            case "attack":
                AttackPlanet(command.Args);
                break;
            case "bombard":
                BombardPlanet(command.Args);
                break;
            case "invade":
                InvadePlanet(command.Args);
                break;
            case "tax":
                SetTaxRate(command.Args);
                break;
            case "end":
                EndTurn();
                break;
            case "save":
                SaveGame(command.Args);
                break;
            case "quit":
                _isRunning = false;
                System.Console.WriteLine("Thanks for playing!");
                break;
            default:
                System.Console.WriteLine($"Unknown command: {input}. Type 'help' for commands.");
                break;
        }
    }

    private void ShowHelp()
    {
        System.Console.WriteLine("\n=== AVAILABLE COMMANDS ===");
        System.Console.WriteLine("status                 - Show current game status");
        System.Console.WriteLine("galaxy                 - Show all planets in galaxy");
        System.Console.WriteLine("planet [id]            - Show detailed planet info");
        System.Console.WriteLine("select [id]            - Select a planet");
        System.Console.WriteLine("build [type]           - Build structure (docking, mining, farm, defense, platform)");
        System.Console.WriteLine("buy [type]             - Buy craft (cruiser, cargo, satellite, processor)");
        System.Console.WriteLine("commission [equip] [weapon] - Commission platoon (standard/elite, pistol/rifle/plasma)");
        System.Console.WriteLine("upgrade                - Start weapon upgrade research");
        System.Console.WriteLine("attack [planetID]      - Attack planet (space combat)");
        System.Console.WriteLine("bombard [planetID]     - Bombard planet (destroy structures)");
        System.Console.WriteLine("invade [planetID]      - Invade planet (ground assault)");
        System.Console.WriteLine("tax [rate]             - Set tax rate (0-100)");
        System.Console.WriteLine("end                    - End turn");
        System.Console.WriteLine("save [filename]        - Save game");
        System.Console.WriteLine("quit                   - Quit game");
    }

    private void ShowGameStatus()
    {
        _display.ShowGameStatus(_gameState, _selectedPlanetID);
    }

    private void ShowGalaxy()
    {
        _display.ShowGalaxy(_gameState);
    }

    private void ShowPlanet(string[] args)
    {
        if (args.Length == 0)
        {
            _display.ShowPlanetDetails(_gameState, _selectedPlanetID);
        }
        else if (int.TryParse(args[0], out int planetID))
        {
            _display.ShowPlanetDetails(_gameState, planetID);
        }
        else
        {
            System.Console.WriteLine("Usage: planet [id]");
        }
    }

    private void SelectPlanet(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: select [planetID]");
            return;
        }

        if (int.TryParse(args[0], out int planetID))
        {
            if (_gameState.PlanetLookup.ContainsKey(planetID))
            {
                _selectedPlanetID = planetID;
                System.Console.WriteLine($"Selected planet {_gameState.PlanetLookup[planetID].Name} (ID: {planetID})");
                ShowPlanet(Array.Empty<string>());
            }
            else
            {
                System.Console.WriteLine($"Planet ID {planetID} not found.");
            }
        }
        else
        {
            System.Console.WriteLine("Invalid planet ID.");
        }
    }

    private void BuildStructure(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: build [type]");
            System.Console.WriteLine("Types: docking, mining, farm, defense, platform");
            return;
        }

        var type = args[0].ToLower() switch
        {
            "docking" => BuildingType.DockingBay,
            "mining" => BuildingType.MiningStation,
            "farm" => BuildingType.HorticulturalStation,
            "defense" => BuildingType.OrbitalDefense,
            "platform" => BuildingType.SurfacePlatform,
            _ => (BuildingType?)null
        };

        if (type == null)
        {
            System.Console.WriteLine("Invalid building type.");
            return;
        }

        var result = _buildingSystem.StartConstruction(_selectedPlanetID, type.Value);
        if (result)
        {
            System.Console.WriteLine($"✓ Started construction of {type}");
        }
        else
        {
            System.Console.WriteLine("✗ Construction failed. Check resources and planet ownership.");
        }
    }

    private void BuyCraft(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: buy [type]");
            System.Console.WriteLine("Types: cruiser, cargo, satellite, processor");
            return;
        }

        var type = args[0].ToLower() switch
        {
            "cruiser" => CraftType.BattleCruiser,
            "cargo" => CraftType.CargoCruiser,
            "satellite" => CraftType.SolarSatellite,
            "processor" => CraftType.AtmosphereProcessor,
            _ => (CraftType?)null
        };

        if (type == null)
        {
            System.Console.WriteLine("Invalid craft type.");
            return;
        }

        var craftID = _craftSystem.PurchaseCraft(type.Value, _selectedPlanetID, FactionType.Player);
        if (craftID >= 0)
        {
            System.Console.WriteLine($"✓ Purchased {type} (ID: {craftID})");
        }
        else
        {
            System.Console.WriteLine("✗ Purchase failed. Check resources, limits, or planet ownership.");
        }
    }

    private void CommissionPlatoon(string[] args)
    {
        if (args.Length < 2)
        {
            System.Console.WriteLine("Usage: commission [equipment] [weapon]");
            System.Console.WriteLine("Equipment: standard, elite");
            System.Console.WriteLine("Weapons: pistol, rifle, plasma");
            return;
        }

        var equipment = args[0].ToLower() switch
        {
            "standard" => EquipmentLevel.Standard,
            "elite" => EquipmentLevel.Elite,
            _ => (EquipmentLevel?)null
        };

        var weapon = args[1].ToLower() switch
        {
            "pistol" => WeaponLevel.Pistol,
            "rifle" => WeaponLevel.Rifle,
            "plasma" => WeaponLevel.Plasma,
            _ => (WeaponLevel?)null
        };

        if (equipment == null || weapon == null)
        {
            System.Console.WriteLine("Invalid equipment or weapon level.");
            return;
        }

        var platoonID = _platoonSystem.CommissionPlatoon(_selectedPlanetID, FactionType.Player, 100, equipment.Value, weapon.Value);
        if (platoonID >= 0)
        {
            System.Console.WriteLine($"✓ Commissioned platoon (ID: {platoonID}, {equipment}/{weapon}, 100 troops)");
        }
        else
        {
            System.Console.WriteLine("✗ Commission failed. Check resources or limits.");
        }
    }

    private void UpgradeTech(string[] args)
    {
        if (_upgradeSystem.StartResearch(FactionType.Player))
        {
            var tier = _upgradeSystem.GetResearchingTier(FactionType.Player);
            var turns = _upgradeSystem.GetResearchTurnsRemaining(FactionType.Player);
            System.Console.WriteLine($"✓ Started research for {tier} ({turns} turns)");
        }
        else
        {
            System.Console.WriteLine("✗ Research failed. Check resources or if already researching.");
        }
    }

    private void AttackPlanet(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: attack [planetID]");
            return;
        }

        if (int.TryParse(args[0], out int planetID))
        {
            var battle = _spaceCombatSystem.InitiateSpaceBattle(planetID, FactionType.Player);
            if (battle != null)
            {
                var result = _spaceCombatSystem.ExecuteSpaceCombat(battle);
                DisplaySpaceBattleResult(result);
            }
            else
            {
                System.Console.WriteLine("✗ Cannot initiate space battle. No craft in orbit?");
            }
        }
        else
        {
            System.Console.WriteLine("Invalid planet ID.");
        }
    }

    private void BombardPlanet(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: bombard [planetID]");
            return;
        }

        if (int.TryParse(args[0], out int planetID))
        {
            var result = _bombardmentSystem.BombardPlanet(planetID, FactionType.Player);
            if (result != null)
            {
                System.Console.WriteLine($"\n=== BOMBARDMENT RESULT ===");
                System.Console.WriteLine($"Strength: {result.BombardmentStrength}");
                System.Console.WriteLine($"Structures Destroyed: {result.StructuresDestroyed}");
                System.Console.WriteLine($"Civilian Casualties: {result.CivilianCasualties}");
                System.Console.WriteLine($"New Morale: {result.NewMorale}%");
            }
            else
            {
                System.Console.WriteLine("✗ Bombardment failed. Need orbital control and Battle Cruisers.");
            }
        }
        else
        {
            System.Console.WriteLine("Invalid planet ID.");
        }
    }

    private void InvadePlanet(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: invade [planetID]");
            return;
        }

        if (int.TryParse(args[0], out int planetID))
        {
            var result = _invasionSystem.InvadePlanet(planetID, FactionType.Player);
            if (result != null)
            {
                System.Console.WriteLine($"\n=== INVASION RESULT ===");
                System.Console.WriteLine($"Victory: {(result.AttackerWins ? "YES" : "NO")}");
                if (result.InstantSurrender)
                    System.Console.WriteLine("(Undefended - Instant Surrender)");
                System.Console.WriteLine($"Planet Captured: {result.PlanetCaptured}");
                System.Console.WriteLine($"Attacker Casualties: {result.AttackerCasualties}");
                System.Console.WriteLine($"Defender Casualties: {result.DefenderCasualties}");
                if (result.CapturedResources != null)
                {
                    System.Console.WriteLine($"Resources Captured: {result.CapturedResources.Credits} Credits");
                }
            }
            else
            {
                System.Console.WriteLine("✗ Invasion failed. Need orbital control and platoons aboard Battle Cruisers.");
            }
        }
        else
        {
            System.Console.WriteLine("Invalid planet ID.");
        }
    }

    private void SetTaxRate(string[] args)
    {
        if (args.Length == 0)
        {
            System.Console.WriteLine("Usage: tax [rate] (0-100)");
            return;
        }

        if (int.TryParse(args[0], out int rate))
        {
            _taxationSystem.SetTaxRate(_selectedPlanetID, rate);
            System.Console.WriteLine($"✓ Tax rate set to {rate}%");
        }
        else
        {
            System.Console.WriteLine("Invalid tax rate.");
        }
    }

    private void EndTurn()
    {
        System.Console.WriteLine("\n========================================");
        System.Console.WriteLine("         ENDING TURN");
        System.Console.WriteLine("========================================\n");

        // Execute turn phases
        System.Console.WriteLine("[Income Phase]");
        var playerIncome = _incomeSystem.CalculateFactionIncome(FactionType.Player);
        _gameState.PlayerFaction.Resources.Add(playerIncome);
        System.Console.WriteLine($"  Income: +{playerIncome.Credits} Credits, +{playerIncome.Minerals} Minerals");

        System.Console.WriteLine("[Population Phase]");
        _populationSystem.ProcessTurn();

        // Update construction
        System.Console.WriteLine("[Construction Phase]");
        _buildingSystem.UpdateConstruction();

        // Update research
        if (_upgradeSystem.IsResearching(FactionType.Player))
        {
            _upgradeSystem.ProcessTurn();
        }

        // AI turn would go here (Sprint 10)

        // Advance turn
        _turnSystem.AdvancePhase();

        System.Console.WriteLine("\n========================================");
        System.Console.WriteLine($"         TURN {_gameState.CurrentTurn} COMPLETE");
        System.Console.WriteLine("========================================\n");

        ShowGameStatus();
    }

    private void SaveGame(string[] args)
    {
        var fileName = args.Length > 0 ? args[0] : "savegame.sav";

        try
        {
            var saveData = _saveSystem.CreateSaveData("1.0.0", 0, "Console Playtest");
            _saveSystem.Save(saveData, fileName);
            System.Console.WriteLine($"✓ Game saved to {fileName}");
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"✗ Failed to save game: {ex.Message}");
        }
    }

    private void DisplaySpaceBattleResult(SpaceBattleResult result)
    {
        System.Console.WriteLine($"\n=== SPACE BATTLE RESULT ===");
        System.Console.WriteLine($"Victor: {(result.AttackerWins ? "Player" : "Defender")}");
        System.Console.WriteLine($"Attacker Strength: {result.AttackerStrength}");
        System.Console.WriteLine($"Defender Strength: {result.DefenderStrength}");
        System.Console.WriteLine($"Craft Destroyed: {result.DestroyedCraftIDs.Count}");

        if (result.DestroyedCraftIDs.Count > 0)
        {
            System.Console.WriteLine("Destroyed Craft:");
            foreach (var id in result.DestroyedCraftIDs)
            {
                System.Console.WriteLine($"  - Craft ID: {id}");
            }
        }
    }
}
