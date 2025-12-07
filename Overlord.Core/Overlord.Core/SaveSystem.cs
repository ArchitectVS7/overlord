using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic save/load system using System.Text.Json.
/// Handles serialization, compression, and checksum validation.
/// </summary>
public class SaveSystem
{
    private readonly GameState _gameState;

    /// <summary>
    /// JSON serialization options (camelCase, no null values).
    /// </summary>
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = false, // Compressed JSON for smaller file size
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter() }
    };

    /// <summary>
    /// Event fired when a save operation completes successfully.
    /// </summary>
    public event Action<SaveData>? OnSaveCompleted;

    /// <summary>
    /// Event fired when a load operation completes successfully.
    /// </summary>
    public event Action<SaveData>? OnLoadCompleted;

    /// <summary>
    /// Event fired when a save or load operation fails.
    /// </summary>
    public event Action<Exception>? OnSaveLoadError;

    public SaveSystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
    }

    /// <summary>
    /// Creates a save data snapshot of the current game state.
    /// </summary>
    /// <param name="version">Game version string (e.g., "1.0.0")</param>
    /// <param name="playtime">Total playtime in seconds</param>
    /// <param name="saveName">Optional player-defined save name</param>
    /// <param name="thumbnail">Optional base64-encoded PNG thumbnail</param>
    /// <returns>SaveData with checksum calculated</returns>
    public SaveData CreateSaveData(
        string version,
        float playtime,
        string? saveName = null,
        string? thumbnail = null)
    {
        var saveData = new SaveData
        {
            Version = version,
            SavedAt = DateTime.UtcNow,
            TurnNumber = _gameState.CurrentTurn,
            Playtime = playtime,
            GameState = _gameState,
            Thumbnail = thumbnail,
            SaveName = saveName,
            VictoryStatus = VictoryResult.None // Will be updated if game ended
        };

        // Calculate checksum
        saveData.Checksum = CalculateChecksum(saveData.GameState);

        return saveData;
    }

    /// <summary>
    /// Serializes save data to compressed byte array (JSON + GZip).
    /// </summary>
    /// <param name="saveData">Save data to serialize</param>
    /// <returns>Compressed byte array</returns>
    public byte[] Serialize(SaveData saveData)
    {
        try
        {
            // Serialize to JSON
            var json = JsonSerializer.Serialize(saveData, JsonOptions);

            // Compress with GZip
            var compressed = CompressString(json);

            OnSaveCompleted?.Invoke(saveData);

            return compressed;
        }
        catch (Exception ex)
        {
            OnSaveLoadError?.Invoke(ex);
            throw;
        }
    }

    /// <summary>
    /// Deserializes save data from compressed byte array (GZip + JSON).
    /// Validates checksum and throws exception if corrupt.
    /// </summary>
    /// <param name="compressedData">Compressed byte array</param>
    /// <returns>Deserialized save data</returns>
    /// <exception cref="InvalidOperationException">Thrown if checksum validation fails</exception>
    public SaveData Deserialize(byte[] compressedData)
    {
        try
        {
            // Decompress GZip
            var json = DecompressString(compressedData);

            // Deserialize JSON
            var saveData = JsonSerializer.Deserialize<SaveData>(json, JsonOptions);

            if (saveData == null)
            {
                throw new InvalidOperationException("Deserialization returned null");
            }

            // Validate checksum
            if (!ValidateChecksum(saveData))
            {
                throw new InvalidOperationException("Save file corrupted: checksum mismatch");
            }

            OnLoadCompleted?.Invoke(saveData);

            return saveData;
        }
        catch (Exception ex)
        {
            OnSaveLoadError?.Invoke(ex);
            throw;
        }
    }

    /// <summary>
    /// Applies loaded save data to the game state.
    /// Rebuilds lookup dictionaries after loading.
    /// </summary>
    /// <param name="saveData">Save data to apply</param>
    public void ApplyToGameState(SaveData saveData)
    {
        // Copy all properties from saved game state to current game state
        _gameState.CurrentTurn = saveData.GameState.CurrentTurn;
        _gameState.CurrentPhase = saveData.GameState.CurrentPhase;
        _gameState.LastActionTime = saveData.GameState.LastActionTime;

        _gameState.Craft = saveData.GameState.Craft;
        _gameState.Platoons = saveData.GameState.Platoons;
        _gameState.Planets = saveData.GameState.Planets;

        _gameState.PlayerFaction = saveData.GameState.PlayerFaction;
        _gameState.AIFaction = saveData.GameState.AIFaction;

        // Rebuild lookup dictionaries
        _gameState.RebuildLookups();

        // Validate loaded state
        if (!_gameState.Validate())
        {
            throw new InvalidOperationException("Loaded game state failed validation");
        }
    }

    /// <summary>
    /// Calculates MD5 checksum of game state for corruption detection.
    /// </summary>
    /// <param name="gameState">Game state to checksum</param>
    /// <returns>Base64-encoded MD5 hash</returns>
    public string CalculateChecksum(GameState gameState)
    {
        var json = JsonSerializer.Serialize(gameState, JsonOptions);
        using (var md5 = MD5.Create())
        {
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(json));
            return Convert.ToBase64String(hash);
        }
    }

    /// <summary>
    /// Validates that save data checksum matches recalculated checksum.
    /// </summary>
    /// <param name="saveData">Save data to validate</param>
    /// <returns>True if checksum matches, false if corrupted</returns>
    public bool ValidateChecksum(SaveData saveData)
    {
        var expectedChecksum = CalculateChecksum(saveData.GameState);
        return saveData.Checksum == expectedChecksum;
    }

    /// <summary>
    /// Compresses a string using GZip.
    /// </summary>
    private byte[] CompressString(string text)
    {
        var bytes = Encoding.UTF8.GetBytes(text);
        using (var output = new MemoryStream())
        {
            using (var gzip = new GZipStream(output, CompressionMode.Compress))
            {
                gzip.Write(bytes, 0, bytes.Length);
            }
            return output.ToArray();
        }
    }

    /// <summary>
    /// Decompresses a GZip byte array to string.
    /// </summary>
    private string DecompressString(byte[] compressed)
    {
        using (var input = new MemoryStream(compressed))
        using (var gzip = new GZipStream(input, CompressionMode.Decompress))
        using (var reader = new StreamReader(gzip))
        {
            return reader.ReadToEnd();
        }
    }
}
