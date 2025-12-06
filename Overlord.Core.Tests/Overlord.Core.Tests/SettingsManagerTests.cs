using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Core.Tests;

public class SettingsManagerTests
{
    [Fact]
    public void SettingsManager_Constructor_CreatesDefaultSettings()
    {
        // Act
        var settingsManager = new SettingsManager();

        // Assert
        Assert.NotNull(settingsManager.CurrentSettings);
        Assert.NotNull(settingsManager.CurrentSettings.Graphics);
        Assert.NotNull(settingsManager.CurrentSettings.Audio);
        Assert.NotNull(settingsManager.CurrentSettings.Gameplay);
        Assert.NotNull(settingsManager.CurrentSettings.Controls);
        Assert.NotNull(settingsManager.CurrentSettings.System);
    }

    [Fact]
    public void SaveToJson_ReturnsValidJson()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        var json = settingsManager.SaveToJson();

        // Assert
        Assert.NotNull(json);
        Assert.NotEmpty(json);
        Assert.Contains("graphics", json); // camelCase
        Assert.Contains("audio", json);
    }

    [Fact]
    public void LoadFromJson_RestoresSettings()
    {
        // Arrange
        var settingsManager1 = new SettingsManager();
        settingsManager1.SetMasterVolume(0.5f);
        settingsManager1.SetQualityPreset(QualityPreset.Low);

        var json = settingsManager1.SaveToJson();

        var settingsManager2 = new SettingsManager();

        // Act
        var success = settingsManager2.LoadFromJson(json);

        // Assert
        Assert.True(success);
        Assert.Equal(0.5f, settingsManager2.CurrentSettings.Audio.MasterVolume);
        Assert.Equal(QualityPreset.Low, settingsManager2.CurrentSettings.Graphics.QualityPreset);
    }

    [Fact]
    public void LoadFromJson_HandlesNullJson()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        var success = settingsManager.LoadFromJson(null);

        // Assert
        Assert.False(success);
        Assert.NotNull(settingsManager.CurrentSettings); // Should have defaults
    }

    [Fact]
    public void LoadFromJson_HandlesInvalidJson()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        var success = settingsManager.LoadFromJson("{ invalid json }");

        // Assert
        Assert.False(success);
        Assert.NotNull(settingsManager.CurrentSettings); // Should have defaults
    }

    [Fact]
    public void SetQualityPreset_Low_AppliesCorrectSettings()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetQualityPreset(QualityPreset.Low);

        // Assert
        Assert.Equal(QualityPreset.Low, settingsManager.CurrentSettings.Graphics.QualityPreset);
        Assert.Equal(TextureQuality.Low, settingsManager.CurrentSettings.Graphics.TextureQuality);
        Assert.Equal(ShadowQuality.Off, settingsManager.CurrentSettings.Graphics.ShadowQuality);
        Assert.Equal(AntiAliasing.Off, settingsManager.CurrentSettings.Graphics.AntiAliasing);
        Assert.False(settingsManager.CurrentSettings.Graphics.PostProcessing);
    }

    [Fact]
    public void SetQualityPreset_High_AppliesCorrectSettings()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetQualityPreset(QualityPreset.High);

        // Assert
        Assert.Equal(QualityPreset.High, settingsManager.CurrentSettings.Graphics.QualityPreset);
        Assert.Equal(TextureQuality.High, settingsManager.CurrentSettings.Graphics.TextureQuality);
        Assert.Equal(ShadowQuality.Medium, settingsManager.CurrentSettings.Graphics.ShadowQuality);
        Assert.Equal(AntiAliasing.MSAA2x, settingsManager.CurrentSettings.Graphics.AntiAliasing);
        Assert.True(settingsManager.CurrentSettings.Graphics.PostProcessing);
    }

    [Fact]
    public void SetQualityPreset_FiresOnSettingsChangedEvent()
    {
        // Arrange
        var settingsManager = new SettingsManager();
        SettingsChangedEvent? firedEvent = null;

        settingsManager.OnSettingsChanged += (evt) => firedEvent = evt;

        // Act
        settingsManager.SetQualityPreset(QualityPreset.Ultra);

        // Assert
        Assert.NotNull(firedEvent);
        Assert.Equal(SettingsCategory.Graphics, firedEvent.Category);
    }

    [Fact]
    public void SetResolution_UpdatesResolutionSettings()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetResolution(2560, 1440, false);

        // Assert
        Assert.Equal(2560, settingsManager.CurrentSettings.Graphics.ResolutionWidth);
        Assert.Equal(1440, settingsManager.CurrentSettings.Graphics.ResolutionHeight);
        Assert.False(settingsManager.CurrentSettings.Graphics.Fullscreen);
    }

    [Fact]
    public void SetMasterVolume_ClampsToValidRange()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetMasterVolume(1.5f); // Above max

        // Assert
        Assert.Equal(1.0f, settingsManager.CurrentSettings.Audio.MasterVolume);

        // Act
        settingsManager.SetMasterVolume(-0.5f); // Below min

        // Assert
        Assert.Equal(0.0f, settingsManager.CurrentSettings.Audio.MasterVolume);
    }

    [Fact]
    public void SetMasterVolume_FiresOnSettingsChangedEvent()
    {
        // Arrange
        var settingsManager = new SettingsManager();
        SettingsChangedEvent? firedEvent = null;

        settingsManager.OnSettingsChanged += (evt) => firedEvent = evt;

        // Act
        settingsManager.SetMasterVolume(0.5f);

        // Assert
        Assert.NotNull(firedEvent);
        Assert.Equal(SettingsCategory.Audio, firedEvent.Category);
        Assert.Equal(0.5f, firedEvent.CurrentSettings.Audio.MasterVolume);
    }

    [Fact]
    public void SetMusicVolume_UpdatesVolume()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetMusicVolume(0.3f);

        // Assert
        Assert.Equal(0.3f, settingsManager.CurrentSettings.Audio.MusicVolume);
    }

    [Fact]
    public void SetSFXVolume_UpdatesVolume()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetSFXVolume(0.9f);

        // Assert
        Assert.Equal(0.9f, settingsManager.CurrentSettings.Audio.SFXVolume);
    }

    [Fact]
    public void SetAutoSaveFrequency_UpdatesSetting()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetAutoSaveFrequency(5);

        // Assert
        Assert.Equal(5, settingsManager.CurrentSettings.Gameplay.AutoSaveFrequency);
    }

    [Fact]
    public void SetAutoSaveFrequency_ClampsNegativeValues()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetAutoSaveFrequency(-5);

        // Assert
        Assert.Equal(0, settingsManager.CurrentSettings.Gameplay.AutoSaveFrequency);
    }

    [Fact]
    public void SetCombatSpeed_UpdatesSetting()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetCombatSpeed(CombatSpeed.Fast);

        // Assert
        Assert.Equal(CombatSpeed.Fast, settingsManager.CurrentSettings.Gameplay.CombatSpeed);
    }

    [Fact]
    public void SetKeyBinding_AddsNewBinding()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        var success = settingsManager.SetKeyBinding("CustomAction", "F");

        // Assert
        Assert.True(success);
        Assert.Equal("F", settingsManager.CurrentSettings.Controls.KeyBindings["CustomAction"]);
    }

    [Fact]
    public void SetKeyBinding_RejectsConflictingBinding()
    {
        // Arrange
        var settingsManager = new SettingsManager();
        settingsManager.SetKeyBinding("Action1", "F");

        // Act
        var success = settingsManager.SetKeyBinding("Action2", "F"); // Same key

        // Assert
        Assert.False(success);
        Assert.False(settingsManager.CurrentSettings.Controls.KeyBindings.ContainsKey("Action2"));
    }

    [Fact]
    public void SetKeyBinding_AllowsRebindingSameAction()
    {
        // Arrange
        var settingsManager = new SettingsManager();
        settingsManager.SetKeyBinding("Action1", "F");

        // Act
        var success = settingsManager.SetKeyBinding("Action1", "F"); // Same action, same key

        // Assert
        Assert.True(success);
        Assert.Equal("F", settingsManager.CurrentSettings.Controls.KeyBindings["Action1"]);
    }

    [Fact]
    public void SetMouseSensitivity_ClampsToValidRange()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetMouseSensitivity(5.0f); // Above max

        // Assert
        Assert.Equal(2.0f, settingsManager.CurrentSettings.Controls.MouseSensitivity);

        // Act
        settingsManager.SetMouseSensitivity(0.05f); // Below min

        // Assert
        Assert.Equal(0.1f, settingsManager.CurrentSettings.Controls.MouseSensitivity);
    }

    [Fact]
    public void SetCloudSaveEnabled_UpdatesSetting()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetCloudSaveEnabled(false);

        // Assert
        Assert.False(settingsManager.CurrentSettings.System.CloudSaveEnabled);
    }

    [Fact]
    public void ResetToDefaults_RestoresDefaultSettings()
    {
        // Arrange
        var settingsManager = new SettingsManager();
        settingsManager.SetMasterVolume(0.1f);
        settingsManager.SetQualityPreset(QualityPreset.Low);

        // Act
        settingsManager.ResetToDefaults();

        // Assert
        Assert.Equal(0.8f, settingsManager.CurrentSettings.Audio.MasterVolume); // Default
        Assert.Equal(QualityPreset.High, settingsManager.CurrentSettings.Graphics.QualityPreset); // Default
    }

    [Fact]
    public void ResetToDefaults_FiresOnSettingsChangedEvent()
    {
        // Arrange
        var settingsManager = new SettingsManager();
        SettingsChangedEvent? firedEvent = null;

        settingsManager.OnSettingsChanged += (evt) => firedEvent = evt;

        // Act
        settingsManager.ResetToDefaults();

        // Assert
        Assert.NotNull(firedEvent);
        Assert.Equal(SettingsCategory.All, firedEvent.Category);
    }

    [Fact]
    public void DefaultSettings_HasCorrectDefaults()
    {
        // Act
        var settingsManager = new SettingsManager();

        // Assert
        Assert.Equal(QualityPreset.High, settingsManager.CurrentSettings.Graphics.QualityPreset);
        Assert.Equal(0.8f, settingsManager.CurrentSettings.Audio.MasterVolume);
        Assert.Equal(0.7f, settingsManager.CurrentSettings.Audio.MusicVolume);
        Assert.Equal(0.8f, settingsManager.CurrentSettings.Audio.SFXVolume);
        Assert.True(settingsManager.CurrentSettings.Gameplay.TooltipsEnabled);
        Assert.Equal(1, settingsManager.CurrentSettings.Gameplay.AutoSaveFrequency);
        Assert.Equal(1.0f, settingsManager.CurrentSettings.Controls.MouseSensitivity);
        Assert.True(settingsManager.CurrentSettings.System.CloudSaveEnabled);
        Assert.Equal("English", settingsManager.CurrentSettings.System.Language);
    }

    [Fact]
    public void DefaultSettings_HasDefaultKeyBindings()
    {
        // Act
        var settingsManager = new SettingsManager();

        // Assert
        Assert.Equal("Space", settingsManager.CurrentSettings.Controls.KeyBindings["EndTurn"]);
        Assert.Equal("F5", settingsManager.CurrentSettings.Controls.KeyBindings["QuickSave"]);
        Assert.Equal("F9", settingsManager.CurrentSettings.Controls.KeyBindings["QuickLoad"]);
        Assert.Equal("Escape", settingsManager.CurrentSettings.Controls.KeyBindings["OpenMenu"]);
    }

    [Fact]
    public void Serialization_PreservesAllSettings()
    {
        // Arrange
        var settingsManager1 = new SettingsManager();
        settingsManager1.SetQualityPreset(QualityPreset.Ultra);
        settingsManager1.SetMasterVolume(0.6f);
        settingsManager1.SetMusicVolume(0.4f);
        settingsManager1.SetSFXVolume(0.7f);
        settingsManager1.SetCombatSpeed(CombatSpeed.Fast);
        settingsManager1.SetMouseSensitivity(1.5f);

        var json = settingsManager1.SaveToJson();

        var settingsManager2 = new SettingsManager();

        // Act
        settingsManager2.LoadFromJson(json);

        // Assert
        Assert.Equal(QualityPreset.Ultra, settingsManager2.CurrentSettings.Graphics.QualityPreset);
        Assert.Equal(0.6f, settingsManager2.CurrentSettings.Audio.MasterVolume);
        Assert.Equal(0.4f, settingsManager2.CurrentSettings.Audio.MusicVolume);
        Assert.Equal(0.7f, settingsManager2.CurrentSettings.Audio.SFXVolume);
        Assert.Equal(CombatSpeed.Fast, settingsManager2.CurrentSettings.Gameplay.CombatSpeed);
        Assert.Equal(1.5f, settingsManager2.CurrentSettings.Controls.MouseSensitivity);
    }

    [Fact]
    public void LoadFromJson_ValidatesAndClampsValues()
    {
        // Arrange
        var json = @"{
            ""audio"": {
                ""masterVolume"": 1.5,
                ""musicVolume"": -0.5,
                ""sfxVolume"": 0.5
            },
            ""controls"": {
                ""mouseSensitivity"": 5.0,
                ""touchSensitivity"": 0.1
            },
            ""graphics"": {
                ""resolutionWidth"": 100,
                ""resolutionHeight"": 100
            }
        }";

        var settingsManager = new SettingsManager();

        // Act
        settingsManager.LoadFromJson(json);

        // Assert - values should be clamped to valid ranges
        Assert.Equal(1.0f, settingsManager.CurrentSettings.Audio.MasterVolume); // Clamped to max
        Assert.Equal(0.0f, settingsManager.CurrentSettings.Audio.MusicVolume); // Clamped to min
        Assert.Equal(2.0f, settingsManager.CurrentSettings.Controls.MouseSensitivity); // Clamped to max
        Assert.Equal(0.5f, settingsManager.CurrentSettings.Controls.TouchSensitivity); // Clamped to min
        Assert.Equal(1920, settingsManager.CurrentSettings.Graphics.ResolutionWidth); // Reset to default (too small)
        Assert.Equal(1080, settingsManager.CurrentSettings.Graphics.ResolutionHeight); // Reset to default (too small)
    }

    [Fact]
    public void SetVSync_UpdatesSetting()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetVSync(false);

        // Assert
        Assert.False(settingsManager.CurrentSettings.Graphics.VSync);
    }

    [Fact]
    public void SetFramerateCap_UpdatesSetting()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetFramerateCap(120);

        // Assert
        Assert.Equal(120, settingsManager.CurrentSettings.Graphics.FramerateCap);
    }

    [Fact]
    public void SetTooltipsEnabled_UpdatesSetting()
    {
        // Arrange
        var settingsManager = new SettingsManager();

        // Act
        settingsManager.SetTooltipsEnabled(false);

        // Assert
        Assert.False(settingsManager.CurrentSettings.Gameplay.TooltipsEnabled);
    }
}
