/**
 * Faction types in the game
 */
export enum FactionType {
  Player = 'Player',
  AI = 'AI',
  Neutral = 'Neutral'
}

/**
 * Planet types with different characteristics
 */
export enum PlanetType {
  Volcanic = 'Volcanic',
  Desert = 'Desert',
  Tropical = 'Tropical',
  Metropolis = 'Metropolis'
}

/**
 * Difficulty levels affecting gameplay
 */
export enum Difficulty {
  Easy = 'Easy',
  Normal = 'Normal',
  Hard = 'Hard'
}

/**
 * Turn phases in the game loop
 */
export enum TurnPhase {
  Income = 'Income',     // Resource generation, population growth
  Action = 'Action',     // Player/AI actions (building, moving, etc.)
  Combat = 'Combat',     // Combat resolution
  End = 'End'            // Turn cleanup, victory check
}

/**
 * Victory/defeat result
 */
export enum VictoryResult {
  None = 'None',                 // Game continues
  PlayerVictory = 'PlayerVictory', // Player won
  AIVictory = 'AIVictory'        // AI won
}

/**
 * Craft (ship) type categories
 */
export enum CraftType {
  BattleCruiser = 'BattleCruiser',         // Combat vessel, platoon transport (4 max)
  CargoCruiser = 'CargoCruiser',           // Resource transport (1,000 per resource)
  SolarSatellite = 'SolarSatellite',       // Energy production (80/turn)
  AtmosphereProcessor = 'AtmosphereProcessor' // Terraforming equipment (10 turns)
}

/**
 * Equipment levels for platoons (body armor)
 */
export enum EquipmentLevel {
  Civilian = 'Civilian',   // 20,000 Credits, 0.5x modifier (no armor)
  Basic = 'Basic',         // 35,000 Credits, 1.0x modifier (light armor)
  Standard = 'Standard',   // 55,000 Credits, 1.5x modifier (medium armor)
  Advanced = 'Advanced',   // 80,000 Credits, 2.0x modifier (heavy armor)
  Elite = 'Elite'          // 109,000 Credits, 2.5x modifier (power armor)
}

/**
 * Weapon levels for platoons
 */
export enum WeaponLevel {
  Pistol = 'Pistol',               // 5,000 Credits, 0.8x modifier
  Rifle = 'Rifle',                 // 10,000 Credits, 1.0x modifier
  AssaultRifle = 'AssaultRifle',   // 18,000 Credits, 1.3x modifier
  Plasma = 'Plasma'                // 30,000 Credits, 1.6x modifier
}

/**
 * Building/structure types on planets
 */
export enum BuildingType {
  DockingBay = 'DockingBay',                     // Orbital platform for craft (max 3)
  SurfacePlatform = 'SurfacePlatform',           // Generic surface slot
  MiningStation = 'MiningStation',               // Produces Minerals and Fuel
  HorticulturalStation = 'HorticulturalStation', // Produces Food
  SolarSatellite = 'SolarSatellite',             // Produces Energy (deployed craft)
  AtmosphereProcessor = 'AtmosphereProcessor',   // Terraforms neutral planets (10 turns)
  OrbitalDefense = 'OrbitalDefense'              // Defense platform (+20% defense bonus)
}

/**
 * Building status
 */
export enum BuildingStatus {
  UnderConstruction = 'UnderConstruction',
  Active = 'Active',
  Damaged = 'Damaged',
  Destroyed = 'Destroyed'
}

/**
 * Weapon tiers for Battle Cruisers (fleet-wide research)
 */
export enum WeaponTier {
  Laser = 'Laser',                   // 1.0x damage (starting)
  Missile = 'Missile',               // 1.5x damage (Tier 2 - 500k credits, 5 turns)
  PhotonTorpedo = 'PhotonTorpedo'    // 2.0x damage (Tier 3 - 1M credits, 8 turns)
}

/**
 * AI personality archetypes that influence decision-making
 */
export enum AIPersonality {
  Aggressive = 'Aggressive',   // Commander Kratos - warmonger
  Defensive = 'Defensive',     // Overseer Aegis - turtle
  Economic = 'Economic',       // Magistrate Midas - expansionist
  Balanced = 'Balanced'        // General Nexus - tactical
}

/**
 * AI difficulty levels that apply bonuses/penalties
 */
export enum AIDifficulty {
  Easy = 'Easy',       // -20% resources, -20% military, cautious
  Normal = 'Normal',   // No bonuses/penalties
  Hard = 'Hard'        // +20% resources, +20% military, aggressive
}
