import { FactionType } from './Enums';
import { ResourceDelta } from './ResourceModels';

/**
 * Represents a ground battle between platoons.
 */
export class Battle {
  public planetID: number = 0;
  public planetName: string = '';
  public attackerFaction: FactionType = FactionType.Player;
  public defenderFaction: FactionType = FactionType.Neutral;
  public attackingPlatoonIDs: number[] = [];
  public defendingPlatoonIDs: number[] = [];
}

/**
 * Result of a ground battle.
 */
export class BattleResult {
  public attackerWins: boolean = false;
  public attackerStrength: number = 0;
  public defenderStrength: number = 0;
  public attackerCasualties: number = 0;
  public defenderCasualties: number = 0;
  public planetCaptured: boolean = false;
  public platoonCasualties: Map<number, number> = new Map();
}

/**
 * Represents a space battle between craft fleets.
 */
export class SpaceBattle {
  public planetID: number = 0;
  public planetName: string = '';
  public attackerFaction: FactionType = FactionType.Player;
  public defenderFaction: FactionType = FactionType.Neutral;
  public attackerCraftIDs: number[] = [];
  public defenderCraftIDs: number[] = [];
  public defenderHasOrbitalDefense: boolean = false;
}

/**
 * Result of a space battle.
 */
export class SpaceBattleResult {
  public attackerWins: boolean = false;
  public attackerStrength: number = 0;
  public defenderStrength: number = 0;
  public damagePerCraft: number = 0;
  public destroyedCraftIDs: number[] = [];
  public craftDamage: Map<number, number> = new Map();
}

/**
 * Result of planetary bombardment.
 */
export class BombardmentResult {
  public planetID: number = 0;
  public bombardmentStrength: number = 0;
  public structuresDestroyed: number = 0;
  public destroyedStructureIDs: number[] = [];
  public civilianCasualties: number = 0;
  public newMorale: number = 0;
}

/**
 * Result of planetary invasion.
 */
export class InvasionResult {
  public attackerWins: boolean = false;
  public planetCaptured: boolean = false;
  public instantSurrender: boolean = false;
  public attackerCasualties: number = 0;
  public defenderCasualties: number = 0;
  public newPopulation: number = 0;
  public newMorale: number = 0;
  public capturedResources: ResourceDelta | null = null;
}
