namespace Overlord.Core.Interfaces;

/// <summary>
/// Interface for input handling.
/// Platform-specific implementations handle mouse, keyboard, and touch.
/// </summary>
public interface IInputProvider
{
    /// <summary>
    /// Gets whether a button is currently pressed.
    /// </summary>
    /// <param name="buttonName">Name of the button.</param>
    /// <returns>True if pressed, false otherwise.</returns>
    bool GetButton(string buttonName);

    /// <summary>
    /// Gets whether a button was pressed this frame.
    /// </summary>
    /// <param name="buttonName">Name of the button.</param>
    /// <returns>True if pressed this frame, false otherwise.</returns>
    bool GetButtonDown(string buttonName);

    /// <summary>
    /// Gets the mouse position in screen coordinates.
    /// </summary>
    /// <returns>Mouse position as (x, y) tuple.</returns>
    (float x, float y) GetMousePosition();

    /// <summary>
    /// Gets the primary touch position (for mobile).
    /// </summary>
    /// <returns>Touch position as (x, y) tuple, or null if no touch.</returns>
    (float x, float y)? GetPrimaryTouch();
}
