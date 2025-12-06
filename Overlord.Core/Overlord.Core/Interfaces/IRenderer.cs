namespace Overlord.Core.Interfaces;

/// <summary>
/// Interface for rendering operations.
/// Unity-specific implementation will handle actual rendering.
/// </summary>
public interface IRenderer
{
    /// <summary>
    /// Initializes the rendering system.
    /// </summary>
    void Initialize();

    /// <summary>
    /// Renders the current frame.
    /// </summary>
    void Render();

    /// <summary>
    /// Sets the camera position for the galaxy view.
    /// </summary>
    /// <param name="x">X coordinate.</param>
    /// <param name="y">Y coordinate.</param>
    /// <param name="z">Z coordinate.</param>
    void SetCameraPosition(float x, float y, float z);

    /// <summary>
    /// Gets whether the rendering system is initialized.
    /// </summary>
    bool IsInitialized { get; }
}
