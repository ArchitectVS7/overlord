import { WeaponTier } from './Enums';

/**
 * Upgrade costs and research times for weapon tiers.
 */
export class UpgradeCosts {
  /**
   * Gets the research cost for a weapon tier.
   */
  public static getResearchCost(tier: WeaponTier): number {
    switch (tier) {
      case WeaponTier.Missile:
        return 500000; // 500,000 Credits
      case WeaponTier.PhotonTorpedo:
        return 1000000; // 1,000,000 Credits
      default:
        return 0; // Laser is starting tier (no cost)
    }
  }

  /**
   * Gets the research time in turns.
   */
  public static getResearchTime(tier: WeaponTier): number {
    switch (tier) {
      case WeaponTier.Missile:
        return 5; // 5 turns
      case WeaponTier.PhotonTorpedo:
        return 8; // 8 turns
      default:
        return 0; // Laser is starting tier (no research)
    }
  }

  /**
   * Gets the damage modifier for a weapon tier.
   */
  public static getDamageModifier(tier: WeaponTier): number {
    switch (tier) {
      case WeaponTier.Laser:
        return 1.0;
      case WeaponTier.Missile:
        return 1.5;
      case WeaponTier.PhotonTorpedo:
        return 2.0;
      default:
        return 1.0;
    }
  }
}
