/**
 * Visual configuration for planet rendering and colors
 */

export interface PlanetVisualConfig {
  color: number;
  size: number;
}

/**
 * Visual config keyed by logical type names mapped from PlanetType enum:
 * - Desert → Desert
 * - Volcanic → Volcanic
 * - Tropical → Terran (green, lush worlds)
 * - Metropolis → GasGiant (large, developed worlds)
 */
export const PLANET_VISUALS: Record<string, PlanetVisualConfig> = {
  Terran: { color: 0x22aa22, size: 32 },    // Used for Tropical planets
  Desert: { color: 0xddaa77, size: 30 },    // Desert planets
  Volcanic: { color: 0xff4422, size: 34 },  // Volcanic planets
  GasGiant: { color: 0xffaa44, size: 48 },   // Used for Metropolis planets (largest)
};

export const OWNER_COLORS: Record<string, number> = {
  Player: 0x00bfff,
  AI: 0xff0000,
  Neutral: 0x808080,
};

export const VISUAL_CONSTANTS = {
  OWNER_RING_WIDTH: 3,
  HIGHLIGHT_OFFSET: 4,
  HIGHLIGHT_SIZE_MULTIPLIER: 0.6,
  HIGHLIGHT_ALPHA: 0.4,
  TEXT_OFFSET_Y: 8,
  TEXT_FONT_SIZE: 14,
  TEXT_STROKE_WIDTH: 3,
} as const;
