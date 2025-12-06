using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Root settings container for all game settings.
/// </summary>
public class Settings
{
    public GraphicsSettings Graphics { get; set; } = new GraphicsSettings();
    public AudioSettings Audio { get; set; } = new AudioSettings();
    public GameplaySettings Gameplay { get; set; } = new GameplaySettings();
    public ControlsSettings Controls { get; set; } = new ControlsSettings();
    public SystemSettings System { get; set; } = new SystemSettings();
}

/// <summary>
/// Graphics quality and display settings.
/// </summary>
public class GraphicsSettings
{
    public QualityPreset QualityPreset { get; set; } = QualityPreset.High;
    public int ResolutionWidth { get; set; } = 1920;
    public int ResolutionHeight { get; set; } = 1080;
    public bool Fullscreen { get; set; } = true;
    public bool VSync { get; set; } = true;
    public int FramerateCap { get; set; } = 60;
    public TextureQuality TextureQuality { get; set; } = TextureQuality.High;
    public ShadowQuality ShadowQuality { get; set; } = ShadowQuality.Medium;
    public AntiAliasing AntiAliasing { get; set; } = AntiAliasing.FXAA;
    public bool PostProcessing { get; set; } = true;
}

/// <summary>
/// Audio volume and sound settings.
/// </summary>
public class AudioSettings
{
    public float MasterVolume { get; set; } = 0.8f;
    public float MusicVolume { get; set; } = 0.7f;
    public float SFXVolume { get; set; } = 0.8f;
    public bool UISounds { get; set; } = true;
    public bool MuteWhenUnfocused { get; set; } = false;
}

/// <summary>
/// Gameplay preferences and automation settings.
/// </summary>
public class GameplaySettings
{
    public int AutoSaveFrequency { get; set; } = 1; // Every turn
    public bool TooltipsEnabled { get; set; } = true;
    public bool TutorialPrompts { get; set; } = true;
    public CombatSpeed CombatSpeed { get; set; } = CombatSpeed.Normal;
    public AITurnSpeed AITurnSpeed { get; set; } = AITurnSpeed.Normal;
    public ConfirmationLevel ConfirmationDialogs { get; set; } = ConfirmationLevel.Important;
}

/// <summary>
/// Control bindings and input sensitivity settings.
/// </summary>
public class ControlsSettings
{
    public Dictionary<string, string> KeyBindings { get; set; } = new Dictionary<string, string>();
    public float MouseSensitivity { get; set; } = 1.0f;
    public bool EdgeScrolling { get; set; } = true;
    public CameraSpeed CameraSpeed { get; set; } = CameraSpeed.Normal;
    public bool InvertYAxis { get; set; } = false;

    // Mobile-specific
    public float TouchSensitivity { get; set; } = 1.0f;
    public bool GestureControls { get; set; } = true;
    public ButtonSize ButtonSize { get; set; } = ButtonSize.Medium;
    public float ButtonOpacity { get; set; } = 0.75f;
    public bool HapticFeedback { get; set; } = true;
}

/// <summary>
/// System-level settings (cloud saves, analytics, language).
/// </summary>
public class SystemSettings
{
    public bool CloudSaveEnabled { get; set; } = true;
    public bool Analytics { get; set; } = true;
    public string Language { get; set; } = "English";
}

/// <summary>
/// Event data for settings change notifications.
/// </summary>
public class SettingsChangedEvent
{
    public SettingsCategory Category { get; set; }
    public Settings CurrentSettings { get; set; } = new Settings();
}

// Enums

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum QualityPreset
{
    Low,
    Medium,
    High,
    Ultra
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TextureQuality
{
    Low,
    Medium,
    High
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ShadowQuality
{
    Off,
    Low,
    Medium,
    High
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AntiAliasing
{
    Off,
    FXAA,
    MSAA2x,
    MSAA4x
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CombatSpeed
{
    Slow,   // 1x
    Normal, // 2x
    Fast,   // 4x
    Instant // No animation
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AITurnSpeed
{
    Slow,   // 3s delay
    Normal, // 5s delay
    Fast    // 10s delay
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ConfirmationLevel
{
    None,      // No confirmation dialogs
    Important, // Only for critical actions
    All        // Confirm all actions
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CameraSpeed
{
    Slow,
    Normal,
    Fast
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ButtonSize
{
    Small,
    Medium,
    Large
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SettingsCategory
{
    Graphics,
    Audio,
    Gameplay,
    Controls,
    System,
    All
}
