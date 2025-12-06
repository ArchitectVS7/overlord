using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Core.Tests;

public class SaveSystemTests
{
    [Fact]
    public void SaveSystem_Constructor_RequiresGameState()
    {
        Assert.Throws<ArgumentNullException>(() => new SaveSystem(null!));
    }

    [Fact]
    public void CreateSaveData_PopulatesAllFields()
    {
        // Arrange
        var gameState = new GameState { CurrentTurn = 5 };
        var saveSystem = new SaveSystem(gameState);

        // Act
        var saveData = saveSystem.CreateSaveData("1.0.0", 123.45f, "TestSave");

        // Assert
        Assert.Equal("1.0.0", saveData.Version);
        Assert.Equal(5, saveData.TurnNumber);
        Assert.Equal(123.45f, saveData.Playtime);
        Assert.Equal("TestSave", saveData.SaveName);
        Assert.NotEmpty(saveData.Checksum);
        Assert.True(saveData.SavedAt <= DateTime.UtcNow);
    }

    [Fact]
    public void CreateSaveData_CalculatesChecksum()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);

        // Act
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        // Assert
        Assert.NotNull(saveData.Checksum);
        Assert.NotEmpty(saveData.Checksum);
        // Checksum should be base64 (only alphanumeric, +, /, and =)
        Assert.Matches(@"^[A-Za-z0-9+/=]+$", saveData.Checksum);
    }

    [Fact]
    public void Serialize_ReturnsCompressedByteArray()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        // Act
        var compressed = saveSystem.Serialize(saveData);

        // Assert
        Assert.NotNull(compressed);
        Assert.NotEmpty(compressed);
        // GZip magic bytes: 1F 8B
        Assert.Equal(0x1F, compressed[0]);
        Assert.Equal(0x8B, compressed[1]);
    }

    [Fact]
    public void Serialize_FiresOnSaveCompletedEvent()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);
        SaveData? firedSaveData = null;

        saveSystem.OnSaveCompleted += (data) => firedSaveData = data;

        // Act
        saveSystem.Serialize(saveData);

        // Assert
        Assert.NotNull(firedSaveData);
        Assert.Equal(saveData, firedSaveData);
    }

    [Fact]
    public void Deserialize_RestoresOriginalData()
    {
        // Arrange
        var gameState = new GameState
        {
            CurrentTurn = 10,
            CurrentPhase = TurnPhase.Combat
        };
        gameState.Craft.Add(new CraftEntity { ID = 1, Name = "Test Cruiser" });

        var saveSystem = new SaveSystem(gameState);
        var original = saveSystem.CreateSaveData("1.0.0", 456.78f, "SaveName");
        var compressed = saveSystem.Serialize(original);

        // Act
        var restored = saveSystem.Deserialize(compressed);

        // Assert
        Assert.Equal(original.Version, restored.Version);
        Assert.Equal(original.TurnNumber, restored.TurnNumber);
        Assert.Equal(original.Playtime, restored.Playtime);
        Assert.Equal(original.SaveName, restored.SaveName);
        Assert.Equal(original.GameState.CurrentTurn, restored.GameState.CurrentTurn);
        Assert.Equal(original.GameState.CurrentPhase, restored.GameState.CurrentPhase);
        Assert.Single(restored.GameState.Craft);
        Assert.Equal("Test Cruiser", restored.GameState.Craft[0].Name);
    }

    [Fact]
    public void Deserialize_FiresOnLoadCompletedEvent()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);
        var compressed = saveSystem.Serialize(saveData);

        SaveData? firedSaveData = null;
        saveSystem.OnLoadCompleted += (data) => firedSaveData = data;

        // Act
        saveSystem.Deserialize(compressed);

        // Assert
        Assert.NotNull(firedSaveData);
    }

    [Fact]
    public void Deserialize_ThrowsOnCorruptedData()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);
        var compressed = saveSystem.Serialize(saveData);

        // Corrupt the checksum
        var corrupted = saveSystem.Deserialize(compressed);
        corrupted.Checksum = "INVALID_CHECKSUM";
        var recompressed = saveSystem.Serialize(corrupted);

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => saveSystem.Deserialize(recompressed));
        Assert.Contains("checksum mismatch", exception.Message);
    }

    [Fact]
    public void Deserialize_FiresOnSaveLoadErrorEvent_WhenCorrupted()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);
        Exception? firedError = null;

        saveSystem.OnSaveLoadError += (ex) => firedError = ex;

        // Create corrupted save by manually tampering with checksum
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);
        var compressed = saveSystem.Serialize(saveData);
        var loaded = saveSystem.Deserialize(compressed);
        loaded.Checksum = "BAD_CHECKSUM";
        var corruptedCompressed = saveSystem.Serialize(loaded);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => saveSystem.Deserialize(corruptedCompressed));
        Assert.NotNull(firedError);
        Assert.IsType<InvalidOperationException>(firedError);
    }

    [Fact]
    public void ApplyToGameState_RestoresAllGameStateProperties()
    {
        // Arrange
        var originalState = new GameState
        {
            CurrentTurn = 15,
            CurrentPhase = TurnPhase.End
        };
        originalState.Craft.Add(new CraftEntity { ID = 1, Name = "Cruiser1" });
        originalState.Craft.Add(new CraftEntity { ID = 2, Name = "Cruiser2" });
        originalState.Platoons.Add(new PlatoonEntity { ID = 1, Name = "Platoon1" });
        originalState.Planets.Add(new PlanetEntity { ID = 1, Name = "Earth" });

        var saveSystem = new SaveSystem(originalState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 100f);

        // Create a fresh game state (different from saved state)
        var freshState = new GameState { CurrentTurn = 1 };
        var freshSaveSystem = new SaveSystem(freshState);

        // Act
        freshSaveSystem.ApplyToGameState(saveData);

        // Assert
        Assert.Equal(15, freshState.CurrentTurn);
        Assert.Equal(TurnPhase.End, freshState.CurrentPhase);
        Assert.Equal(2, freshState.Craft.Count);
        Assert.Single(freshState.Platoons);
        Assert.Single(freshState.Planets);
    }

    [Fact]
    public void ApplyToGameState_RebuildsLookupDictionaries()
    {
        // Arrange
        var originalState = new GameState();
        originalState.Craft.Add(new CraftEntity { ID = 5, Name = "TestCraft" });
        originalState.Platoons.Add(new PlatoonEntity { ID = 10, Name = "TestPlatoon" });
        originalState.Planets.Add(new PlanetEntity { ID = 15, Name = "TestPlanet" });

        var saveSystem = new SaveSystem(originalState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        var freshState = new GameState();
        var freshSaveSystem = new SaveSystem(freshState);

        // Act
        freshSaveSystem.ApplyToGameState(saveData);

        // Assert
        Assert.True(freshState.CraftLookup.ContainsKey(5));
        Assert.Equal("TestCraft", freshState.CraftLookup[5].Name);
        Assert.True(freshState.PlatoonLookup.ContainsKey(10));
        Assert.Equal("TestPlatoon", freshState.PlatoonLookup[10].Name);
        Assert.True(freshState.PlanetLookup.ContainsKey(15));
        Assert.Equal("TestPlanet", freshState.PlanetLookup[15].Name);
    }

    [Fact]
    public void ApplyToGameState_ThrowsIfLoadedStateInvalid()
    {
        // Arrange
        var originalState = new GameState();
        // Add too many craft (exceeds limit of 32)
        for (int i = 0; i < 33; i++)
        {
            originalState.Craft.Add(new CraftEntity { ID = i, Name = $"Craft{i}" });
        }

        var saveSystem = new SaveSystem(originalState);
        // Note: CreateSaveData doesn't validate, it just captures current state
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        var freshState = new GameState();
        var freshSaveSystem = new SaveSystem(freshState);

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => freshSaveSystem.ApplyToGameState(saveData));
        Assert.Contains("validation", exception.Message);
    }

    [Fact]
    public void CalculateChecksum_ReturnsSameChecksumForIdenticalState()
    {
        // Arrange
        var fixedTime = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);

        var state1 = new GameState { CurrentTurn = 5, LastActionTime = fixedTime };
        state1.Craft.Add(new CraftEntity { ID = 1, Name = "Test" });

        var state2 = new GameState { CurrentTurn = 5, LastActionTime = fixedTime };
        state2.Craft.Add(new CraftEntity { ID = 1, Name = "Test" });

        var saveSystem = new SaveSystem(state1);

        // Act
        var checksum1 = saveSystem.CalculateChecksum(state1);
        var checksum2 = saveSystem.CalculateChecksum(state2);

        // Assert
        Assert.Equal(checksum1, checksum2);
    }

    [Fact]
    public void CalculateChecksum_ReturnsDifferentChecksumForDifferentState()
    {
        // Arrange
        var state1 = new GameState { CurrentTurn = 5 };
        var state2 = new GameState { CurrentTurn = 10 };

        var saveSystem = new SaveSystem(state1);

        // Act
        var checksum1 = saveSystem.CalculateChecksum(state1);
        var checksum2 = saveSystem.CalculateChecksum(state2);

        // Assert
        Assert.NotEqual(checksum1, checksum2);
    }

    [Fact]
    public void ValidateChecksum_ReturnsTrueForValidSave()
    {
        // Arrange
        var gameState = new GameState();
        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        // Act
        var isValid = saveSystem.ValidateChecksum(saveData);

        // Assert
        Assert.True(isValid);
    }

    [Fact]
    public void ValidateChecksum_ReturnsFalseForTamperedSave()
    {
        // Arrange
        var gameState = new GameState { CurrentTurn = 5 };
        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        // Tamper with game state (change turn number after checksum calculated)
        saveData.GameState.CurrentTurn = 999;

        // Act
        var isValid = saveSystem.ValidateChecksum(saveData);

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void SaveSystem_CompressesDataEffectively()
    {
        // Arrange
        var gameState = new GameState();
        // Add some entities to create larger state
        for (int i = 0; i < 10; i++)
        {
            gameState.Craft.Add(new CraftEntity { ID = i, Name = $"Craft{i}" });
            gameState.Platoons.Add(new PlatoonEntity { ID = i, Name = $"Platoon{i}" });
        }

        var saveSystem = new SaveSystem(gameState);
        var saveData = saveSystem.CreateSaveData("1.0.0", 0f);

        // Act
        var compressed = saveSystem.Serialize(saveData);
        var uncompressedJson = System.Text.Json.JsonSerializer.Serialize(saveData, SaveSystem.JsonOptions);
        var uncompressedBytes = System.Text.Encoding.UTF8.GetBytes(uncompressedJson);

        // Assert - Compressed size should be smaller than uncompressed
        Assert.True(compressed.Length < uncompressedBytes.Length,
            $"Compressed ({compressed.Length}) should be smaller than uncompressed ({uncompressedBytes.Length})");
    }

    [Fact]
    public void SaveSystem_HandlesComplexGameState()
    {
        // Arrange
        var gameState = new GameState
        {
            CurrentTurn = 25,
            CurrentPhase = TurnPhase.Combat
        };

        // Add complex entities
        gameState.Craft.Add(new CraftEntity
        {
            ID = 1,
            Name = "Battle Cruiser Alpha",
            PlanetID = 2,
            Owner = FactionType.Player,
            Health = 85,
            Attack = 50,
            Defense = 40
        });

        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 10,
            Name = "Elite Guard",
            PlanetID = 3,
            Owner = FactionType.AI,
            Strength = 200
        });

        gameState.Planets.Add(new PlanetEntity
        {
            ID = 5,
            Name = "Mars Colony",
            Owner = FactionType.Player,
            Population = 10000
        });
        gameState.Planets[0].Resources.Credits = 50000;
        gameState.Planets[0].Resources.Minerals = 25000;

        gameState.PlayerFaction.Resources.Credits = 100000;
        gameState.PlayerFaction.MilitaryStrength = 500;

        var saveSystem = new SaveSystem(gameState);

        // Act
        var saveData = saveSystem.CreateSaveData("1.0.0", 1234.56f);
        var compressed = saveSystem.Serialize(saveData);
        var restored = saveSystem.Deserialize(compressed);

        // Assert
        Assert.Equal(25, restored.GameState.CurrentTurn);
        Assert.Equal(TurnPhase.Combat, restored.GameState.CurrentPhase);
        Assert.Equal("Battle Cruiser Alpha", restored.GameState.Craft[0].Name);
        Assert.Equal(50, restored.GameState.Craft[0].Attack);
        Assert.Equal("Elite Guard", restored.GameState.Platoons[0].Name);
        Assert.Equal(FactionType.AI, restored.GameState.Platoons[0].Owner);
        Assert.Equal("Mars Colony", restored.GameState.Planets[0].Name);
        Assert.Equal(50000, restored.GameState.Planets[0].Resources.Credits);
        Assert.Equal(100000, restored.GameState.PlayerFaction.Resources.Credits);
    }
}
