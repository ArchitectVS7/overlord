# AFS-003: Save/Load System

**Status:** Updated (Post Design Review)
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-CORE-003
**Design Review:** Updated to use System.Text.Json (aligned with warzones project)

---

## Summary

Persistent save/load system that serializes complete game state to JSON files, manages multiple save slots, provides auto-save functionality, and supports cloud synchronization across PC and mobile platforms.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Provides serializable game state
- **AFS-002 (Turn System)**: Triggers auto-save during End Phase

---

## Requirements

### Save Slot Management

1. **Save Slots**
   - Minimum 10 manual save slots
   - 1 dedicated auto-save slot (overwritten each turn)
   - 1 quick-save slot (F5 hotkey on PC)
   - Save slot naming: Player-defined or auto-generated
   - Maximum saves limited only by disk space

2. **Save Metadata**
   - Turn number at save time
   - Real-world timestamp (date/time)
   - Preview thumbnail (128x128 PNG of galaxy map state)
   - Total playtime in session
   - Victory status (in-progress, victory, defeat)
   - Game version number (for migration support)

3. **Save File Management**
   - File format: JSON (.sav extension)
   - File location: Platform-specific (AppData/Documents on PC, Application Support on mobile)
   - Compressed with gzip to reduce file size
   - Version header for backward compatibility
   - Checksum validation to detect corruption

### Save Operations

1. **Manual Save**
   - Player initiates save via "Save Game" menu
   - Available only during Action Phase (not during AI turn or combat)
   - Prompts for save slot selection
   - Optional: Save name customization
   - Confirmation dialog if overwriting existing save
   - Progress indicator for saves >1 second

2. **Auto-Save**
   - Triggers at start of Player Income Phase (after AI turn completes)
   - Saves to dedicated auto-save slot
   - Silent operation (no UI interruption)
   - Optional: Disable in settings
   - Frequency: Every turn (configurable to every N turns)

3. **Quick-Save**
   - F5 hotkey on PC, dedicated button on mobile
   - Saves to dedicated quick-save slot
   - Instant operation with minimal feedback
   - Available only during Action Phase
   - Overwrites previous quick-save

### Load Operations

1. **Load from Main Menu**
   - Display all save slots with metadata
   - Sort by: Date (newest first), Turn number, Playtime
   - Filter by: In-progress, Victory, Defeat
   - Preview shows: Thumbnail, turn, date, playtime
   - Double-click or "Load" button to load

2. **Load from In-Game**
   - Accessible via pause menu during Action Phase
   - Warning: "Unsaved progress will be lost"
   - Confirmation dialog required
   - Returns to main menu on cancel

3. **Load Validation**
   - Verify file integrity (checksum)
   - Check version compatibility
   - Migrate old save formats if needed
   - Display error message if corrupt/incompatible
   - Fallback: Offer to delete corrupt save

### Cloud Synchronization

1. **Cloud Save Features**
   - Automatic upload after manual/auto-save (PC/Mobile)
   - Download most recent save on game launch
   - Conflict resolution: Prefer newest timestamp
   - Platform: Steam Cloud (PC), iCloud (iOS), Google Play (Android)
   - Optional: Disable in settings

2. **Sync Indicators**
   - "Cloud" icon on save slot if synced
   - "Uploading..." status during sync
   - "Conflict" warning if local/cloud differ
   - Manual "Sync Now" button in settings

3. **Offline Support**
   - Queue saves for upload when offline
   - Sync on next connection
   - Local saves always available

---

## Acceptance Criteria

### Functional Criteria

- [ ] Player can save game to any of 10+ manual slots
- [ ] Auto-save triggers every turn (configurable)
- [ ] Quick-save accessible via F5 hotkey (PC) or button (mobile)
- [ ] Load game from main menu displays all saves with metadata
- [ ] Save files include thumbnail preview of galaxy state
- [ ] Corrupt saves detected and rejected with error message
- [ ] Cloud sync uploads saves automatically (when enabled)
- [ ] Conflict resolution prefers newest timestamp

### Performance Criteria

- [ ] Save operation completes in <500ms (excluding cloud upload)
- [ ] Load operation completes in <1s (excluding cloud download)
- [ ] Save file size: <5MB compressed (typical game state)
- [ ] Cloud upload: <10s on average connection
- [ ] No frame drops during auto-save operation

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for serialization
- [ ] Triggered by Turn System (AFS-002) during End Phase
- [ ] Provides save metadata to UI System (AFS-071)
- [ ] Supports cloud platform APIs (Steam, iCloud, Google Play)

---

## Technical Notes

### Implementation Approach

```csharp
using System;
using System.IO;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using UnityEngine;

public class SaveSystem : MonoBehaviour
{
    private static SaveSystem _instance;
    public static SaveSystem Instance => _instance;

    private const string SaveFileExtension = ".sav";
    private const int MaxManualSlots = 10;

    // System.Text.Json serialization options (aligned with warzones project)
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = false, // Compressed JSON for smaller file size
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public void SaveGame(int slotIndex, string saveName = null)
    {
        var saveData = CreateSaveData();

        // Use System.Text.Json instead of JsonUtility
        var json = JsonSerializer.Serialize(saveData, JsonOptions);
        var compressed = CompressString(json);
        var filePath = GetSaveFilePath(slotIndex);

        File.WriteAllBytes(filePath, compressed);

        // Upload to cloud if enabled
        if (SettingsManager.Instance.CloudSaveEnabled)
        {
            CloudSaveManager.Instance.UploadSave(filePath);
        }

        Debug.Log($"Game saved to slot {slotIndex}");
    }

    public void LoadGame(int slotIndex)
    {
        var filePath = GetSaveFilePath(slotIndex);

        if (!File.Exists(filePath))
        {
            Debug.LogError($"Save file not found: {filePath}");
            return;
        }

        var compressed = File.ReadAllBytes(filePath);
        var json = DecompressString(compressed);

        // Use System.Text.Json instead of JsonUtility
        var saveData = JsonSerializer.Deserialize<SaveData>(json, JsonOptions);

        // Validate checksum
        if (!ValidateChecksum(saveData))
        {
            Debug.LogError("Save file corrupted!");
            UIManager.Instance.ShowError("Save file is corrupted and cannot be loaded.");
            return;
        }

        // Apply save data to game state
        GameStateManager.Instance.LoadState(saveData.GameState);

        Debug.Log($"Game loaded from slot {slotIndex}");
    }

    public void AutoSave()
    {
        SaveGame(AutoSaveSlotIndex, "AutoSave");
    }

    public void QuickSave()
    {
        SaveGame(QuickSaveSlotIndex, "QuickSave");
    }

    private SaveData CreateSaveData()
    {
        var saveData = new SaveData
        {
            Version = Application.version,
            SavedAt = DateTime.UtcNow, // Use DateTime directly (System.Text.Json handles serialization)
            TurnNumber = GameStateManager.Instance.GetCurrentTurn(),
            Playtime = Time.realtimeSinceStartup,
            GameState = GameStateManager.Instance.GetState(),
            Thumbnail = CaptureGalaxyThumbnail()
        };

        saveData.Checksum = CalculateChecksum(saveData);
        return saveData;
    }

    private byte[] CompressString(string text)
    {
        var bytes = Encoding.UTF8.GetBytes(text);
        using (var output = new MemoryStream())
        using (var gzip = new GZipStream(output, CompressionMode.Compress))
        {
            gzip.Write(bytes, 0, bytes.Length);
            return output.ToArray();
        }
    }

    private string DecompressString(byte[] compressed)
    {
        using (var input = new MemoryStream(compressed))
        using (var gzip = new GZipStream(input, CompressionMode.Decompress))
        using (var reader = new StreamReader(gzip))
        {
            return reader.ReadToEnd();
        }
    }

    private string CalculateChecksum(SaveData data)
    {
        // Serialize game state without checksum for validation
        var json = JsonSerializer.Serialize(data.GameState, JsonOptions);
        using (var md5 = MD5.Create())
        {
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(json));
            return Convert.ToBase64String(hash);
        }
    }

    private bool ValidateChecksum(SaveData data)
    {
        var expectedChecksum = CalculateChecksum(data);
        return data.Checksum == expectedChecksum;
    }
}

// SaveData class using System.Text.Json (aligned with warzones SaveSystem)
public class SaveData
{
    public string Version { get; set; }
    public DateTime SavedAt { get; set; } // System.Text.Json auto-serializes DateTime to ISO 8601
    public int TurnNumber { get; set; }
    public float Playtime { get; set; }
    public string Checksum { get; set; }
    public byte[] Thumbnail { get; set; } // PNG encoded (Base64 in JSON)
    public GameState GameState { get; set; }
}
```

### Save File Structure (System.Text.Json Format)

```json
{
  "version": "1.0.0",
  "savedAt": "2025-12-06T14:32:15.123Z",
  "turnNumber": 42,
  "playtime": 3542.5,
  "checksum": "3f7a9e2b1c4d5e6f...",
  "thumbnail": "<base64-encoded PNG>",
  "gameState": {
    "currentTurn": 42,
    "currentPhase": "PlayerAction",
    "craft": [...],
    "platoons": [...],
    "planets": [...]
  }
}
```

**Notes:**
- Property names use camelCase (via `JsonNamingPolicy.CamelCase`)
- DateTime serialized automatically to ISO 8601 format
- Checksum validation prevents corrupted saves from loading
- Format aligned with warzones project SaveSystem.cs

### Cloud Save Integration

```csharp
public class CloudSaveManager : MonoBehaviour
{
    public void UploadSave(string localFilePath)
    {
        #if UNITY_STANDALONE
        // Steam Cloud
        SteamRemoteStorage.FileWrite(Path.GetFileName(localFilePath), File.ReadAllBytes(localFilePath));
        #elif UNITY_IOS
        // iCloud
        iCloudBinding.SaveToCloud(localFilePath);
        #elif UNITY_ANDROID
        // Google Play Games
        PlayGamesPlatform.Instance.SavedGame.OpenWithAutomaticConflictResolution(
            Path.GetFileName(localFilePath),
            DataSource.ReadCacheOrNetwork,
            ConflictResolutionStrategy.UseMostRecentlySaved,
            OnSaveGameOpened);
        #endif
    }

    public void DownloadSave(string cloudFilePath, Action<string> onComplete)
    {
        // Platform-specific download logic
        // onComplete(localFilePath) when download finishes
    }

    public void ResolveConflict(SaveMetadata local, SaveMetadata cloud)
    {
        // Prefer newest timestamp
        var useLocal = local.Timestamp > cloud.Timestamp;
        if (useLocal)
        {
            UploadSave(local.FilePath); // Overwrite cloud
        }
        else
        {
            DownloadSave(cloud.FilePath, (localPath) => {
                // Replace local with cloud version
            });
        }
    }
}
```

### Thumbnail Generation

```csharp
private byte[] CaptureGalaxyThumbnail()
{
    // Render galaxy map to 128x128 texture
    var camera = GalaxyMapCamera;
    var renderTexture = new RenderTexture(128, 128, 24);
    camera.targetTexture = renderTexture;
    camera.Render();

    RenderTexture.active = renderTexture;
    var thumbnail = new Texture2D(128, 128, TextureFormat.RGB24, false);
    thumbnail.ReadPixels(new Rect(0, 0, 128, 128), 0, 0);
    thumbnail.Apply();

    var png = thumbnail.EncodeToPNG();
    RenderTexture.active = null;
    camera.targetTexture = null;
    Destroy(renderTexture);
    Destroy(thumbnail);

    return png;
}
```

### Save Migration Strategy

```csharp
private SaveData MigrateSaveData(SaveData oldData, string oldVersion)
{
    // Example: Migrate from v1.0 to v1.1
    if (oldVersion == "1.0.0")
    {
        // Add new fields with default values
        // Rename or restructure data as needed
        oldData.Version = "1.1.0";
    }

    return oldData;
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Provides GameState for serialization
- **AFS-002 (Turn System)**: Triggers auto-save during End Phase

### Depended On By
- **AFS-071 (UI State Machine)**: Displays save/load menus
- **AFS-091 (Cross-Platform Integration)**: Cloud save platform APIs

### Events Published
- `OnSaveStarted(int slotIndex)`: Save operation begins
- `OnSaveCompleted(int slotIndex, bool success)`: Save finished
- `OnLoadStarted(int slotIndex)`: Load operation begins
- `OnLoadCompleted(int slotIndex, bool success)`: Load finished
- `OnCloudSyncStarted()`: Cloud upload/download begins
- `OnCloudSyncCompleted(bool success)`: Cloud sync finished

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
