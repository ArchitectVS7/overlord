using System.Text.Json;
using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic settings manager.
/// Handles settings serialization, validation, and change notifications.
/// Unity wrapper will handle file I/O and platform-specific application.
/// </summary>
public class SettingsManager
{
    private Settings _currentSettings;

    /// <summary>
    /// JSON serialization options (consistent with SaveSystem).
    /// </summary>
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = false,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
    };

    /// <summary>
    /// Event fired when any setting changes.
    /// </summary>
    public event Action<SettingsChangedEvent>? OnSettingsChanged;

    public SettingsManager()
    {
        _currentSettings = CreateDefaultSettings();
    }

    /// <summary>
    /// Gets the current settings (read-only access).
    /// </summary>
    public Settings CurrentSettings => _currentSettings;

    /// <summary>
    /// Loads settings from JSON string.
    /// </summary>
    /// <param name="json">JSON string containing settings</param>
    /// <returns>True if loaded successfully, false if using defaults</returns>
    public bool LoadFromJson(string? json)
    {
        if (string.IsNullOrEmpty(json))
        {
            _currentSettings = CreateDefaultSettings();
            return false;
        }

        try
        {
            var settings = JsonSerializer.Deserialize<Settings>(json, JsonOptions);
            if (settings == null)
            {
                _currentSettings = CreateDefaultSettings();
                return false;
            }

            ValidateSettings(settings);
            _currentSettings = settings;
            return true;
        }
        catch (JsonException)
        {
            _currentSettings = CreateDefaultSettings();
            return false;
        }
    }

    /// <summary>
    /// Saves settings to JSON string.
    /// </summary>
    /// <returns>JSON string containing current settings</returns>
    public string SaveToJson()
    {
        return JsonSerializer.Serialize(_currentSettings, JsonOptions);
    }

    /// <summary>
    /// Resets all settings to defaults.
    /// </summary>
    public void ResetToDefaults()
    {
        _currentSettings = CreateDefaultSettings();
        OnSettingsChanged?.Invoke(new SettingsChangedEvent
        {
            Category = SettingsCategory.All,
            CurrentSettings = _currentSettings
        });
    }

    // Graphics Settings

    /// <summary>
    /// Sets quality preset and applies corresponding graphics settings.
    /// </summary>
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

        NotifySettingsChanged(SettingsCategory.Graphics);
    }

    /// <summary>
    /// Sets screen resolution and window mode.
    /// </summary>
    public void SetResolution(int width, int height, bool fullscreen)
    {
        _currentSettings.Graphics.ResolutionWidth = width;
        _currentSettings.Graphics.ResolutionHeight = height;
        _currentSettings.Graphics.Fullscreen = fullscreen;

        NotifySettingsChanged(SettingsCategory.Graphics);
    }

    /// <summary>
    /// Sets VSync enabled/disabled.
    /// </summary>
    public void SetVSync(bool enabled)
    {
        _currentSettings.Graphics.VSync = enabled;
        NotifySettingsChanged(SettingsCategory.Graphics);
    }

    /// <summary>
    /// Sets framerate cap (30, 60, 120, or 0 for unlimited).
    /// </summary>
    public void SetFramerateCap(int cap)
    {
        _currentSettings.Graphics.FramerateCap = Math.Max(0, cap);
        NotifySettingsChanged(SettingsCategory.Graphics);
    }

    // Audio Settings

    /// <summary>
    /// Sets master volume (0.0 to 1.0).
    /// </summary>
    public void SetMasterVolume(float volume)
    {
        _currentSettings.Audio.MasterVolume = Math.Clamp(volume, 0f, 1f);
        NotifySettingsChanged(SettingsCategory.Audio);
    }

    /// <summary>
    /// Sets music volume (0.0 to 1.0).
    /// </summary>
    public void SetMusicVolume(float volume)
    {
        _currentSettings.Audio.MusicVolume = Math.Clamp(volume, 0f, 1f);
        NotifySettingsChanged(SettingsCategory.Audio);
    }

    /// <summary>
    /// Sets SFX volume (0.0 to 1.0).
    /// </summary>
    public void SetSFXVolume(float volume)
    {
        _currentSettings.Audio.SFXVolume = Math.Clamp(volume, 0f, 1f);
        NotifySettingsChanged(SettingsCategory.Audio);
    }

    /// <summary>
    /// Enables/disables UI sounds.
    /// </summary>
    public void SetUISounds(bool enabled)
    {
        _currentSettings.Audio.UISounds = enabled;
        NotifySettingsChanged(SettingsCategory.Audio);
    }

    // Gameplay Settings

    /// <summary>
    /// Sets auto-save frequency in turns (1 = every turn, 0 = disabled).
    /// </summary>
    public void SetAutoSaveFrequency(int turns)
    {
        _currentSettings.Gameplay.AutoSaveFrequency = Math.Max(0, turns);
        NotifySettingsChanged(SettingsCategory.Gameplay);
    }

    /// <summary>
    /// Enables/disables tooltips.
    /// </summary>
    public void SetTooltipsEnabled(bool enabled)
    {
        _currentSettings.Gameplay.TooltipsEnabled = enabled;
        NotifySettingsChanged(SettingsCategory.Gameplay);
    }

    /// <summary>
    /// Sets combat animation speed.
    /// </summary>
    public void SetCombatSpeed(CombatSpeed speed)
    {
        _currentSettings.Gameplay.CombatSpeed = speed;
        NotifySettingsChanged(SettingsCategory.Gameplay);
    }

    /// <summary>
    /// Sets AI turn execution speed.
    /// </summary>
    public void SetAITurnSpeed(AITurnSpeed speed)
    {
        _currentSettings.Gameplay.AITurnSpeed = speed;
        NotifySettingsChanged(SettingsCategory.Gameplay);
    }

    /// <summary>
    /// Sets confirmation dialog level.
    /// </summary>
    public void SetConfirmationDialogs(ConfirmationLevel level)
    {
        _currentSettings.Gameplay.ConfirmationDialogs = level;
        NotifySettingsChanged(SettingsCategory.Gameplay);
    }

    // Controls Settings

    /// <summary>
    /// Sets a key binding for an action.
    /// </summary>
    /// <param name="actionName">Name of the action (e.g., "EndTurn")</param>
    /// <param name="keyCode">Key code as string (e.g., "Space")</param>
    /// <returns>True if binding was successful, false if key already bound</returns>
    public bool SetKeyBinding(string actionName, string keyCode)
    {
        // Check if key is already bound to another action
        if (_currentSettings.Controls.KeyBindings.ContainsValue(keyCode))
        {
            var existingAction = _currentSettings.Controls.KeyBindings
                .FirstOrDefault(kvp => kvp.Value == keyCode).Key;

            if (existingAction != actionName)
            {
                return false; // Key already bound to different action
            }
        }

        _currentSettings.Controls.KeyBindings[actionName] = keyCode;
        NotifySettingsChanged(SettingsCategory.Controls);
        return true;
    }

    /// <summary>
    /// Sets mouse sensitivity (0.1 to 2.0).
    /// </summary>
    public void SetMouseSensitivity(float sensitivity)
    {
        _currentSettings.Controls.MouseSensitivity = Math.Clamp(sensitivity, 0.1f, 2.0f);
        NotifySettingsChanged(SettingsCategory.Controls);
    }

    /// <summary>
    /// Sets touch sensitivity for mobile (0.5 to 2.0).
    /// </summary>
    public void SetTouchSensitivity(float sensitivity)
    {
        _currentSettings.Controls.TouchSensitivity = Math.Clamp(sensitivity, 0.5f, 2.0f);
        NotifySettingsChanged(SettingsCategory.Controls);
    }

    /// <summary>
    /// Enables/disables edge scrolling (mouse at screen edge).
    /// </summary>
    public void SetEdgeScrolling(bool enabled)
    {
        _currentSettings.Controls.EdgeScrolling = enabled;
        NotifySettingsChanged(SettingsCategory.Controls);
    }

    // System Settings

    /// <summary>
    /// Enables/disables cloud save synchronization.
    /// </summary>
    public void SetCloudSaveEnabled(bool enabled)
    {
        _currentSettings.System.CloudSaveEnabled = enabled;
        NotifySettingsChanged(SettingsCategory.System);
    }

    /// <summary>
    /// Enables/disables analytics collection.
    /// </summary>
    public void SetAnalytics(bool enabled)
    {
        _currentSettings.System.Analytics = enabled;
        NotifySettingsChanged(SettingsCategory.System);
    }

    /// <summary>
    /// Sets game language.
    /// </summary>
    public void SetLanguage(string language)
    {
        _currentSettings.System.Language = language;
        NotifySettingsChanged(SettingsCategory.System);
    }

    /// <summary>
    /// Creates default settings with safe values.
    /// </summary>
    private Settings CreateDefaultSettings()
    {
        var settings = new Settings
        {
            Graphics = new GraphicsSettings
            {
                QualityPreset = QualityPreset.High,
                ResolutionWidth = 1920,
                ResolutionHeight = 1080,
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
                InvertYAxis = false,
                TouchSensitivity = 1.0f,
                GestureControls = true,
                ButtonSize = ButtonSize.Medium,
                ButtonOpacity = 0.75f,
                HapticFeedback = true
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

    /// <summary>
    /// Gets default key bindings.
    /// </summary>
    private Dictionary<string, string> GetDefaultKeyBindings()
    {
        return new Dictionary<string, string>
        {
            { "EndTurn", "Space" },
            { "QuickSave", "F5" },
            { "QuickLoad", "F9" },
            { "OpenMenu", "Escape" },
            { "Help", "F1" },
            { "CameraUp", "W" },
            { "CameraDown", "S" },
            { "CameraLeft", "A" },
            { "CameraRight", "D" },
            { "ZoomIn", "Q" },
            { "ZoomOut", "E" },
            { "SelectAll", "LeftControl" }
        };
    }

    /// <summary>
    /// Validates and clamps settings to safe ranges.
    /// </summary>
    private void ValidateSettings(Settings settings)
    {
        // Validate audio volumes (0.0 to 1.0)
        settings.Audio.MasterVolume = Math.Clamp(settings.Audio.MasterVolume, 0f, 1f);
        settings.Audio.MusicVolume = Math.Clamp(settings.Audio.MusicVolume, 0f, 1f);
        settings.Audio.SFXVolume = Math.Clamp(settings.Audio.SFXVolume, 0f, 1f);

        // Validate mouse sensitivity (0.1 to 2.0)
        settings.Controls.MouseSensitivity = Math.Clamp(settings.Controls.MouseSensitivity, 0.1f, 2.0f);
        settings.Controls.TouchSensitivity = Math.Clamp(settings.Controls.TouchSensitivity, 0.5f, 2.0f);

        // Validate button opacity (0.0 to 1.0)
        settings.Controls.ButtonOpacity = Math.Clamp(settings.Controls.ButtonOpacity, 0f, 1f);

        // Validate resolution (minimum 640x480)
        if (settings.Graphics.ResolutionWidth < 640 || settings.Graphics.ResolutionHeight < 480)
        {
            settings.Graphics.ResolutionWidth = 1920;
            settings.Graphics.ResolutionHeight = 1080;
        }

        // Validate framerate cap (0 or >= 30)
        if (settings.Graphics.FramerateCap > 0 && settings.Graphics.FramerateCap < 30)
        {
            settings.Graphics.FramerateCap = 30;
        }

        // Validate auto-save frequency (0 or >= 1)
        settings.Gameplay.AutoSaveFrequency = Math.Max(0, settings.Gameplay.AutoSaveFrequency);

        // Ensure key bindings dictionary exists
        settings.Controls.KeyBindings ??= GetDefaultKeyBindings();
    }

    /// <summary>
    /// Fires OnSettingsChanged event.
    /// </summary>
    private void NotifySettingsChanged(SettingsCategory category)
    {
        OnSettingsChanged?.Invoke(new SettingsChangedEvent
        {
            Category = category,
            CurrentSettings = _currentSettings
        });
    }
}
