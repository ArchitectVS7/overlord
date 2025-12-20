/**
 * UITheme.ts - Centralized UI styling constants
 *
 * This file defines the visual language for Overlord's UI.
 * All UI components should import from here to ensure consistency.
 *
 * Design Philosophy:
 * - Retro-futuristic aesthetic (1990s sci-fi meets modern polish)
 * - High contrast for readability
 * - Consistent color coding for resources and states
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

/**
 * Core colors - the foundation of the UI
 */
export const COLORS = {
  // Backgrounds
  PANEL_BG: 0x1a1a2e,           // Dark blue-black, main panel background
  PANEL_BG_LIGHT: 0x252540,     // Slightly lighter for cards/sections
  PANEL_BG_DARK: 0x0a0a1a,      // Darker for nested elements, inputs
  OVERLAY: 0x000000,            // Pure black for modal overlays
  CONTENT_BG: 0x202040,         // Content area background
  SIDEBAR_BG: 0x151525,         // Sidebar/secondary areas

  // Accent colors
  PRIMARY: 0x00bfff,            // Cyan - main accent (borders, highlights)
  SECONDARY: 0x4488ff,          // Blue - secondary accent
  SUCCESS: 0x44aa44,            // Green - positive actions, success
  WARNING: 0xffaa00,            // Orange - warnings
  DANGER: 0xff4444,             // Red - errors, dangerous actions

  // Faction colors
  PLAYER: 0x00bfff,             // Cyan for player-owned
  ENEMY: 0xff4444,              // Red for AI-owned
  NEUTRAL: 0x808080,            // Gray for neutral

  // Button backgrounds
  BUTTON_PRIMARY: 0x002244,     // Dark blue - standard buttons
  BUTTON_PRIMARY_HOVER: 0x003366,
  BUTTON_SUCCESS: 0x44aa44,     // Green - confirm/commission
  BUTTON_SUCCESS_HOVER: 0x55bb55,
  BUTTON_DANGER: 0x442222,      // Dark red - delete/disband
  BUTTON_DANGER_HOVER: 0x553333,
  BUTTON_DISABLED: 0x333333,    // Grayed out
  BUTTON_SECONDARY: 0x2a2a4e,   // Subtle secondary action
  BUTTON_SECONDARY_HOVER: 0x3a3a5e,

  // Borders
  BORDER_PRIMARY: 0x00bfff,     // Cyan border
  BORDER_SUBTLE: 0x2a2a4e,      // Subtle divider
  BORDER_HIGHLIGHT: 0x4488ff,   // Highlighted state

  // Dividers
  DIVIDER: 0x444444,            // Section dividers

  // Password/Input strength colors (CSS hex format for DOM elements)
  STRENGTH_WEAK: '#ff4444',
  STRENGTH_FAIR: '#ffaa00',
  STRENGTH_GOOD: '#44aa44',
  STRENGTH_STRONG: '#00bfff',

} as const;

/**
 * Text colors (CSS format for Phaser text objects)
 */
export const TEXT_COLORS = {
  // Primary text
  PRIMARY: '#ffffff',           // White - main text
  SECONDARY: '#aaaaaa',         // Gray - labels, secondary text
  MUTED: '#666666',             // Darker gray - disabled, hints

  // Accent text
  ACCENT: '#00bfff',            // Cyan - emphasis, links, headers
  SUCCESS: '#44ff44',           // Bright green - success messages
  WARNING: '#ffaa00',           // Orange - warnings
  DANGER: '#ff4444',            // Red - errors

  // Resource colors (standardized)
  CREDITS: '#ffd700',           // Gold
  MINERALS: '#c0c0c0',          // Silver
  FUEL: '#ff6600',              // Orange
  FOOD: '#66cc66',              // Green (was inconsistent, now unified)
  ENERGY: '#00ffff',            // Cyan

  // Income display
  INCOME_POSITIVE: '#88ccff',   // Light blue
  INCOME_NEGATIVE: '#ff8888',   // Light red

  // Status colors
  MORALE_HAPPY: '#00cc00',      // Green
  MORALE_NEUTRAL: '#cccc00',    // Yellow
  MORALE_UNHAPPY: '#cc0000',    // Red

} as const;

/**
 * Resource colors as a lookup object
 */
export const RESOURCE_COLORS = {
  credits: TEXT_COLORS.CREDITS,
  minerals: TEXT_COLORS.MINERALS,
  fuel: TEXT_COLORS.FUEL,
  food: TEXT_COLORS.FOOD,
  energy: TEXT_COLORS.ENERGY,
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Font configuration
 */
export const FONTS = {
  // Font families
  PRIMARY: 'monospace',         // Main UI font (retro feel)

  // Font sizes
  SIZE_TITLE: '24px',           // Panel titles
  SIZE_HEADER: '18px',          // Section headers
  SIZE_BODY: '14px',            // Body text, buttons
  SIZE_SMALL: '12px',           // Labels, secondary info
  SIZE_TINY: '10px',            // Badges, fine print

  // Common text styles (for Phaser.Types.GameObjects.Text.TextStyle)
} as const;

/**
 * Pre-built text styles for consistency
 */
export const TEXT_STYLES = {
  TITLE: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_TITLE,
    color: TEXT_COLORS.ACCENT,
    fontStyle: 'bold',
  },

  HEADER: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_HEADER,
    color: TEXT_COLORS.PRIMARY,
    fontStyle: 'bold',
  },

  BODY: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_BODY,
    color: TEXT_COLORS.PRIMARY,
  },

  LABEL: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_SMALL,
    color: TEXT_COLORS.SECONDARY,
  },

  BUTTON: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_BODY,
    color: TEXT_COLORS.ACCENT,
    fontStyle: 'bold',
  },

  BUTTON_DANGER: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_BODY,
    color: TEXT_COLORS.DANGER,
    fontStyle: 'bold',
  },

  SMALL: {
    fontFamily: FONTS.PRIMARY,
    fontSize: FONTS.SIZE_SMALL,
    color: TEXT_COLORS.SECONDARY,
  },
} as const;

// ============================================================================
// PANEL STYLING
// ============================================================================

export const PANEL = {
  // Background
  BG_COLOR: COLORS.PANEL_BG,
  BG_ALPHA: 0.95,

  // Border
  BORDER_WIDTH: 2,
  BORDER_COLOR: COLORS.BORDER_PRIMARY,
  BORDER_RADIUS: 8,

  // Overlay (behind modal panels)
  OVERLAY_COLOR: COLORS.OVERLAY,
  OVERLAY_ALPHA: 0.7,

  // Spacing
  PADDING: 16,
  HEADER_HEIGHT: 48,

  // Depth layering
  DEPTH_OVERLAY: 1000,
  DEPTH_PANEL: 1100,
  DEPTH_MODAL: 1200,
  DEPTH_NOTIFICATION: 2000,
} as const;

// ============================================================================
// BUTTON STYLING
// ============================================================================

export const BUTTON = {
  // Dimensions
  HEIGHT: 36,
  MIN_WIDTH: 80,
  PADDING_X: 16,
  PADDING_Y: 8,
  BORDER_RADIUS: 4,

  // Primary button (default)
  PRIMARY: {
    bg: COLORS.BUTTON_PRIMARY,
    bgHover: COLORS.BUTTON_PRIMARY_HOVER,
    text: TEXT_COLORS.ACCENT,
    border: COLORS.BORDER_PRIMARY,
  },

  // Success/Confirm button
  SUCCESS: {
    bg: COLORS.BUTTON_SUCCESS,
    bgHover: COLORS.BUTTON_SUCCESS_HOVER,
    text: TEXT_COLORS.PRIMARY,
    border: COLORS.SUCCESS,
  },

  // Danger/Delete button
  DANGER: {
    bg: COLORS.BUTTON_DANGER,
    bgHover: COLORS.BUTTON_DANGER_HOVER,
    text: TEXT_COLORS.DANGER,
    border: COLORS.DANGER,
  },

  // Secondary/Cancel button
  SECONDARY: {
    bg: COLORS.BUTTON_SECONDARY,
    bgHover: COLORS.BUTTON_SECONDARY_HOVER,
    text: TEXT_COLORS.SECONDARY,
    border: COLORS.BORDER_SUBTLE,
  },

  // Disabled state
  DISABLED: {
    bg: COLORS.BUTTON_DISABLED,
    text: TEXT_COLORS.MUTED,
    border: COLORS.BORDER_SUBTLE,
  },
} as const;

// ============================================================================
// DIFFICULTY COLORS
// ============================================================================

export const DIFFICULTY_COLORS = {
  easy: 0x44aa44,     // Green
  medium: 0xaaaa44,   // Yellow
  hard: 0xaa6644,     // Orange
  expert: 0xaa4444,   // Red
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const ANIMATION = {
  // Durations (ms)
  PANEL_SLIDE: 150,
  BUTTON_HOVER: 100,
  NOTIFICATION_FADE: 300,
  RESOURCE_CHANGE: 1000,

  // Easing
  EASE_OUT: 'Power2',
  EASE_IN_OUT: 'Sine.easeInOut',
} as const;

// ============================================================================
// HUD SPECIFIC
// ============================================================================

export const HUD = {
  // ResourceHUD
  RESOURCE_HUD: {
    width: 220,
    height: 160,
    bgAlpha: 0.85,
  },

  // TurnHUD
  TURN_HUD: {
    width: 280,
    height: 100,
    bgAlpha: 0.8,
  },

  // TopMenuBar
  MENU_BAR: {
    height: 32,
    bgAlpha: 0.9,
  },
} as const;
