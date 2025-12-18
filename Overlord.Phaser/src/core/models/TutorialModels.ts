/**
 * TutorialModels - Data structures for tutorial system
 * Story 1-4: Tutorial Step Guidance System
 *
 * Defines:
 * - TutorialAction union type with specific action types
 * - TutorialStep interface with structured actions
 * - HighlightConfig for visual highlighting
 * - Validation helpers
 */

/**
 * All supported tutorial action types
 */
export type TutorialActionType =
  | 'click_button'
  | 'select_planet'
  | 'open_menu'
  | 'start_construction'
  | 'end_turn'
  | 'purchase_craft'
  | 'commission_platoon';

/**
 * Click button action - requires target button ID
 */
interface ClickButtonAction {
  type: 'click_button';
  target: string;
}

/**
 * Select planet action - optional target planet name
 */
interface SelectPlanetAction {
  type: 'select_planet';
  target?: string;
}

/**
 * Open menu action - requires menu identifier
 */
interface OpenMenuAction {
  type: 'open_menu';
  menu: string;
}

/**
 * Start construction action - requires building type
 */
interface StartConstructionAction {
  type: 'start_construction';
  building: string;
}

/**
 * End turn action - no parameters needed
 */
interface EndTurnAction {
  type: 'end_turn';
}

/**
 * Purchase craft action - requires craft type
 */
interface PurchaseCraftAction {
  type: 'purchase_craft';
  craftType: string;
}

/**
 * Commission platoon action - no parameters needed
 */
interface CommissionPlatoonAction {
  type: 'commission_platoon';
}

/**
 * Union type of all tutorial actions
 */
export type TutorialAction =
  | ClickButtonAction
  | SelectPlanetAction
  | OpenMenuAction
  | StartConstructionAction
  | EndTurnAction
  | PurchaseCraftAction
  | CommissionPlatoonAction;

/**
 * Tutorial step with structured action
 */
export interface TutorialStep {
  step: number;
  text: string;
  highlight?: string;
  action: TutorialAction;
}

/**
 * Legacy TutorialStep interface (string-based action) for backward compatibility
 */
export interface LegacyTutorialStep {
  step: number;
  text: string;
  highlight?: string;
  action?: string;
}

/**
 * Highlight type options
 */
export type HighlightType = 'glow' | 'spotlight' | 'arrow';

/**
 * Configuration for highlighting UI elements
 */
export interface HighlightConfig {
  elementId: string;
  type: HighlightType;
  pulsate?: boolean;
}

/**
 * Validate that a tutorial action is properly formed
 * @param action The action to validate
 * @returns true if valid, false otherwise
 */
export function isValidTutorialAction(action: TutorialAction): boolean {
  if (!action || !action.type) {
    return false;
  }

  switch (action.type) {
    case 'click_button':
      return !!(action as ClickButtonAction).target;

    case 'select_planet':
      // Target is optional for select_planet
      return true;

    case 'open_menu':
      return !!(action as OpenMenuAction).menu;

    case 'start_construction':
      return !!(action as StartConstructionAction).building;

    case 'purchase_craft':
      return !!(action as PurchaseCraftAction).craftType;

    case 'end_turn':
    case 'commission_platoon':
      // These require no additional parameters
      return true;

    default:
      return false;
  }
}

/**
 * Helper to create a tutorial step
 * @param step Step number
 * @param text Instruction text
 * @param action Action to complete
 * @param highlight Optional highlight target
 * @returns TutorialStep
 */
export function createTutorialStep(
  step: number,
  text: string,
  action: TutorialAction,
  highlight?: string,
): TutorialStep {
  return {
    step,
    text,
    action,
    highlight,
  };
}

/**
 * Parse a legacy string-based action to structured TutorialAction
 * @param actionString Legacy action string (e.g., "click:build-button")
 * @returns TutorialAction or undefined if invalid
 */
export function parseActionString(actionString: string): TutorialAction | undefined {
  if (!actionString) {
    return undefined;
  }

  const parts = actionString.split(':');
  const actionType = parts[0];
  const target = parts[1];

  switch (actionType) {
    case 'click':
    case 'click_button':
      return target ? { type: 'click_button', target } : undefined;

    case 'select':
    case 'select_planet':
      return { type: 'select_planet', target };

    case 'menu':
    case 'open_menu':
      return target ? { type: 'open_menu', menu: target } : undefined;

    case 'build':
    case 'start_construction':
      return target ? { type: 'start_construction', building: target } : undefined;

    case 'end_turn':
      return { type: 'end_turn' };

    case 'purchase':
    case 'purchase_craft':
      return target ? { type: 'purchase_craft', craftType: target } : undefined;

    case 'commission':
    case 'commission_platoon':
      return { type: 'commission_platoon' };

    default:
      return undefined;
  }
}
