import { EquipmentLevel, WeaponLevel } from './Enums';

/**
 * Platoon costs based on equipment and weapon levels.
 */
export class PlatoonCosts {
  /**
   * Equipment cost by level.
   */
  public static getEquipmentCost(level: EquipmentLevel): number {
    switch (level) {
      case EquipmentLevel.Civilian:
        return 20000;
      case EquipmentLevel.Basic:
        return 35000;
      case EquipmentLevel.Standard:
        return 55000;
      case EquipmentLevel.Advanced:
        return 80000;
      case EquipmentLevel.Elite:
        return 109000;
      default:
        return 0;
    }
  }

  /**
   * Weapon cost by level.
   */
  public static getWeaponCost(level: WeaponLevel): number {
    switch (level) {
      case WeaponLevel.Pistol:
        return 5000;
      case WeaponLevel.Rifle:
        return 10000;
      case WeaponLevel.AssaultRifle:
        return 18000;
      case WeaponLevel.Plasma:
        return 30000;
      default:
        return 0;
    }
  }

  /**
   * Total cost for a platoon (equipment + weapon, one-time cost).
   */
  public static getTotalCost(equipment: EquipmentLevel, weapon: WeaponLevel): number {
    return PlatoonCosts.getEquipmentCost(equipment) + PlatoonCosts.getWeaponCost(weapon);
  }
}

/**
 * Combat modifiers for equipment and weapons.
 */
export class PlatoonModifiers {
  /**
   * Equipment combat modifier.
   */
  public static getEquipmentModifier(level: EquipmentLevel): number {
    switch (level) {
      case EquipmentLevel.Civilian:
        return 0.5;
      case EquipmentLevel.Basic:
        return 1.0;
      case EquipmentLevel.Standard:
        return 1.5;
      case EquipmentLevel.Advanced:
        return 2.0;
      case EquipmentLevel.Elite:
        return 2.5;
      default:
        return 1.0;
    }
  }

  /**
   * Weapon combat modifier.
   */
  public static getWeaponModifier(level: WeaponLevel): number {
    switch (level) {
      case WeaponLevel.Pistol:
        return 0.8;
      case WeaponLevel.Rifle:
        return 1.0;
      case WeaponLevel.AssaultRifle:
        return 1.3;
      case WeaponLevel.Plasma:
        return 1.6;
      default:
        return 1.0;
    }
  }

  /**
   * Training modifier (0.0 to 1.0 based on training level).
   */
  public static getTrainingModifier(trainingLevel: number): number {
    return trainingLevel / 100.0;
  }

  /**
   * Calculates total military strength for a platoon.
   * Formula: Troops × Equipment × Weapon × Training
   */
  public static calculateMilitaryStrength(
    troops: number,
    equipment: EquipmentLevel,
    weapon: WeaponLevel,
    trainingLevel: number
  ): number {
    const equipMod = PlatoonModifiers.getEquipmentModifier(equipment);
    const weaponMod = PlatoonModifiers.getWeaponModifier(weapon);
    const trainingMod = PlatoonModifiers.getTrainingModifier(trainingLevel);

    return Math.floor(troops * equipMod * weaponMod * trainingMod);
  }
}
