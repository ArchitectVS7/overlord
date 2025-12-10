/**
 * Visual configuration for planet rendering and colors
 */

export interface PlanetVisualConfig {
  color: number;
  size: number;
}

export const PLANET_VISUALS: Record<string, PlanetVisualConfig> = {
  Terran: { color: 0x22aa22, size: 32 },
  Desert: { color: 0xddaa77, size: 30 },
  Ice: { color: 0xccffff, size: 28 },
  Volcanic: { color: 0xff4422, size: 34 },
  GasGiant: { color: 0xffaa44, size: 48 }
};

export const OWNER_COLORS: Record<string, number> = {
  Player: 0x00ff00,
  AI: 0xff0000,
  Neutral: 0x808080
};

export const VISUAL_CONSTANTS = {
  OWNER_RING_WIDTH: 3,
  HIGHLIGHT_OFFSET: 4,
  HIGHLIGHT_SIZE_MULTIPLIER: 0.6,
  HIGHLIGHT_ALPHA: 0.4,
  TEXT_OFFSET_Y: 8,
  TEXT_FONT_SIZE: 14,
  TEXT_STROKE_WIDTH: 3
} as const;
