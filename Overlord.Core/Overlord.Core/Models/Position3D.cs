namespace Overlord.Core.Models;

/// <summary>
/// Platform-agnostic 3D position (replaces Unity's Vector3).
/// </summary>
public class Position3D
{
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }

    public Position3D()
    {
        X = 0f;
        Y = 0f;
        Z = 0f;
    }

    public Position3D(float x, float y, float z)
    {
        X = x;
        Y = y;
        Z = z;
    }

    /// <summary>
    /// Calculates distance to another position.
    /// </summary>
    public float DistanceTo(Position3D other)
    {
        float dx = X - other.X;
        float dy = Y - other.Y;
        float dz = Z - other.Z;
        return (float)Math.Sqrt(dx * dx + dy * dy + dz * dz);
    }

    /// <summary>
    /// Calculates the angle (in radians) from origin to this position in the XZ plane.
    /// </summary>
    public float GetAngleXZ()
    {
        return (float)Math.Atan2(Z, X);
    }

    /// <summary>
    /// Calculates the radius (distance from origin) in the XZ plane.
    /// </summary>
    public float GetRadiusXZ()
    {
        return (float)Math.Sqrt(X * X + Z * Z);
    }

    /// <summary>
    /// Creates a position from polar coordinates (angle and radius in XZ plane).
    /// </summary>
    public static Position3D FromPolar(float angleRadians, float radius, float y = 0f)
    {
        return new Position3D(
            (float)Math.Cos(angleRadians) * radius,
            y,
            (float)Math.Sin(angleRadians) * radius
        );
    }

    public override string ToString()
    {
        return $"({X:F1}, {Y:F1}, {Z:F1})";
    }
}
