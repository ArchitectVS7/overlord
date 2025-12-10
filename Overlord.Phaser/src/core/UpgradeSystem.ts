import { GameState } from './GameState';
import { FactionType, WeaponTier, CraftType } from './models/Enums';
import { UpgradeCosts } from './models/UpgradeModels';

/**
 * Platform-agnostic upgrade system for fleet-wide weapon research.
 * Manages weapon tier progression (Laser → Missile → Photon Torpedo).
 */
export class UpgradeSystem {
  private readonly gameState: GameState;

  /**
   * Event fired when weapon research starts.
   * Parameters: (faction, weaponTier)
   */
  public onResearchStarted?: (faction: FactionType, weaponTier: WeaponTier) => void;

  /**
   * Event fired when weapon research completes.
   * Parameters: (faction, weaponTier)
   */
  public onResearchCompleted?: (faction: FactionType, weaponTier: WeaponTier) => void;

  // Research state per faction
  private playerWeaponTier: WeaponTier = WeaponTier.Laser;
  private aiWeaponTier: WeaponTier = WeaponTier.Laser;

  private playerResearchingTier: WeaponTier | null = null;
  private aiResearchingTier: WeaponTier | null = null;

  private playerResearchTurnsRemaining: number = 0;
  private aiResearchTurnsRemaining: number = 0;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }

    this.gameState = gameState;
  }

  /**
   * Gets the current weapon tier for a faction.
   */
  public getWeaponTier(faction: FactionType): WeaponTier {
    return faction === FactionType.Player ? this.playerWeaponTier : this.aiWeaponTier;
  }

  /**
   * Checks if a faction is currently researching a weapon upgrade.
   */
  public isResearching(faction: FactionType): boolean {
    return faction === FactionType.Player
      ? this.playerResearchingTier !== null
      : this.aiResearchingTier !== null;
  }

  /**
   * Gets the weapon tier currently being researched (null if none).
   */
  public getResearchingTier(faction: FactionType): WeaponTier | null {
    return faction === FactionType.Player ? this.playerResearchingTier : this.aiResearchingTier;
  }

  /**
   * Gets the remaining research turns for a faction.
   */
  public getResearchTurnsRemaining(faction: FactionType): number {
    return faction === FactionType.Player
      ? this.playerResearchTurnsRemaining
      : this.aiResearchTurnsRemaining;
  }

  /**
   * Starts weapon upgrade research for a faction.
   * @param faction Faction researching
   * @returns True if research started, false if failed
   */
  public startResearch(faction: FactionType): boolean {
    // Get current and target tiers
    const currentTier = this.getWeaponTier(faction);
    const nextTier = this.getNextTier(currentTier);

    // Cannot research if already at max tier
    if (nextTier === null) {
      return false; // Already at Photon Torpedo
    }

    // Cannot research if already researching
    if (this.isResearching(faction)) {
      return false; // Research already in progress
    }

    // Get cost
    const cost = UpgradeCosts.getResearchCost(nextTier);

    // Validate resources (from faction resources)
    const factionState = faction === FactionType.Player ? this.gameState.playerFaction : this.gameState.aiFaction;
    if (factionState.resources.credits < cost) {
      return false; // Insufficient credits
    }

    // Deduct cost
    factionState.resources.credits -= cost;

    // Start research
    const researchTime = UpgradeCosts.getResearchTime(nextTier);

    if (faction === FactionType.Player) {
      this.playerResearchingTier = nextTier;
      this.playerResearchTurnsRemaining = researchTime;
    } else {
      this.aiResearchingTier = nextTier;
      this.aiResearchTurnsRemaining = researchTime;
    }

    this.onResearchStarted?.(faction, nextTier);
    return true;
  }

  /**
   * Updates research progress (called each turn during Income Phase).
   */
  public updateResearch(): void {
    // Update player research
    if (this.playerResearchingTier !== null && this.playerResearchTurnsRemaining > 0) {
      this.playerResearchTurnsRemaining--;

      if (this.playerResearchTurnsRemaining <= 0) {
        this.completeResearch(FactionType.Player);
      }
    }

    // Update AI research
    if (this.aiResearchingTier !== null && this.aiResearchTurnsRemaining > 0) {
      this.aiResearchTurnsRemaining--;

      if (this.aiResearchTurnsRemaining <= 0) {
        this.completeResearch(FactionType.AI);
      }
    }
  }

  /**
   * Completes weapon research and upgrades all Battle Cruisers.
   */
  private completeResearch(faction: FactionType): void {
    const researchedTier = faction === FactionType.Player ? this.playerResearchingTier : this.aiResearchingTier;

    if (!researchedTier) {
      return;
    }

    // Upgrade faction weapon tier
    if (faction === FactionType.Player) {
      this.playerWeaponTier = researchedTier;
      this.playerResearchingTier = null;
      this.playerResearchTurnsRemaining = 0;
    } else {
      this.aiWeaponTier = researchedTier;
      this.aiResearchingTier = null;
      this.aiResearchTurnsRemaining = 0;
    }

    // Get all Battle Cruisers owned by this faction for future upgrade
    const battleCruisers = this.gameState.craft.filter(
      c => c.owner === faction && c.type === CraftType.BattleCruiser
    );

    // Future combat system will apply weapon tier to these craft
    // For now, log the count and track the faction's weapon tier
    if (battleCruisers.length > 0) {
      // Prepared for future weapon tier application
    }

    this.onResearchCompleted?.(faction, researchedTier);
  }

  /**
   * Gets the next weapon tier in progression.
   */
  private getNextTier(current: WeaponTier): WeaponTier | null {
    switch (current) {
      case WeaponTier.Laser:
        return WeaponTier.Missile;
      case WeaponTier.Missile:
        return WeaponTier.PhotonTorpedo;
      case WeaponTier.PhotonTorpedo:
        return null; // Max tier
      default:
        return null;
    }
  }

  /**
   * Checks if a faction can afford to start the next weapon research.
   */
  public canAffordNextResearch(faction: FactionType): boolean {
    const currentTier = this.getWeaponTier(faction);
    const nextTier = this.getNextTier(currentTier);

    if (nextTier === null) {
      return false; // Already at max tier
    }

    const cost = UpgradeCosts.getResearchCost(nextTier);
    const factionState = faction === FactionType.Player ? this.gameState.playerFaction : this.gameState.aiFaction;

    return factionState.resources.credits >= cost;
  }

  /**
   * Gets the damage modifier for a faction's current weapon tier.
   */
  public getDamageModifier(faction: FactionType): number {
    const tier = this.getWeaponTier(faction);
    return UpgradeCosts.getDamageModifier(tier);
  }
}
