/**
 * FlashConflictsScene - Entry point for Flash Conflicts tutorials and tactical scenarios
 *
 * Story 1-1: Flash Conflicts Menu Access (MINIMAL IMPLEMENTATION for Story 1-2)
 * Story 1-2: Scenario Selection Interface (FULL INTEGRATION)
 *
 * This is a minimal scene created to support Story 1-2 integration.
 * Full implementation of FlashConflictsScene will be completed in Story 1-1.
 */

import Phaser from 'phaser';
import { ScenarioManager } from '@core/ScenarioManager';
import { getCompletionService } from '@core/ScenarioCompletionService';
import { ScenarioListPanel } from './ui/ScenarioListPanel';
import { ScenarioDetailPanel } from './ui/ScenarioDetailPanel';
import { Scenario } from '@core/models/ScenarioModels';
import { TopMenuBar } from './ui/TopMenuBar';

export class FlashConflictsScene extends Phaser.Scene {
  private scenarioManager!: ScenarioManager;
  private listPanel!: ScenarioListPanel;
  private detailPanel!: ScenarioDetailPanel;
  private titleText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'FlashConflictsScene' });
  }

  create(): void {
    // Initialize scenario manager
    this.scenarioManager = new ScenarioManager();

    // Create background
    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Create top menu bar
    new TopMenuBar(this);

    // Create title (positioned below menu bar)
    this.titleText = this.add.text(
      this.cameras.main.centerX,
      TopMenuBar.getHeight() + 20,
      'Flash Conflicts',
      {
        fontSize: '48px',
        color: '#00bfff',
        fontStyle: 'bold',
      },
    );
    this.titleText.setOrigin(0.5, 0);
    this.titleText.setScrollFactor(0);

    // Create scenario list panel
    this.listPanel = new ScenarioListPanel(this);
    this.listPanel.onScenarioSelected = (scenario: Scenario) => {
      this.showScenarioDetail(scenario);
    };
    this.listPanel.onClose = () => {
      // Return to main menu (placeholder)
      console.log('Return to main menu');
    };

    // Create scenario detail panel
    this.detailPanel = new ScenarioDetailPanel(this, this.scenarioManager);
    this.detailPanel.onStartScenario = (scenario: Scenario) => {
      this.startScenario(scenario);
    };
    this.detailPanel.onBack = () => {
      this.detailPanel.hide();
      this.listPanel.show();
    };

    // Load scenarios and show list
    this.loadScenarios();
  }

  /**
   * Load available scenarios
   */
  private async loadScenarios(): Promise<void> {
    // In full implementation, this will load from JSON files
    // For now, we'll wait for Task 6 to create the sample scenario

    // Get all scenarios and show list
    const scenarios = this.scenarioManager.getScenarios();
    this.listPanel.setScenarios(scenarios);

    // Load completion data (Story 1-5)
    this.loadCompletionData(scenarios);

    this.listPanel.show();
  }

  /**
   * Load completion data for scenarios
   * Story 1-5: Scenario Completion and Results Display
   */
  private loadCompletionData(scenarios: Scenario[]): void {
    const completionService = getCompletionService();
    const completionData = new Map<string, { completed: boolean; starRating: number }>();

    for (const scenario of scenarios) {
      const completion = completionService.getCompletion(scenario.id);
      if (completion) {
        completionData.set(scenario.id, {
          completed: completion.completed,
          starRating: completion.starRating,
        });
      }
    }

    this.listPanel.setCompletionData(completionData);
  }

  /**
   * Show scenario detail panel
   */
  private showScenarioDetail(scenario: Scenario): void {
    this.listPanel.hide();
    this.detailPanel.setScenario(scenario);
    this.detailPanel.show();
  }

  /**
   * Start a scenario
   */
  private startScenario(scenario: Scenario): void {
    console.log(`Starting scenario: ${scenario.id}`);
    // TODO: Implement scenario initialization in Story 1-3
    // For now, just hide the detail panel
    this.detailPanel.hide();
  }
}
