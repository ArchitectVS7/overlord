/**
 * TutorialManager - Orchestrates tutorial step flow
 * Story 1-4: Tutorial Step Guidance System
 *
 * Features:
 * - Load tutorial steps from scenario config
 * - Track current step index
 * - Fire events on step changes
 * - Handle step completion with delay
 * - Support skip and reset operations
 */

import { Scenario } from './models/ScenarioModels';
import { TutorialStep } from './models/TutorialModels';

/**
 * Manages tutorial progression and step flow
 */
export class TutorialManager {
  private steps: TutorialStep[] = [];
  private currentIndex: number = 0;
  private active: boolean = false;
  private completed: boolean = false;
  private stepDelay: number = 1000; // 1 second default delay between steps

  // Event callbacks
  public onStepStarted?: (step: TutorialStep) => void;
  public onStepCompleted?: (step: TutorialStep) => void;
  public onTutorialComplete?: () => void;

  /**
   * Initialize tutorial from scenario configuration
   * @param scenario The scenario containing tutorial steps
   * @returns true if tutorial was initialized, false if no tutorial steps
   */
  public initialize(scenario: Scenario): boolean {
    if (!scenario.tutorialSteps || scenario.tutorialSteps.length === 0) {
      this.active = false;
      return false;
    }

    this.steps = [...scenario.tutorialSteps];
    this.currentIndex = 0;
    this.active = true;
    this.completed = false;

    // Start the first step
    this.startStep(0);

    return true;
  }

  /**
   * Get the current tutorial step
   * @returns Current step or undefined if not initialized
   */
  public getCurrentStep(): TutorialStep | undefined {
    if (!this.active || this.steps.length === 0) {
      return undefined;
    }
    return this.steps[this.currentIndex];
  }

  /**
   * Get the current step index (0-based)
   */
  public getCurrentStepIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get total number of steps
   */
  public getStepCount(): number {
    return this.steps.length;
  }

  /**
   * Check if tutorial is currently active
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Check if tutorial is complete
   */
  public isComplete(): boolean {
    return this.completed;
  }

  /**
   * Complete the current step and advance after delay
   */
  public completeCurrentStep(): void {
    if (!this.active || this.completed) {
      return;
    }

    const currentStep = this.getCurrentStep();
    if (currentStep) {
      this.onStepCompleted?.(currentStep);
    }

    // Check if this was the last step
    if (this.currentIndex >= this.steps.length - 1) {
      // Tutorial complete after delay
      setTimeout(() => {
        this.completed = true;
        this.onTutorialComplete?.();
      }, this.stepDelay);
    } else {
      // Advance to next step after delay
      setTimeout(() => {
        this.startStep(this.currentIndex + 1);
      }, this.stepDelay);
    }
  }

  /**
   * Skip the tutorial entirely
   */
  public skip(): void {
    if (!this.active) {
      return;
    }

    this.completed = true;
    this.onTutorialComplete?.();
  }

  /**
   * Reset the tutorial state
   */
  public reset(): void {
    this.steps = [];
    this.currentIndex = 0;
    this.active = false;
    this.completed = false;
  }

  /**
   * Set the delay between steps in milliseconds
   * @param delay Delay in milliseconds
   */
  public setStepDelay(delay: number): void {
    this.stepDelay = delay;
  }

  /**
   * Start a specific step
   * @param index Step index to start
   */
  private startStep(index: number): void {
    if (index < 0 || index >= this.steps.length) {
      return;
    }

    this.currentIndex = index;
    const step = this.steps[index];
    this.onStepStarted?.(step);
  }
}
