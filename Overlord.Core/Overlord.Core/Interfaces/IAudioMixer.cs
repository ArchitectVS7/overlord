namespace Overlord.Core.Interfaces;

/// <summary>
/// Interface for audio playback and mixing.
/// Unity-specific implementation handles actual audio output.
/// </summary>
public interface IAudioMixer
{
    /// <summary>
    /// Plays a sound effect.
    /// </summary>
    /// <param name="soundId">ID of the sound to play.</param>
    /// <param name="volume">Volume (0.0 to 1.0).</param>
    void PlaySound(string soundId, float volume = 1.0f);

    /// <summary>
    /// Plays background music.
    /// </summary>
    /// <param name="musicId">ID of the music track.</param>
    /// <param name="loop">Whether to loop the music.</param>
    void PlayMusic(string musicId, bool loop = true);

    /// <summary>
    /// Stops background music.
    /// </summary>
    void StopMusic();

    /// <summary>
    /// Sets the master volume.
    /// </summary>
    /// <param name="volume">Volume (0.0 to 1.0).</param>
    void SetMasterVolume(float volume);

    /// <summary>
    /// Gets the current master volume.
    /// </summary>
    float MasterVolume { get; }
}
