/**
 * BBSColors - Amber terminal color palette for BBS interface
 * Classic amber phosphor monitor aesthetic
 */
export const BBSColors = {
  // Background
  background: 0x0a0a00,      // Near black with warm tint

  // Text colors
  text: 0xffaa00,            // Amber/orange - primary text
  textDim: 0x886600,         // Dimmed amber - inactive/secondary
  textBright: 0xffcc44,      // Bright amber - emphasis

  // Interactive elements
  highlight: 0xffffff,       // White - selected items
  highlightBg: 0x442200,     // Dark amber - selection background

  // Borders and structure
  border: 0xcc8800,          // Darker amber - box borders
  borderDim: 0x664400,       // Very dim - inactive borders

  // Status colors
  error: 0xff4444,           // Red - errors/warnings
  success: 0x44ff44,         // Green - success messages
  info: 0x44aaff,            // Blue - informational

  // Faction colors
  player: 0x44ff44,          // Green - player owned
  ai: 0xff4444,              // Red - AI owned
  neutral: 0x888888,         // Gray - neutral

  // Phase indicators
  phaseIncome: 0x44ff44,     // Green
  phaseAction: 0xffaa00,     // Amber
  phaseCombat: 0xff4444,     // Red
  phaseEnd: 0x44aaff,        // Blue
};

/**
 * Convert hex color to Phaser-compatible string format
 */
export function hexToString(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}

/**
 * Box drawing characters for ASCII frames
 */
export const BoxChars = {
  // Corners
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',

  // Edges
  horizontal: '═',
  vertical: '║',

  // T-junctions
  tLeft: '╠',
  tRight: '╣',
  tTop: '╦',
  tBottom: '╩',

  // Cross
  cross: '╬',

  // Single line variants
  singleHorizontal: '─',
  singleVertical: '│',
};
