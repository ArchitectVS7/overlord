using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Represents saved game data including game state and metadata.
/// Serializable to JSON with System.Text.Json.
/// </summary>
public class SaveData
{
    /// <summary>
    /// Game version that created this save (for migration support).
    /// </summary>
    public string Version { get; set; } = "1.0.0";

    /// <summary>
    /// UTC timestamp when save was created (ISO 8601 format).
    /// </summary>
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Turn number at save time.
    /// </summary>
    public int TurnNumber { get; set; }

    /// <summary>
    /// Total playtime in seconds.
    /// </summary>
    public float Playtime { get; set; }

    /// <summary>
    /// Complete game state snapshot.
    /// </summary>
    public GameState GameState { get; set; } = new GameState();

    /// <summary>
    /// MD5 checksum for corruption detection (base64 encoded).
    /// </summary>
    public string Checksum { get; set; } = string.Empty;

    /// <summary>
    /// Optional: Base64-encoded PNG thumbnail (128x128) of galaxy map.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Thumbnail { get; set; }

    /// <summary>
    /// Victory status at save time.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public VictoryResult VictoryStatus { get; set; } = VictoryResult.None;

    /// <summary>
    /// Optional: Player-defined save name.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SaveName { get; set; }
}
