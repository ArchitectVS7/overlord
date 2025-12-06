# AFS-004: Settings Manager

**Status:** Draft
**Priority:** P1 (Important)
**Owner:** Lead Developer
**PRD Reference:** FR-CORE-004

---

## Summary

Configuration system that manages player preferences for graphics, audio, controls, and gameplay, persisting settings across sessions and providing immediate application of changes without requiring restart.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Settings stored separately from game state
- **AFS-005 (Input System)**: Control remapping and sensitivity settings

---

## Requirements

### Settings Categories

1. **Graphics Settings**
   - Quality presets: Low, Medium, High, Ultra
   - Resolution (PC): Native, 1920x1080, 1280x720, custom
   - Window mode (PC): Fullscreen, Borderless, Windowed
   - VSync: On, Off
   - Framerate cap: 30, 60, 120, Unlimited
   - Texture quality: Low, Medium, High
   - Shadow quality: Off, Low, Medium, High
   - Anti-aliasing: Off, FXAA, MSAA 2x, MSAA 4x
   - Post-processing: Off, Low, High

2. **Audio Settings**
   - Master volume: 0-100% slider
   - Music volume: 0-100% slider
   - SFX volume: 0-100% slider
   - UI sounds: On, Off
   - Mute when unfocused: On, Off

3. **Gameplay Settings**
   - Auto-save frequency: Every turn, Every 3 turns, Every 5 turns, Off
   - Tooltips: On, Off
   - Tutorial prompts: On, Off
   - Combat speed: Slow (1x), Normal (2x), Fast (4x), Instant
   - AI turn speed: Slow (3s), Normal (5s), Fast (10s)
   - Confirmation dialogs: All, Important only, None

4. **Controls Settings (PC)**
   - Key bindings: Remappable for all actions
   - Mouse sensitivity: 0.1-2.0 multiplier
   - Edge scrolling: On, Off
   - Camera speed: Slow, Normal, Fast
   - Invert Y-axis: On, Off

5. **Controls Settings (Mobile)**
   - Touch sensitivity: 0.5-2.0 multiplier
   - Gesture controls: On, Off
   - Button size: Small, Medium, Large
   - Button opacity: 50%, 75%, 100%
   - Haptic feedback: On, Off

6. **System Settings**
   - Cloud saves: On, Off
   - Analytics: On, Off
   - Language: English (expandable)
   - Credits and version info (read-only)

### Settings Persistence

1. **Storage Format**
   - File format: JSON (.settings extension)
   - File location: PlayerPrefs (Unity built-in) for simple values, JSON file for complex data
   - Separate from game saves (not in save slots)
   - Applied immediately on change (no "Apply" button needed)

2. **Default Values**
   - Detect platform capabilities on first launch
   - Auto-select appropriate quality preset
   - Set safe defaults for all settings
   - Provide "Reset to Defaults" button

3. **Validation**
   - Clamp values to valid ranges
   - Reject invalid key bindings (conflicts, reserved keys)
   - Warn if settings may cause performance issues

### Settings Application

1. **Immediate Apply**
   - Graphics settings apply instantly (may cause brief frame hitch)
   - Audio settings apply instantly (smooth volume fade)
   - Control settings apply instantly
   - Gameplay settings apply next frame

2. **Performance Impact Warnings**
   - Warn if Ultra settings selected on low-end hardware
   - Display FPS counter in settings menu (optional)
   - Suggest presets based on current performance

---

## Acceptance Criteria

### Functional Criteria

- [ ] All settings persist across game restarts
- [ ] Graphics quality presets (Low/Medium/High/Ultra) apply correctly
- [ ] Audio volume controls (Master/Music/SFX) work independently
- [ ] Control remapping supports all actions (PC)
- [ ] Touch sensitivity adjustment works smoothly (Mobile)
- [ ] "Reset to Defaults" button restores all settings
- [ ] Settings menu accessible from main menu and pause menu
- [ ] Cloud saves toggle works with Save System (AFS-003)

### Performance Criteria

- [ ] Settings load in <100ms on game launch
- [ ] Settings save in <50ms on change
- [ ] Graphics setting changes apply in <500ms
- [ ] No frame drops when changing audio settings
- [ ] Settings file size: <50KB

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for separate persistence
- [ ] Provides control bindings to Input System (AFS-005)
- [ ] Provides cloud save toggle to Save System (AFS-003)
- [ ] Provides quality settings to Rendering System (AFS-081)
- [ ] Provides audio settings to Audio System (AFS-082)

---

## Technical Notes

### Implementation Approach

```csharp
public class SettingsManager : MonoBehaviour
{
    private static SettingsManager _instance;
    public static SettingsManager Instance => _instance;

    private Settings _currentSettings;

    public event Action<SettingsChangedEvent> OnSettingsChanged;

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
            LoadSettings();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void LoadSettings()
    {
        var json = PlayerPrefs.GetString("Settings", null);
        if (string.IsNullOrEmpty(json))
        {
            _currentSettings = CreateDefaultSettings();
        }
        else
        {
            _currentSettings = JsonUtility.FromJson<Settings>(json);
            ValidateSettings(_currentSettings);
        }

        ApplySettings(_currentSettings);
    }

    public void SaveSettings()
    {
        var json = JsonUtility.ToJson(_currentSettings, prettyPrint: false);
        PlayerPrefs.SetString("Settings", json);
        PlayerPrefs.Save();
    }

    // Graphics Settings
    public void SetQualityPreset(QualityPreset preset)
    {
        _currentSettings.Graphics.QualityPreset = preset;

        switch (preset)
        {
            case QualityPreset.Low:
                _currentSettings.Graphics.TextureQuality = TextureQuality.Low;
                _currentSettings.Graphics.ShadowQuality = ShadowQuality.Off;
                _currentSettings.Graphics.AntiAliasing = AntiAliasing.Off;
                _currentSettings.Graphics.PostProcessing = false;
                break;
            case QualityPreset.Medium:
                _currentSettings.Graphics.TextureQuality = TextureQuality.Medium;
                _currentSettings.Graphics.ShadowQuality = ShadowQuality.Low;
                _currentSettings.Graphics.AntiAliasing = AntiAliasing.FXAA;
                _currentSettings.Graphics.PostProcessing = false;
                break;
            case QualityPreset.High:
                _currentSettings.Graphics.TextureQuality = TextureQuality.High;
                _currentSettings.Graphics.ShadowQuality = ShadowQuality.Medium;
                _currentSettings.Graphics.AntiAliasing = AntiAliasing.MSAA2x;
                _currentSettings.Graphics.PostProcessing = true;
                break;
            case QualityPreset.Ultra:
                _currentSettings.Graphics.TextureQuality = TextureQuality.High;
                _currentSettings.Graphics.ShadowQuality = ShadowQuality.High;
                _currentSettings.Graphics.AntiAliasing = AntiAliasing.MSAA4x;
                _currentSettings.Graphics.PostProcessing = true;
                break;
        }

        ApplyGraphicsSettings();
        SaveSettings();
        OnSettingsChanged?.Invoke(new SettingsChangedEvent { Category = SettingsCategory.Graphics });
    }

    public void SetResolution(int width, int height, bool fullscreen)
    {
        _currentSettings.Graphics.ResolutionWidth = width;
        _currentSettings.Graphics.ResolutionHeight = height;
        _currentSettings.Graphics.Fullscreen = fullscreen;

        Screen.SetResolution(width, height, fullscreen);
        SaveSettings();
    }

    // Audio Settings
    public void SetMasterVolume(float volume)
    {
        _currentSettings.Audio.MasterVolume = Mathf.Clamp01(volume);
        ApplyAudioSettings();
        SaveSettings();
        OnSettingsChanged?.Invoke(new SettingsChangedEvent { Category = SettingsCategory.Audio });
    }

    public void SetMusicVolume(float volume)
    {
        _currentSettings.Audio.MusicVolume = Mathf.Clamp01(volume);
        ApplyAudioSettings();
        SaveSettings();
    }

    public void SetSFXVolume(float volume)
    {
        _currentSettings.Audio.SFXVolume = Mathf.Clamp01(volume);
        ApplyAudioSettings();
        SaveSettings();
    }

    // Gameplay Settings
    public void SetAutoSaveFrequency(int turns)
    {
        _currentSettings.Gameplay.AutoSaveFrequency = turns;
        SaveSettings();
    }

    public void SetCombatSpeed(CombatSpeed speed)
    {
        _currentSettings.Gameplay.CombatSpeed = speed;
        SaveSettings();
    }

    // Controls Settings
    public void RemapKey(string actionName, KeyCode newKey)
    {
        if (_currentSettings.Controls.KeyBindings.ContainsValue(newKey))
        {
            Debug.LogWarning($"Key {newKey} already bound to another action!");
            return;
        }

        _currentSettings.Controls.KeyBindings[actionName] = newKey;
        SaveSettings();
        OnSettingsChanged?.Invoke(new SettingsChangedEvent { Category = SettingsCategory.Controls });
    }

    public void SetMouseSensitivity(float sensitivity)
    {
        _currentSettings.Controls.MouseSensitivity = Mathf.Clamp(sensitivity, 0.1f, 2.0f);
        SaveSettings();
    }

    // System Settings
    public void SetCloudSaveEnabled(bool enabled)
    {
        _currentSettings.System.CloudSaveEnabled = enabled;
        SaveSettings();
    }

    // Reset to defaults
    public void ResetToDefaults()
    {
        _currentSettings = CreateDefaultSettings();
        ApplySettings(_currentSettings);
        SaveSettings();
        OnSettingsChanged?.Invoke(new SettingsChangedEvent { Category = SettingsCategory.All });
    }

    private Settings CreateDefaultSettings()
    {
        var settings = new Settings
        {
            Graphics = new GraphicsSettings
            {
                QualityPreset = DetectRecommendedQuality(),
                ResolutionWidth = Screen.currentResolution.width,
                ResolutionHeight = Screen.currentResolution.height,
                Fullscreen = true,
                VSync = true,
                FramerateCap = 60,
                TextureQuality = TextureQuality.High,
                ShadowQuality = ShadowQuality.Medium,
                AntiAliasing = AntiAliasing.FXAA,
                PostProcessing = true
            },
            Audio = new AudioSettings
            {
                MasterVolume = 0.8f,
                MusicVolume = 0.7f,
                SFXVolume = 0.8f,
                UISounds = true,
                MuteWhenUnfocused = false
            },
            Gameplay = new GameplaySettings
            {
                AutoSaveFrequency = 1, // Every turn
                TooltipsEnabled = true,
                TutorialPrompts = true,
                CombatSpeed = CombatSpeed.Normal,
                AITurnSpeed = AITurnSpeed.Normal,
                ConfirmationDialogs = ConfirmationLevel.Important
            },
            Controls = new ControlsSettings
            {
                KeyBindings = GetDefaultKeyBindings(),
                MouseSensitivity = 1.0f,
                EdgeScrolling = true,
                CameraSpeed = CameraSpeed.Normal,
                InvertYAxis = false
            },
            System = new SystemSettings
            {
                CloudSaveEnabled = true,
                Analytics = true,
                Language = "English"
            }
        };

        return settings;
    }

    private QualityPreset DetectRecommendedQuality()
    {
        // Basic heuristic based on system specs
        var ram = SystemInfo.systemMemorySize;
        var vram = SystemInfo.graphicsMemorySize;

        if (ram >= 16000 && vram >= 4000)
            return QualityPreset.Ultra;
        else if (ram >= 8000 && vram >= 2000)
            return QualityPreset.High;
        else if (ram >= 4000 && vram >= 1000)
            return QualityPreset.Medium;
        else
            return QualityPreset.Low;
    }

    private Dictionary<string, KeyCode> GetDefaultKeyBindings()
    {
        return new Dictionary<string, KeyCode>
        {
            { "EndTurn", KeyCode.Space },
            { "QuickSave", KeyCode.F5 },
            { "QuickLoad", KeyCode.F9 },
            { "OpenMenu", KeyCode.Escape },
            { "CameraUp", KeyCode.W },
            { "CameraDown", KeyCode.S },
            { "CameraLeft", KeyCode.A },
            { "CameraRight", KeyCode.D },
            { "ZoomIn", KeyCode.Q },
            { "ZoomOut", KeyCode.E },
            { "SelectAll", KeyCode.LeftControl }
        };
    }

    private void ApplySettings(Settings settings)
    {
        ApplyGraphicsSettings();
        ApplyAudioSettings();
    }

    private void ApplyGraphicsSettings()
    {
        QualitySettings.SetQualityLevel((int)_currentSettings.Graphics.QualityPreset);
        QualitySettings.vSyncCount = _currentSettings.Graphics.VSync ? 1 : 0;
        Application.targetFrameRate = _currentSettings.Graphics.FramerateCap;

        Screen.SetResolution(
            _currentSettings.Graphics.ResolutionWidth,
            _currentSettings.Graphics.ResolutionHeight,
            _currentSettings.Graphics.Fullscreen
        );
    }

    private void ApplyAudioSettings()
    {
        AudioListener.volume = _currentSettings.Audio.MasterVolume;
        // AudioSystem will read individual music/SFX volumes from this manager
    }

    private void ValidateSettings(Settings settings)
    {
        // Clamp values to valid ranges
        settings.Audio.MasterVolume = Mathf.Clamp01(settings.Audio.MasterVolume);
        settings.Audio.MusicVolume = Mathf.Clamp01(settings.Audio.MusicVolume);
        settings.Audio.SFXVolume = Mathf.Clamp01(settings.Audio.SFXVolume);
        settings.Controls.MouseSensitivity = Mathf.Clamp(settings.Controls.MouseSensitivity, 0.1f, 2.0f);

        // Ensure resolution is valid
        if (settings.Graphics.ResolutionWidth <= 0 || settings.Graphics.ResolutionHeight <= 0)
        {
            settings.Graphics.ResolutionWidth = 1920;
            settings.Graphics.ResolutionHeight = 1080;
        }
    }
}

[Serializable]
public class Settings
{
    public GraphicsSettings Graphics;
    public AudioSettings Audio;
    public GameplaySettings Gameplay;
    public ControlsSettings Controls;
    public SystemSettings System;
}

[Serializable]
public class GraphicsSettings
{
    public QualityPreset QualityPreset;
    public int ResolutionWidth;
    public int ResolutionHeight;
    public bool Fullscreen;
    public bool VSync;
    public int FramerateCap;
    public TextureQuality TextureQuality;
    public ShadowQuality ShadowQuality;
    public AntiAliasing AntiAliasing;
    public bool PostProcessing;
}

[Serializable]
public class AudioSettings
{
    public float MasterVolume;
    public float MusicVolume;
    public float SFXVolume;
    public bool UISounds;
    public bool MuteWhenUnfocused;
}

[Serializable]
public class GameplaySettings
{
    public int AutoSaveFrequency; // Turns
    public bool TooltipsEnabled;
    public bool TutorialPrompts;
    public CombatSpeed CombatSpeed;
    public AITurnSpeed AITurnSpeed;
    public ConfirmationLevel ConfirmationDialogs;
}

[Serializable]
public class ControlsSettings
{
    public Dictionary<string, KeyCode> KeyBindings;
    public float MouseSensitivity;
    public bool EdgeScrolling;
    public CameraSpeed CameraSpeed;
    public bool InvertYAxis;
}

[Serializable]
public class SystemSettings
{
    public bool CloudSaveEnabled;
    public bool Analytics;
    public string Language;
}

public enum QualityPreset { Low, Medium, High, Ultra }
public enum TextureQuality { Low, Medium, High }
public enum ShadowQuality { Off, Low, Medium, High }
public enum AntiAliasing { Off, FXAA, MSAA2x, MSAA4x }
public enum CombatSpeed { Slow, Normal, Fast, Instant }
public enum AITurnSpeed { Slow, Normal, Fast }
public enum ConfirmationLevel { None, Important, All }
public enum CameraSpeed { Slow, Normal, Fast }
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Settings stored separately from game state
- **AFS-005 (Input System)**: Provides control bindings

### Depended On By
- **AFS-003 (Save/Load System)**: Cloud save toggle setting
- **AFS-071 (UI State Machine)**: Settings menu display
- **AFS-081 (Rendering System)**: Graphics quality settings
- **AFS-082 (Audio System)**: Audio volume settings

### Events Published
- `OnSettingsChanged(SettingsChangedEvent)`: Any setting changed
- `OnGraphicsChanged()`: Graphics settings changed (trigger re-render)
- `OnAudioChanged()`: Audio settings changed (update mixers)
- `OnControlsChanged()`: Control bindings changed (rebind input)

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
