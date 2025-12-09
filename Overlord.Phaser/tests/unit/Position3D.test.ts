import { Position3D } from '@core/models/Position3D';

describe('Position3D', () => {
  describe('constructor', () => {
    it('should initialize with default values', () => {
      const pos = new Position3D();
      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
      expect(pos.z).toBe(0);
    });

    it('should initialize with provided values', () => {
      const pos = new Position3D(10, 20, 30);
      expect(pos.x).toBe(10);
      expect(pos.y).toBe(20);
      expect(pos.z).toBe(30);
    });
  });

  describe('distanceTo', () => {
    it('should calculate distance between two positions', () => {
      const pos1 = new Position3D(0, 0, 0);
      const pos2 = new Position3D(3, 4, 0);
      expect(pos1.distanceTo(pos2)).toBeCloseTo(5.0, 5);
    });

    it('should calculate 3D distance', () => {
      const pos1 = new Position3D(0, 0, 0);
      const pos2 = new Position3D(1, 1, 1);
      expect(pos1.distanceTo(pos2)).toBeCloseTo(Math.sqrt(3), 5);
    });

    it('should return 0 for same position', () => {
      const pos1 = new Position3D(5, 10, 15);
      const pos2 = new Position3D(5, 10, 15);
      expect(pos1.distanceTo(pos2)).toBeCloseTo(0, 5);
    });
  });

  describe('getAngleXZ', () => {
    it('should return 0 for position on positive X axis', () => {
      const pos = new Position3D(10, 0, 0);
      expect(pos.getAngleXZ()).toBeCloseTo(0, 5);
    });

    it('should return π/2 for position on positive Z axis', () => {
      const pos = new Position3D(0, 0, 10);
      expect(pos.getAngleXZ()).toBeCloseTo(Math.PI / 2, 5);
    });

    it('should return π for position on negative X axis', () => {
      const pos = new Position3D(-10, 0, 0);
      expect(Math.abs(pos.getAngleXZ())).toBeCloseTo(Math.PI, 5);
    });

    it('should return -π/2 for position on negative Z axis', () => {
      const pos = new Position3D(0, 0, -10);
      expect(pos.getAngleXZ()).toBeCloseTo(-Math.PI / 2, 5);
    });
  });

  describe('getRadiusXZ', () => {
    it('should calculate radius in XZ plane', () => {
      const pos = new Position3D(3, 10, 4); // Y should be ignored
      expect(pos.getRadiusXZ()).toBeCloseTo(5.0, 5);
    });

    it('should return 0 for position at origin', () => {
      const pos = new Position3D(0, 100, 0); // Y doesn't matter
      expect(pos.getRadiusXZ()).toBeCloseTo(0, 5);
    });

    it('should calculate radius correctly for negative coordinates', () => {
      const pos = new Position3D(-3, 0, -4);
      expect(pos.getRadiusXZ()).toBeCloseTo(5.0, 5);
    });
  });

  describe('fromPolar', () => {
    it('should create position from polar coordinates', () => {
      const pos = Position3D.fromPolar(0, 10, 0);
      expect(pos.x).toBeCloseTo(10, 5);
      expect(pos.y).toBeCloseTo(0, 5);
      expect(pos.z).toBeCloseTo(0, 5);
    });

    it('should create position at 90 degrees', () => {
      const pos = Position3D.fromPolar(Math.PI / 2, 10, 0);
      expect(pos.x).toBeCloseTo(0, 5);
      expect(pos.z).toBeCloseTo(10, 5);
    });

    it('should create position at 180 degrees', () => {
      const pos = Position3D.fromPolar(Math.PI, 10, 0);
      expect(pos.x).toBeCloseTo(-10, 5);
      expect(pos.z).toBeCloseTo(0, 5);
    });

    it('should round-trip with getAngleXZ and getRadiusXZ', () => {
      const originalAngle = Math.PI / 3;
      const originalRadius = 42;
      const pos = Position3D.fromPolar(originalAngle, originalRadius, 0);
      expect(pos.getAngleXZ()).toBeCloseTo(originalAngle, 5);
      expect(pos.getRadiusXZ()).toBeCloseTo(originalRadius, 5);
    });

    it('should use default Y value of 0', () => {
      const pos = Position3D.fromPolar(Math.PI / 4, 10);
      expect(pos.y).toBe(0);
    });

    it('should use provided Y value', () => {
      const pos = Position3D.fromPolar(Math.PI / 4, 10, 25);
      expect(pos.y).toBe(25);
    });
  });

  describe('toString', () => {
    it('should format position as string with 1 decimal place', () => {
      const pos = new Position3D(1.234, 5.678, 9.012);
      expect(pos.toString()).toBe('(1.2, 5.7, 9.0)');
    });
  });
});
