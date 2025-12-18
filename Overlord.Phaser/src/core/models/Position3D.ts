/**
 * Platform-agnostic 3D position (replaces Unity's Vector3).
 */
export class Position3D {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Calculates distance to another position.
   */
  public distanceTo(other: Position3D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calculates the angle (in radians) from origin to this position in the XZ plane.
   */
  public getAngleXZ(): number {
    return Math.atan2(this.z, this.x);
  }

  /**
   * Calculates the radius (distance from origin) in the XZ plane.
   */
  public getRadiusXZ(): number {
    return Math.sqrt(this.x * this.x + this.z * this.z);
  }

  /**
   * Creates a position from polar coordinates (angle and radius in XZ plane).
   */
  public static fromPolar(angleRadians: number, radius: number, y: number = 0): Position3D {
    return new Position3D(
      Math.cos(angleRadians) * radius,
      y,
      Math.sin(angleRadians) * radius,
    );
  }

  /**
   * Creates a deep copy of this position.
   */
  public clone(): Position3D {
    return new Position3D(this.x, this.y, this.z);
  }

  public toString(): string {
    return `(${this.x.toFixed(1)}, ${this.y.toFixed(1)}, ${this.z.toFixed(1)})`;
  }
}
