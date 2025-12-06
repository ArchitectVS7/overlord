namespace Overlord.Core.Interfaces;

/// <summary>
/// Interface for game settings management.
/// Provides platform-agnostic access to game configuration.
/// </summary>
public interface IGameSettings
{
    /// <summary>
    /// Gets a setting value by key.
    /// </summary>
    /// <typeparam name="T">Type of the setting value.</typeparam>
    /// <param name="key">Setting key.</param>
    /// <param name="defaultValue">Default value if setting not found.</param>
    /// <returns>Setting value or default.</returns>
    T GetSetting<T>(string key, T defaultValue);

    /// <summary>
    /// Sets a setting value by key.
    /// </summary>
    /// <typeparam name="T">Type of the setting value.</typeparam>
    /// <param name="key">Setting key.</param>
    /// <param name="value">Setting value.</param>
    void SetSetting<T>(string key, T value);

    /// <summary>
    /// Saves settings to persistent storage.
    /// </summary>
    void Save();

    /// <summary>
    /// Loads settings from persistent storage.
    /// </summary>
    void Load();
}
