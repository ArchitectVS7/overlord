import { EquipmentLevel, WeaponLevel } from './Enums';

/**
 * Platoon costs based on equipment and weapon levels.
 * REBALANCED: Costs reduced 5× to align with increased taxation income
 * Progression: Civilian (~3k) → Basic (~8k) → Standard (~13k) → Advanced (~20k) → Elite (~30k)
 */
export class PlatoonCosts {
  /**
   * Equipment cost by level.
   */
  public static getEquipmentCost(level: EquipmentLevel): number {
    switch (level) {
      case EquipmentLevel.Civilian:
        return 2500;   // Was 20,000 (÷8 for early game viability)
      case EquipmentLevel.Basic:
        return 6000;   // Was 35,000 (÷5.8)
      case EquipmentLevel.Standard:
        return 10000;  // Was 55,000 (÷5.5)
      case EquipmentLevel.Advanced:
        return 16000;  // Was 80,000 (÷5)
      case EquipmentLevel.Elite:
        return 25000;  // Was 109,000 (÷4.4)
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
        return 500;    // Was 5,000 (÷10)
      case WeaponLevel.Rifle:
        return 2000;   // Was 10,000 (÷5)
      case WeaponLevel.AssaultRifle:
        return 3500;   // Was 18,000 (÷5.1)
      case WeaponLevel.Plasma:
        return 6000;   // Was 30,000 (÷5)
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
    trainingLevel: number,
  ): number {
    const equipMod = PlatoonModifiers.getEquipmentModifier(equipment);
    const weaponMod = PlatoonModifiers.getWeaponModifier(weapon);
    const trainingMod = PlatoonModifiers.getTrainingModifier(trainingLevel);

    return Math.floor(troops * equipMod * weaponMod * trainingMod);
  }
}
