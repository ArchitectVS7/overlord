/**
 * TutorialActionDetector - Monitor user actions for tutorial completion
 * Story 1-4: Tutorial Step Guidance System
 *
 * Features:
 * - Watch for specific action types
 * - Detect clicks, menu opens, selections, etc.
 * - Fire events when required action is completed
 * - Support all TutorialAction types
 */

import { TutorialAction } from './models/TutorialModels';

/**
 * Detects user actions for tutorial step completion
 */
export class TutorialActionDetector {
  private watchedAction: TutorialAction | null = null;

  // Event callback when action is completed
  public onActionCompleted?: () => void;

  /**
   * Set the action to watch for
   * @param action The tutorial action to detect
   */
  public watchFor(action: TutorialAction): void {
    this.watchedAction = action;
  }

  /**
   * Clear the watched action
   */
  public clear(): void {
    this.watchedAction = null;
  }

  /**
   * Check if currently watching for an action
   */
  public isWatching(): boolean {
    return this.watchedAction !== null;
  }

  /**
   * Get the currently watched action
   */
  public getCurrentAction(): TutorialAction | null {
    return this.watchedAction;
  }

  /**
   * Report a button click event
   * @param buttonId ID of the clicked button
   */
  public reportButtonClick(buttonId: string): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'click_button' &&
        this.watchedAction.target === buttonId) {
      this.completeAction();
    }
  }

  /**
   * Report a planet selection event
   * @param planetName Name of the selected planet
   */
  public reportPlanetSelection(planetName: string): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'select_planet') {
      // If target is specified, must match; otherwise any planet works
      if (!this.watchedAction.target || this.watchedAction.target === planetName) {
        this.completeAction();
      }
    }
  }

  /**
   * Report a menu open event
   * @param menuId ID of the opened menu
   */
  public reportMenuOpen(menuId: string): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'open_menu' &&
        this.watchedAction.menu === menuId) {
      this.completeAction();
    }
  }

  /**
   * Report a construction start event
   * @param buildingType Type of building being constructed
   */
  public reportConstructionStart(buildingType: string): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'start_construction' &&
        this.watchedAction.building === buildingType) {
      this.completeAction();
    }
  }

  /**
   * Report turn end event
   */
  public reportTurnEnd(): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'end_turn') {
      this.completeAction();
    }
  }

  /**
   * Report a craft purchase event
   * @param craftType Type of craft purchased
   */
  public reportCraftPurchase(craftType: string): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'purchase_craft' &&
        this.watchedAction.craftType === craftType) {
      this.completeAction();
    }
  }

  /**
   * Report a platoon commission event
   */
  public reportPlatoonCommission(): void {
    if (!this.watchedAction) return;

    if (this.watchedAction.type === 'commission_platoon') {
      this.completeAction();
    }
  }

  /**
   * Complete the current action and fire callback
   */
  private completeAction(): void {
    this.clear();
    this.onActionCompleted?.();
  }
}
